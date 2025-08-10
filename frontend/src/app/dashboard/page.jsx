"use client"
import { useSession } from "../../hooks/useSession"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import GreatingCard from "../../components/card/greatingcard"
import Form from "../../components/formcard/Form"

export default function DashboardPage() {
  return (
    <div>
      <GreatingCard />
      <div className="text-5xl m-3">Create Competitions</div>
      <Form />
    </div>
  )
}
