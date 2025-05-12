"use client";

import { useEffect, useState } from "react";
import { fetchCompetitions } from "../../../lib/api";
import { ListFilter } from "lucide-react";
import Image from "next/image";
import Moon from "../../../../public/competition-assets/moon.png";
import CompetitionCard from "../../../components/competition-card";

export default function CompetitionPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        const data = await fetchCompetitions();
        setCompetitions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompetitions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading competitions...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <section id="competition" className="relative w-screen h-full">
      <div className="relative flex flex-col mt-[60px] md:mt-[80px] lg:mt-[100px]">
        <div className="w-auto h-[100px] md:h-[120px] lg:h-[150px] flex justify-center lg:justify-between items-center gap-[100px] px-[40px] sm:px-[62px] py-0 lg:py-[100px]">
          <h1 className="w-full lg:max-w-[400px] font-[700] text-[21px] sm:text-[28px] md:text-[34px] lg:text-[40px] text-center lg:text-left text-white drop-shadow-[0_0_7px_#FFFFFF]">
            Explore, Compete, Achieve!
          </h1>
          <h1 className="hidden lg:flex w-full max-w-[850px] text-[15px] xl:text-[20px] text-white text-right text-balance drop-shadow-[0_0_4px_#FFFFFF]">
            Winners aren’t born—they’re made here.
            <br /> CompVerse is where raw talent meets relentless competition.
            Sharpen your skills, face the best, and etch your name among the
            legends. Ready for the grind?
          </h1>
        </div>

        <div className="z-40 sticky top-[60px] md:top-[80px] lg:top-[100px] w-full h-[60px] md:h-[80px] lg:h-[100px] bg-gradient-to-r from-[#2541CD] via-white to-[#2541CD]">
          <div className="w-full h-[60px] md:h-[80px] lg:h-[100px] bg-white/23 px-[20px] md:px-[62px] flex flex-row gap-[20px] md:gap-[50px] justify-center lg:justify-start items-center">
            <div className="w-[240px] h-[35px] md:h-[50px] ring-1 md:ring-2 ring-black rounded-[16px] md:rounded-[20px] flex flex-row items-center px-[10px] md:px-[20px]">
              <h1 className="w-[70%] text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-[400]">
                Category
              </h1>
              <div className="w-[10%] flex justify-start md:justify-end">
                <div className="w-[1px] md:w-[2px] h-[25px] md:h-[30px] bg-black"></div>
              </div>
              <div className="w-[20%] flex justify-end">
                <ListFilter className="w-[20px] md:w-[27px] h-auto md:stroke-3 stroke-black" />
              </div>
            </div>

            <div className="w-[240px] h-[35px] md:h-[50px] ring-1 md:ring-2 ring-black rounded-[16px] md:rounded-[20px] flex flex-row items-center px-[10px] md:px-[20px]">
              <h1 className="w-[70%] text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-[400]">
                Type
              </h1>
              <div className="w-[10%] flex justify-start md:justify-end">
                <div className="w-[1px] md:w-[2px] h-[25px] md:h-[30px] bg-black"></div>
              </div>
              <div className="w-[20%] flex justify-end">
                <ListFilter className="w-[20px] md:w-[27px] h-auto md:stroke-3 stroke-black" />
              </div>
            </div>
          </div>
        </div>

        <div className="z-20 w-full h-full px-[40px] md:px-[62px] my-[80px] flex flex-row justify-center items-center">
          <div className="w-full max-w-[1600px] h-full flex flex-wrap flex-row justify-center 2xl:justify-between items-center gap-15 sm:gap-20">
            {competitions.length > 0 ? (
              competitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))
            ) : (
              <div className="text-white text-center py-10">
                <p>No competitions available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        <div className="z-10 absolute left-0 bottom-0">
          <Image src={Moon} alt="" className="w-screen h-full max-h-[1000px]" />
        </div>
      </div>
    </section>
  );
}
