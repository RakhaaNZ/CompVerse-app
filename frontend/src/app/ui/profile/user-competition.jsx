"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, User } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import Image from "next/image";

export default function UserCompetition() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [competitions, setCompetitions] = useState([]);

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

  useEffect(() => {
    const fetchCompetitions = async () => {
      if (!profile) return;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken =
          session?.access_token || localStorage.getItem("access_token");

        const res = await fetch("http://localhost:8000/api/my-competitions/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCompetitions(data);
        } else {
          console.error("Failed to fetch competitions");
        }
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };

    fetchCompetitions();
  }, [profile]);

  if (!profile) {
    return (
      <div className="text-white text-center mt-10">Loading profile...</div>
    );
  }

  return (
    <div className="w-full h-full min-h-[820px] flex flex-col gap-5 xl:gap-15 justify-start items-center">
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

          <div className="w-full h-full flex flex-col justify-center items-center md:items-start gap-1 pl-[20px]">
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
      <div className="w-full h-full border-2 border-white rounded-[26px] md:rounded-[40px] px-10 py-8">
        <div className="flex flex-col gap-6">
          <div className="w-full h-full flex items-start justify-center sm:justify-start">
            <h1 className="text-white text-[18px] md:text-[24px] font-[400] underline">
              Registered Competitions
            </h1>
          </div>

          <div
            className={`flex flex-wrap items-center gap-10 mt-4 ${
              competitions.length <= 1 ? "justify-between" : "justify-around"
            }`}
          >
            {competitions.length > 0 ? (
              competitions.map((comp) => (
                <div
                  key={comp.id}
                  className="w-[300px] h-auto bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="w-full h-[280px] sm:h-[400px] overflow-hidden border-b border-black">
                    {comp.poster_competition ? (
                      <img
                        src={comp.poster_competition}
                        alt={comp.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center">
                        <span className="text-[#2541CD]">No Poster</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-black space-y-1">
                    <h3 className="font-bold text-md md:text-lg text-[#2541CD] truncate">
                      {comp.title}
                    </h3>
                    <p className="text-[12px] md:text-sm text-gray-700">
                      Category: {comp.category}
                    </p>
                    <p className="text-[12px] md:text-sm text-gray-700">
                      Type: {comp.type}
                    </p>
                    <p className="text-[12px] md:text-sm text-gray-700">
                      Date:{" "}
                      {new Date(comp.start_date).toLocaleDateString("en-EN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-[432px] text-white text-center flex items-center justify-center">
                No Competitions are Registered
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
