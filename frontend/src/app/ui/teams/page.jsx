"use client"
import React from "react"
import TeamsCard from "../../../components/TeamsCard/page"

export default function TeamsPage() {
  return (
    <section className="h-full bg-[#030210] text-white px-6 py-10 ">
      <h1 className="w-full text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-bold text-white text-balance drop-shadow-[0px_0px_5px_#fff] mb-[30px] text-center">
        Find your Team’s and Be a Winner
      </h1>
      <TeamsCard />
    </section>
  )
}
