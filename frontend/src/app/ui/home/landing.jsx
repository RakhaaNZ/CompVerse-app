import Link from "next/link";
import Image from "next/image";
import Hero1 from "../../../../public/landing-assets/Hero1.png";
import { Mouse } from "lucide-react";
import { MoveDown } from "lucide-react";

export default function LandingPage({ onScrollDown }) {
  return (
    <section className="w-screen h-screen">
      <main className="relative flex flex-col lg:flex-row gap-[0px] md:gap-[100px] w-full h-full flex justify-center items-center px-[50px]">
        <div className="w-full lg:w-[50%] h-[40%] lg:h-full flex justify-center items-start pt-[120px] md:pt-[150px] lg:pt-[250px]">
          <div className="flex flex-col gap-1 justify-center items-center text-center lg:justify-start lg:items-start lg:text-start">
            <h1 className="w-auto max-w-[500px] text-[26px] sm:text-[40px] md:text-[52px] lg:text-[64px] bg-gradient-to-r from-[#2541CD] via-white to-white text-transparent bg-clip-text font-[700]  ">
              CompVerse
            </h1>
            <h1 className="w-full text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-bold text-white text-balance drop-shadow-[0px_0px_5px_#fff] mb-[30px]">
              Step Into the Universe of Competitions.
            </h1>
            <div
              className="group relative overflow-hidden flex justify-center items-center w-[200px] md:w-[250px] lg:w-[300px] h-[40px] md:h-[50px] ring-1 ring-white hover:ring-[#2541CD] rounded-[20px] shadow-[inset_0_1px_0_0_#FFFFFF,_0_2px_0_0_#CCD2F3,_0_4px_0_0_#94A2E6,_0_6px_0_0_#6175DB,_0_8px_0_0_#2541CD,_0_8px_16px_0_#2541CD] transition-all duration-300 ease-in-out hover:translate-y-[4px] hover:shadow-[inset_0_1px_0_0_#FFFFFF,_0_1px_0_0_#CCD2F3,_0_2px_0_0_#94A2E6,_0_3px_0_0_#6175DB,_0_4px_0_0_#2541CD,_0_4px_8px_0_#2541CD] 
                before:content-['']
                before:absolute
                before:inset-0
                before:bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)]
                before:-translate-x-full
                before:animate-[shimmer_4s_infinite]
                cursor-pointer"
            >
              <Link href="#competition">
                <h1 className="text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-[400] text-white">
                  Explore
                </h1>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[50%] h-[70%] lg:h-full flex justify-center items-center mb-[80px] sm:mb-[150px] lg:mb-0 ">
          <Image
            src={Hero1}
            alt="Hero 1"
            className="w-[200px] sm:w-[300px] md:w-[450px] lg:w-[655px] h-auto p-[10px] md:p-0 grayscale hover:grayscale-0 hover:[filter:drop-shadow(-50px_-48px_100px_#8D99D6)_drop-shadow(40px_48px_100px_#2541CD)] [filter:drop-shadow(-50px_-48px_100px_#8D99D6)_drop-shadow(40px_48px_100px_#2541CD)] lg:drop-shadow-[0] ease-in-out transition-all duration-500 "
          />
        </div>
        <div className="absolute bottom-0 w-screen h-[100px] lg:h-[150px]">
          <div className="h-full flex flex-col gap-4 justify-center items-center">
            <Mouse
              className="hidden lg:flex w-[25px] h-[25px] sm:w-[40px] sm:h-[40px] cursor-pointer hover:opacity-80 transition-opacity"
              color="white"
              onClick={onScrollDown}
            />
            <MoveDown
              className="w-[25px] sm:h-[25px] animate-bounce overflow-hidden"
              color="white"
            />
            <h1 className="text-[10px] sm:text-[15px] text-white -mt-[10px]">
              Scroll Down
            </h1>
          </div>
        </div>
      </main>
    </section>
  );
}
