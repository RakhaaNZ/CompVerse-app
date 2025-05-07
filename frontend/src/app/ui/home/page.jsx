"use client";
import Navbar from "../../../components/navbar/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030210]">
      <Navbar />

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center">Welcome to CompVerse</h1>
      </main>
    </div>
  );
}
