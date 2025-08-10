"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../../ui/button";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditCompetitionPage() {
  const params = useParams();
  const id = params?.id;
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    max_participants: "",
    type: "",
    is_team_based: "",
    start_date: "",
    end_date: "",
    close_registration: "",
    description: "",
    poster: null,
    poster_competition: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/competitions/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch competition data");

        const data = await res.json();

        setFormData({
          ...data,
          is_team_based: data.is_team_based?.toString(),
          poster: null,
          poster_competition: data.poster_competition || "",
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Update form data
      setFormData((prev) => ({
        ...prev,
        poster: file,
      }));
    }
  };

  const handleUpload = async () => {
    if (!formData.poster) return;

    setUploading(true);

    try {
      const file = formData.poster;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `competition-posters/${fileName}`;

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("competition-posters")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("competition-posters").getPublicUrl(filePath);

      // Update form data with new URL
      setFormData((prev) => ({
        ...prev,
        poster_competition: `${publicUrl}?t=${Date.now()}`,
        poster: null,
      }));

      // Clear preview
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem("access_token");
    const formDataToSend = new FormData();

    // Append all form data except poster (we already have poster_competition URL)
    Object.keys(formData).forEach((key) => {
      if (key !== "poster" && formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/competitions/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update competition");
      }

      const updatedData = await res.json();

      // Update form data with the response
      setFormData((prev) => ({
        ...prev,
        ...updatedData,
        poster: null,
        poster_competition: updatedData.poster_competition || "",
        is_team_based: updatedData.is_team_based?.toString(),
      }));

      window.location.href = "/dashboard/history";

      alert("Competition updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-6xl h-auto bg-gradient-to-tl from-blue-500">
      {/* Card Preview */}
      <div className="md:w-1/2 w-full bg-white border rounded-xl shadow p-4">
        <div className="">
          <img
            src={imagePreview || formData.poster_competition || "/no-image.png"}
            alt="Poster"
            className="w-full h-64 object-cover rounded-xl mb-4 border"
          />
        </div>

        <h2 className="text-xl font-bold">{formData.title || "Untitled"}</h2>
        <p className="text-black pt-5">Category:</p>
        <p className="text-sm text-gray-600 mb-1 border-b-1">
          {formData.category}
        </p>
        <p className="text-black pt-5">Participants:</p>
        <p className="text-sm text-gray-600 mb-1 border-b-1">
          {formData.max_participants}
        </p>
        <p className="text-black pt-5">Type:</p>
        <p className="text-sm text-gray-600 mb-1 border-b-1">{formData.type}</p>
        <p className="text-black pt-5">Team Based:</p>
        <p className="text-sm text-gray-600 mb-1 border-b-1">
          {formData.is_team_based === "true" ? "Yes" : "No"}
        </p>
        <p className="text-black pt-5">Description</p>
        <p className="text-sm text-gray-600 mt-2 border-b-1">
          {formData.description}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 w-full md:w-1/2">
        {[
          { label: "Title", name: "title", type: "text" },
          {
            label: "Max Participants",
            name: "max_participants",
            type: "number",
          },
          { label: "Start Date", name: "start_date", type: "datetime-local" },
          { label: "End Date", name: "end_date", type: "datetime-local" },
          {
            label: "Close Registration",
            name: "close_registration",
            type: "datetime-local",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Art">Art & Design</option>
            <option value="Science">Science</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="Team">Team</option>
            <option value="Individual">Individual</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Team Based?</label>
          <select
            name="is_team_based"
            value={formData.is_team_based}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Option</option>
            <option value="true">Yes (Team)</option>
            <option value="false">No (Individual)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter competition description"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Poster</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="mb-3"
          />

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!formData.poster || uploading}
            className="w-full mb-3"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white mt-4"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
