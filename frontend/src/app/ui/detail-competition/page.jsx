"use client";

import * as React from "react";
import Image from "next/image";
import BG from "../../../../public/competition-assets/detail/bg.png";
import { Calendar } from "../../../components/calendar/calendar";

export default function DetailCompetition() {
  const [date, setDate] = React.useState(new Date());

  return (
    <section
      id="detail-competition"
      className="relative w-screen h-full bg-[#030210]"
    >
      <div className="relative w-full h-full flex flex-col justify-center items-center px-[40px] sm:px-[62px] py-[60px] md:py-[80px] lg:py-[100px]">
        <div className="w-full max-w-[800px] 2xl:max-w-[1800px] h-full flex justify-start items-start mb-[20px]">
          <h1 className="font-[700] text-[21px] sm:text-[28px] md:text-[34px] lg:text-[40px] text-left text-white drop-shadow-[0_0_7px_#FFFFFF]">
            title
          </h1>
        </div>

        <div className="w-full max-w-[800px] 2xl:max-w-[1800px] h-full flex flex-col 2xl:flex-row justify-center items-center gap-[15px]">
          <div className="w-full 2xl:w-[50%] h-[500px] sm:h-[650px] md:h-[750px] lg:h-[900px]">
            <div className="relative w-full h-full flex justify-center items-center ring-2 ring-white rounded-[40px] p-6">
              <div className="z-0 absolute top-0 left-0 w-full h-full">
                <Image
                  src={BG}
                  alt=""
                  className="w-full h-full rounded-[40px]"
                />
              </div>

              <div className="z-10 w-full h-full bg-white rounded-[36px]">
                <Image
                  src={BG}
                  alt="Poster Competition"
                  className="w-full h-full rounded-[40px]"
                />
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent laoreet ante dui, eu posuere magna iaculis at.
                      Nam dignissim risus quis ultrices luctus. Maecenas
                      interdum accumsan turpis non finibus. Integer sed rhoncus
                      arcu, cursus rutrum mi. Fusce ante ex, accumsan vel
                      sollicitudin dapibus, aliquet cursus metus.{" "}
                    </p>
                  </div>
                  <div className="w-full h-[30%] flex flex-col sm:flex-row justify-center items-center text-white text-center gap-6 sm:gap-0">
                    <div className="w-[50%] h-full flex flex-col justify-center items-center gap-2">
                      <h1 className="text-[18px] md:text-[24px] font-[700]">
                        Category
                      </h1>
                      <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                        Category of Competition
                      </p>
                    </div>
                    <div className="w-[50%] h-full flex flex-col justify-center items-center gap-2">
                      <h1 className="text-[18px] md:text-[24px] font-[700]">
                        Type
                      </h1>
                      <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                        Type of Competition
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

                  <div className="w-full h-full flex flex-col gap-4">
                    <div className="flex flex-col">
                      <h1 className="text-white text-[18px] md:text-[24px] font-[700]">
                        Date
                      </h1>
                      <p className="text-[12px] md:text-[16px] font-[400] text-white/80">
                        Day : Month : Year
                      </p>
                    </div>
                    <div className="w-full h-full flex justify-center items-center rounded-[36px] border">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="text-white flex justify-center items-center scale-[0.7] sm:scale-[1]"
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

                  <div className="w-full h-full flex flex-col gap-4">
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
                            Day : Month : Year
                          </p>
                        </div>
                        <div>
                          <h1 className="text-[12px] md:text-[16px] text-white">
                            Date
                          </h1>
                          <p className="text-[12px] md:text-[16px] text-white/80">
                            Day : Month : Year
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                        <h1 className="text-white text-[18px] md:text-[24px] font-[700]">
                          Countdown
                        </h1>
                        <div className="w-full h-[75px] flex justify-center items-center border rounded-[36px]">
                          <p className="text-white text-[18px] md:text-[24px] font-[400]">
                            Day : Month : Year
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cursor-pointer relative w-full h-[60px] md:h-[80px] md:h-[8%] flex justify-center items-center ring-2 ring-white rounded-[40px] py-8 px-10">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
