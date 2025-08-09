"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Check, X, Upload, User } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import Image from "next/image";

export default function UserSection() {
  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");

      if (!accessToken) return;

      try {
        const res = await fetch("http://localhost:8000/api/users/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setEditValue(value || "");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSaveEdit = async () => {
    if (!profile || !editingField) return;

    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");

      const updatedProfile = {
        ...profile,
        [editingField]: editValue,
      };

      const res = await fetch(
        `http://localhost:8000/api/users/${profile.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setProfile(data);
      setEditingField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Session expired. Please sign in again");
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Hanya file JPEG, PNG, atau WEBP yang diperbolehkan");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `user-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(uploadError.message || "Failed to upload image");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

      console.log("Generated URL:", publicUrl);

      const res = await fetch(
        `http://localhost:8000/api/users/${profile.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            profile_picture: `${publicUrl}?t=${Date.now()}`,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Error: ${error.message || "Failed to upload image"}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!profile) {
    return (
      <div className="text-white text-center mt-10">Loading profile...</div>
    );
  }

  return (
    <div className="w-full h-full min-h-[820px] flex flex-col gap-5 xl:gap-15 justify-center items-center">
      {/* Header  */}
      <div className="w-full h-[180px] md:h-[200px] border-2 border-white rounded-[26px] md:rounded-[40px] px-20 py-4 flex justify-start items-center">
        <div className="w-full h-full flex flex-col md:flex-row justify-start items-center">
          <div className="relative group">
            <div className="w-18 md:w-22 h-18 md:h-20 rounded-full ring-2 ring-white overflow-hidden">
              {profile.profile_picture ? (
                <Image
                  src={profile.profile_picture}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-[#2541CD] rounded-full p-2 cursor-pointer"
              disabled={uploading}
            >
              {uploading ? (
                <span className="loading-spinner"></span>
              ) : (
                <Upload className="w-4 h-4 text-white" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="w-full h-full flex flex-col justify-center items-center md:items-start gap-1 pl-0 md:pl-[20px]">
            <h1 className="text-white text-[18px] md:text-[22px] font-[400]">
              {profile.full_name || "No name"}
            </h1>
            <p className="text-white/80 text-[14px] md:text-[18px] font-[400]">
              {profile.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="w-full h-full border-2 border-white rounded-[26px] md:rounded-[40px] flex flex-col lg:flex-row justify-center items-center md:items-start gap-6 lg:gap-25 p-6 md:p-15">
        <div className="w-full lg:w-[50%] h-full flex flex-col gap-6">
          {[
            {
              field: "first_name",
              label: "First Name",
              value: profile.first_name,
            },
            {
              field: "last_name",
              label: "Last Name",
              value: profile.last_name,
            },
            { field: "gender", label: "Gender", value: profile.gender },
            { field: "age", label: "Age", value: profile.age },
          ].map((item) => (
            <ProfileField
              key={item.field}
              field={item.field}
              label={item.label}
              value={item.value}
              editingField={editingField}
              editValue={editValue}
              onEditChange={setEditValue}
              onEditClick={handleEditClick}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              isLoading={isLoading}
            />
          ))}
        </div>

        <div className="w-full lg:w-[50%] h-full flex flex-col gap-6">
          {[
            { field: "location", label: "Location", value: profile.location },
            {
              field: "field_of_study",
              label: "Field of Study",
              value: profile.field_of_study,
            },
            {
              field: "institution_company",
              label: "Institution / Company",
              value: profile.institution_company,
            },
          ].map((item) => (
            <ProfileField
              key={item.field}
              field={item.field}
              label={item.label}
              value={item.value}
              editingField={editingField}
              editValue={editValue}
              onEditChange={setEditValue}
              onEditClick={handleEditClick}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  field,
  label,
  value,
  editingField,
  editValue,
  onEditChange,
  onEditClick,
  onSave,
  onCancel,
  isLoading,
}) {
  const isEditing = editingField === field;

  return (
    <div className="w-full h-auto flex flex-col gap-2">
      <h1 className="text-white text-[14px] md:text-[22px] font-[400]">
        {label}
      </h1>
      <div className="w-full h-[40px] md:h-[50px] flex flex-row justify-between items-center px-6 py-2 ring-white ring-1 md:ring-2 rounded-[16px] md:rounded-[20px]">
        {isEditing ? (
          <input
            type={field === "age" ? "number" : "text"}
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            className="flex-1 bg-transparent text-white/80 text-[12px] md:text-[18px] font-[400] outline-none"
            autoFocus
          />
        ) : (
          <h1 className="text-white/80 text-[12px] md:text-[18px] font-[400]">
            {value || "-"}
          </h1>
        )}
        <div className="w-[50px] h-full flex flex-row justify-end items-center">
          <div className="w-[1px] md:w-[2px] h-[90%] md:h-full bg-white"></div>
          {isEditing ? (
            <div className="flex gap-2 ml-2">
              <button
                onClick={onSave}
                disabled={isLoading}
                className="text-green-500 hover:text-green-400 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="text-red-500 hover:text-red-400 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onEditClick(field, value)}
              className="cursor-pointer w-full h-full flex justify-end"
            >
              <Pencil className="w-[15px] md:w-[25px] h-auto text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
