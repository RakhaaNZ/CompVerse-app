import { useEffect, useState } from "react"

export default function PosterPreview({ file, fallback, alt }) {
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      return () => {
        URL.revokeObjectURL(objectUrl) // Bersihkan saat file berubah
      }
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <img
      src={preview || fallback || "/no-image.png"}
      alt={alt || "Poster"}
      className="w-full h-64 object-cover rounded-lg mb-4"
    />
  )
}
