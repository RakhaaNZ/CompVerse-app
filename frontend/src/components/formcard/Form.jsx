"use client"
import React, { useState } from "react"
import ImageUp from "./ImageUp"
import { Button } from "../../app/ui/button"
import { useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

function Form() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    max_participants: "",
    description: "",
    start_date: "",
    end_date: "",
    close_registration: "",
    is_team_based: "",
    type: "",
    poster_competition: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "type") {
      setFormData({
        ...formData,
        type: value,
        is_team_based: value === "Team", // boolean true/false
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleImageChange = (url) => {
    setFormData({ ...formData, poster_competition: url })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formatDate = (dateString) => {
      if (!dateString) return null
      return new Date(dateString).toISOString()
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      start_date: formatDate(formData.start_date),
      end_date: formatDate(formData.end_date),
      close_registration: formatDate(formData.close_registration),
      max_participants: parseInt(formData.max_participants),
      is_team_based: formData.is_team_based,
      type: formData.type,
      poster_competition: formData.poster_competition || null,
    }

    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch("http://127.0.0.1:8000/api/competitions/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Backend error details:", errorData)
        throw new Error(errorData.detail || JSON.stringify(errorData))
      }

      const result = await res.json()
      alert("✅ Competition added successfully!")
      console.log("Success response:", result)

      setFormData({
        title: "",
        category: "",
        max_participants: "",
        description: "",
        start_date: "",
        end_date: "",
        close_registration: "",
        is_team_based: "",
        type: "",
        poster_competition: "",
      })
      window.location.href = "/dashboard/history"
    } catch (error) {
      console.error("❌ Error:", error)
      alert(`❌ Error: ${error.message}`)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Gagal ambil session", error)
      } else if (session?.user) {
        console.log("✅ UID admin kamu adalah:", session.user.id)
      }
    }

    getSession()
  }, [])

  return (
    <div className="w-300 h-auto bg-gradient-to-tl py-10 mt-5 from-blue-500 rounded-4xl">
      <form
        onSubmit={handleSubmit}
        className="px-5 text-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="flex flex-col">
          <label>Title / Name of Competition</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            className="w-full h-30 mt-2 border rounded-2xl px-5 py-2"
            placeholder="Competition Title"
            onChange={handleChange}
            required
          />

          <label className="mt-5">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-2 border rounded-2xl px-5 py-2"
            required
          >
            <option value="">Select Category</option>
            <option className="text-black" value="Technology">
              Technology
            </option>
            <option className="text-black" value="Business">
              Business
            </option>
            <option className="text-black" value="Art">
              Art & Design
            </option>
            <option className="text-black" value="Science">
              Science
            </option>
            <option className="text-black" value="other">
              Other
            </option>
          </select>

          <label className="mt-5">Max Participants</label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            className="w-full h-30 mt-2 border rounded-2xl px-5 py-2"
            placeholder="Example: 5"
            onChange={handleChange}
            required
          />

          <label className="mt-5">Type</label>
          <select
            name="type"
            value={formData.type}
            className="w-full h-30 mt-2 border rounded-2xl px-5 py-2"
            onChange={handleChange}
            required
          >
            <option className="text-black" value="">
              -- Select Type --
            </option>
            <option className="text-black" value="Team">
              Team
            </option>
            <option className="text-black" value="Individual">
              Individual
            </option>
          </select>

          <label className="mt-5">Competition Poster</label>
          <ImageUp onImageSelect={handleImageChange} />

          <label className="mt-5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            className="w-full mt-2 border rounded-2xl px-5 py-4"
            placeholder="Competition Description"
            rows={4}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-5 text-4xl">Pick the Dates</label>

          <label>Start Date</label>
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            className="w-full mt-2 border rounded-2xl px-5 py-2"
            onChange={handleChange}
            required
          />

          <label className="mt-5">End Date</label>
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            className="w-full mt-2 border rounded-2xl px-5 py-2"
            onChange={handleChange}
            required
          />

          <label className="mt-5">Close Registration</label>
          <input
            type="datetime-local"
            name="close_registration"
            value={formData.close_registration}
            className="w-full mt-2 border rounded-2xl px-5 py-2"
            onChange={handleChange}
            required
          />

          <div className="mt-10">
            <Button
              type="submit"
              className="w-full bg-white text-black hover:text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Form
