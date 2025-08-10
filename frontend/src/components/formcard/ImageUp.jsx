"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function ImageUp({ onImageSelect }) {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error } = await supabase.storage
        .from("competition-posters") // ✅ GANTI INI SESUAI BUCKET
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("competition-posters").getPublicUrl(filePath)

      onImageSelect(publicUrl)
    } catch (error) {
      console.error("Upload failed:", error.message)
      alert("Upload gagal: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        disabled={uploading}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg border"
        />
      )}

      {uploading && <p className="text-sm text-white">Uploading...</p>}
    </div>
  )
}
