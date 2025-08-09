// src/components/competition-card.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import BGCard from "../../public/competition-assets/bg-card.png";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // sesuaikan path
import RegistrationModal from "./registration-modal"; // akan kita buat

export default function CompetitionCard({ competition }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");
      if (!accessToken) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/users/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setCurrentUser(data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (!competition?.id || !currentUser?.id) {
        setChecking(false);
        return;
      }

      setChecking(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const accessToken =
          session?.access_token || localStorage.getItem("access_token");
        const res = await fetch(
          `http://localhost:8000/api/registrations/?competition=${competition.id}&user=${currentUser.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setIsRegistered(Array.isArray(data) && data.length > 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };

    fetchRegistrationStatus();
  }, [competition?.id, currentUser?.id]);

  const registerIndividual = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken =
        session?.access_token || localStorage.getItem("access_token");

      // Use the correct endpoint from your backend
      const res = await fetch("http://localhost:8000/api/registrations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          competition_id: competition.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Registration error:", errData); // Debug log
        throw new Error(
          errData.detail || errData.error || "Registration failed"
        );
      }

      const data = await res.json();
      console.log("Registration success:", data); // Debug log

      setIsRegistered(true);
      alert("Registered successfully!");
    } catch (err) {
      console.error("Registration failed:", err); // Debug log
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleRegisterClick = () => {
    if (checking || busy) return;
    if (isRegistered) return;

    // competition.type might be 'Team' or 'team' depending on your data
    if ((competition.type || "").toLowerCase() === "team") {
      // open modal to choose Find Team / Create Team
      setShowModal(true);
    } else {
      registerIndividual();
    }
  };

  // date formatting & countdown (sama seperti yang kamu punya)
  const startDate = format(
    new Date(competition.start_date),
    "dd MMM yyyy, HH:mm"
  );
  const endDate = format(new Date(competition.end_date), "dd MMM yyyy, HH:mm");
  const closeReg = format(
    new Date(competition.close_registration),
    "dd MMM yyyy, HH:mm"
  );
  const countdown = () => {
    const now = new Date();
    const end = new Date(competition.close_registration);
    const diff = end - now;
    if (diff <= 0) return "Competition ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };
  const isRegistrationClosed =
    new Date(competition.close_registration) < new Date();

  return (
    <>
      <div className="relative w-full max-w-[300px] md:max-w-[650px] h-[700px] md:h-[400px] flex flex-col md:flex-row gap-[24px] outline-2 outline-white rounded-[40px] px-8 py-6 backdrop-blur-3xl">
        {/* background image */}
        <div className="z-0 absolute inset-0 flex justify-end items-end w-full h-full rounded-[40px]">
          <Image
            src={BGCard}
            alt="BG"
            className="w-full h-[40%] md:h-full rounded-[40px]"
          />
        </div>

        <div className="z-10 w-full md:w-[40%] h-[60%] md:h-full flex flex-col justify-between items-center">
          <div className="w-[250px] h-[85%] md:h-[80%] outline-1 outline-white rounded-[36px]">
            {competition.poster_competition ? (
              <img
                src={competition.poster_competition}
                alt={competition.title}
                className="w-full h-full object-cover rounded-[36px]"
              />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center rounded-[36px]">
                <span className="text-[#2541CD]">No Poster</span>
              </div>
            )}
          </div>

          <Link
            href={`/ui/detail-competition/${competition.id}`}
            className="w-full h-[10%] md:h-[15%]"
          >
            <button className="w-full h-full rounded-[36px] text-[12px] md:text-[20px] font-[400] flex justify-center items-center transition-all duration-300 cursor-pointer bg-white backdrop-blur-2xl text-[#2541CD] ring-2 ring-[#2541CD] hover:shadow-[0_0_15px_#2541CD] hover:scale-95">
              See Detail
            </button>
          </Link>
        </div>

        <div className="z-10 w-full md:w-[60%] h-[40%] md:h-full">
          <div className="w-full h-full flex flex-col text-white ">
            <div className="w-full h-[35%]">
              <h1 className="text-[18px] md:text-[24px] font-[700]">
                {competition.title}
              </h1>
              <h1 className="text-[12px] md:text-[16px] font-[400]">
                {competition.description}
              </h1>
            </div>

            <div className="w-full h-[50%] text-[10px] md:text-[16px] font-[400] flex flex-col gap-1 mb-[10px] sm:mb-0">
              <p>
                <span className="font-bold">Category:</span>{" "}
                {competition.category}
              </p>
              <p>
                <span className="font-bold">Type:</span> {competition.type}
              </p>
              <p>
                <span className="font-bold">Starts:</span> {startDate}
              </p>
              <p>
                <span className="font-bold">Ends:</span> {endDate}
              </p>
              <p>
                <span className="font-bold">Countdown:</span> {countdown()}
              </p>
              <p>
                <span className="font-bold">Close Reg:</span> {closeReg}
              </p>
            </div>

            <div className="w-full h-[15%]">
              <button
                onClick={handleRegisterClick}
                className={`w-full h-full rounded-[36px] text-[12px] md:text-[20px] font-[400] flex justify-center items-center transition-all duration-300 ${
                  isRegistrationClosed
                    ? "bg-gray-700 text-gray-400 ring-2 ring-gray-500 cursor-not-allowed"
                    : isRegistered
                    ? "bg-green-600 text-white ring-2 ring-green-600"
                    : "cursor-pointer bg-[#2541CD] text-white ring-2 ring-[#2541CD] hover:bg-[#1a36b5] hover:shadow-[0_0_15px_#2541CD] hover:scale-95"
                }`}
                disabled={isRegistrationClosed || checking || busy}
              >
                {checking
                  ? "Checking..."
                  : busy
                  ? "Processing..."
                  : isRegistered
                  ? "Already Registered"
                  : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <RegistrationModal
          competition={competition}
          onClose={() => setShowModal(false)}
          onRegistered={() => {
            setShowModal(false);
            setIsRegistered(true);
          }}
        />
      )}
    </>
  );
}
