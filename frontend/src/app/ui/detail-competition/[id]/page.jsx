"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BG from "../../../../../public/competition-assets/detail/bg.png";
import { Calendar } from "../../../../components/calendar/calendar";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

export default function DetailCompetition() {
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchCompetitionDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/competitions/${params.id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch competition details");
        }
        const data = await response.json();
        setCompetition(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionDetail();
  }, [params.id]);

  if (loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white text-center py-20">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white text-center py-20">
        Error: {error}
      </div>
    );
  if (!competition)
    return (
      <div className="w-screen h-screen flex justify-center items-center text-white text-center py-20">
        Competition not found
      </div>
    );

  const startDate = format(new Date(competition.start_date), "dd MMM yyyy");
  const endDate = format(new Date(competition.end_date), "dd MMM yyyy");

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: format(date, "dd MMM yyyy"),
      time: format(date, "HH:mm"),
    };
  };
  const { date: closeRegDate, time: closeRegTime } = formatDateTime(
    competition.close_registration
  );

  return (
    <section
      id="detail-competition"
      className="relative w-screen h-full bg-[#030210]"
    >
      <div className="relative w-full h-full flex flex-col justify-center items-center px-[40px] sm:px-[62px] py-[60px] md:py-[80px] lg:py-[100px]">
        <div className="w-full max-w-[800px] 2xl:max-w-[1800px] h-full flex flex-row justify-start items-center gap-6 mb-[20px]">
          <div className="w-[60px] h-[60px] rounded-[20px] border-2 border-white flex justify-center items-center cursor-pointer">
            <Link href="/ui/home#competition">
              <ChevronDown className="text-white rotate-90" />
            </Link>
          </div>
          <h1 className="font-[700] text-[21px] sm:text-[28px] md:text-[34px] lg:text-[40px] text-left text-white drop-shadow-[0_0_7px_#FFFFFF]">
            {competition.title}
          </h1>
        </div>

        <div className="w-full max-w-[800px] 2xl:max-w-[1800px] h-full flex flex-col 2xl:flex-row justify-center items-center gap-[15px]">
          <div className="w-full 2xl:w-[50%] h-[450px] sm:h-[600px] md:h-[700px] lg:h-[900px]">
            <div className="relative w-full h-full flex justify-center items-center ring-2 ring-white rounded-[40px] p-6">
              <div className="z-0 absolute top-0 left-0 w-full h-full">
                <Image
                  src={BG}
                  alt=""
                  className="w-full h-full rounded-[40px]"
                />
              </div>

              <div className="z-10 w-full h-full rounded-[36px] flex justify-center items-center drop-shadow-[5px_5px_5px_#FFFFFF]">
                {competition.poster_competition ? (
                  <img
                    src={competition.poster_competition}
                    alt={competition.title}
                    className="w-[98%] sm:w-auto h-auto sm:h-[98%] rounded-[36px] object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-[36px]">
                    <span>No poster available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full 2xl:w-[50%] h-full md:h-[900px]">
            <div className="relative w-full h-full flex flex-col gap-[15px] justify-between items-center">
              <div className="relative w-full h-full md:h-[40%] flex justify-center items-center ring-2 ring-white rounded-[40px] py-8 px-10">
                <div className="z-0 absolute top-0 left-0 w-full h-full">
                  <Image
                    src={BG}
                    alt=""
                    className="w-full h-full rounded-[40px]"
                  />
                </div>

                <div className="z-10 w-full h-full flex flex-col gap-8">
                  <div className="w-full h-[70%] flex flex-col gap-4">
                    <h1 className="text-[18px] md:text-[24px] font-[700] text-white">
                      Description
                    </h1>
                    <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                      {competition.description}
                    </p>
                  </div>
                  <div className="w-full h-[30%] flex flex-col sm:flex-row justify-center items-center text-white text-center gap-6 sm:gap-0">
                    <div className="w-[50%] h-full flex flex-col justify-center items-center gap-2">
                      <h1 className="text-[18px] md:text-[24px] font-[700]">
                        Category
                      </h1>
                      <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                        {competition.category}
                      </p>
                    </div>
                    <div className="w-[50%] h-full flex flex-col justify-center items-center gap-2">
                      <h1 className="text-[18px] md:text-[24px] font-[700]">
                        Type
                      </h1>
                      <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                        {competition.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-full md:h-[50%] flex flex-col md:flex-row gap-[15px]">
                <div className="relative w-full h-full flex justify-center items-center ring-2 ring-white rounded-[40px] py-8 px-10">
                  <div className="z-0 absolute top-0 left-0 w-full h-full">
                    <Image
                      src={BG}
                      alt=""
                      className="w-full h-full rounded-[40px]"
                    />
                  </div>

                  <div className="z-10 w-full h-full flex flex-col gap-4">
                    <div className="flex flex-col">
                      <h1 className="text-white text-[18px] md:text-[24px] font-[700]">
                        Date
                      </h1>
                      <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                        {startDate} - {endDate}
                      </p>
                    </div>
                    <div className="w-full h-full flex justify-center items-center rounded-[36px] border">
                      <Calendar
                        mode="range"
                        selected={{
                          from: new Date(competition.start_date),
                          to: new Date(competition.end_date),
                        }}
                        className="text-white flex justify-center items-center scale-[0.7] sm:scale-[1]"
                        disabled={(date) =>
                          date < new Date(competition.start_date) ||
                          date > new Date(competition.end_date)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-full flex justify-center items-center ring-2 ring-white rounded-[40px] py-8 px-10">
                  <div className="z-0 absolute top-0 left-0 w-full h-full">
                    <Image
                      src={BG}
                      alt=""
                      className="w-full h-full rounded-[40px]"
                    />
                  </div>

                  <div className="z-10 w-full h-full flex flex-col gap-4">
                    <div className="flex flex-col">
                      <h1 className="text-white text-[18px] md:text-[24px] font-[700]">
                        Close Registration
                      </h1>
                      <div className="flex flex-col gap-1 text-[12px] md:text-[16px] font-[400]">
                        <div>
                          <h1 className="text-[12px] md:text-[16px] text-white">
                            Date
                          </h1>
                          <p className="text-[12px] md:text-[16px] text-white/80">
                            {closeRegDate}
                          </p>
                        </div>
                        <div>
                          <h1 className="text-[12px] md:text-[16px] text-white">
                            Time
                          </h1>
                          <p className="text-[12px] md:text-[16px] text-white/80">
                            {closeRegTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                        <h1 className="text-white text-[18px] md:text-[24px] font-[700]">
                          Countdown
                        </h1>
                        <div className="w-full h-[75px] flex justify-center items-center border rounded-[36px] text-white">
                          <CountdownTimer
                            endDate={competition.close_registration}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/register-competition/${params.id}`}
                className="cursor-pointer relative w-full h-[60px] md:h-[80px] flex justify-center items-center ring-2 ring-white rounded-[40px] py-8 px-10 hover:ring-[#2541CD] transition-all duration-300 ease-in-out hover:shadow-[10px_10px_33px_#121212,#2541CD_0px_0px_30px_5px] hover:scale-99"
              >
                <div className="z-0 absolute top-0 left-0 w-full h-full">
                  <Image
                    src={BG}
                    alt=""
                    className="w-full h-full rounded-[40px]"
                  />
                </div>

                <div className="w-full h-full rounded-[36px] flex justify-center items-center">
                  <h1 className="text-white text-[18px] md:text-[24px] font-[700]">
                    Register Now
                  </h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-2">
      <span>{timeLeft.days}d</span>
      <span>{timeLeft.hours}h</span>
      <span>{timeLeft.minutes}m</span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
}
