import Image from "next/image";
import Hero1 from "../../../../public/landing-assets/Hero1.png";
import { Mouse } from "lucide-react";
import { MoveDown } from "lucide-react";

export default function LandingPage({ onScrollDown }) {
  return (
    <section className="w-screen h-screen">
      <main className="relative flex flex-row w-full h-full flex justify-center items-center">
        <div className="w-[50%] h-full flex justify-center items-start pt-[250px]">
          <div className="flex flex-col gap-1">
            <h1 className="w-[500px] text-[64px] bg-gradient-to-r from-[#2541CD] via-white to-white text-transparent bg-clip-text font-[700]  ">
              CompVerse
            </h1>
            <h1 className="w-full text-[24px] font-bold text-white drop-shadow-[0px_0px_5px_#fff] mb-[30px]">
              Step Into the Universe of Competitions.
            </h1>
            <div
              className="group relative overflow-hidden flex justify-center items-center w-[300px] h-[50px] ring-1 ring-white hover:ring-[#2541CD] rounded-[20px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),_0_2px_0_0_#2541CD,_0_4px_0_0_#203AB9,_0_6px_0_0_#1C33A3,_0_8px_0_0_#1C2F91,_0_8px_16px_0_#2541CD] transition-all duration-300 ease-in-out hover:translate-y-[4px] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),_0_1px_0_0_#2541CD,_0_2px_0_0_#2541CD,_0_3px_0_0_#2541CD,_0_4px_0_0_#2541CD,_0_4px_8px_0_#2541CD] 
                before:content-['']
                before:absolute
                before:inset-0
                before:bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)]
                before:-translate-x-full
                before:animate-[shimmer_4s_infinite]
                cursor-pointer"
            >
              <h1 className="text-[24px] font-[400] text-white">Explore</h1>
            </div>
          </div>
        </div>
        <div className="w-[50%] h-full flex justify-center items-center">
          <Image
            src={Hero1}
            alt="Hero 1"
            className="w-[655px] h-auto grayscale hover:grayscale-0 hover:drop-shadow-[-50px_-48px_100px_#8D99D6] hover:drop-shadow-[40px_48px_100px_#2541CD] ease-in-out transition-all duration-500 "
          />
        </div>
        <div className="absolute bottom-0 w-screen h-[150px]">
          <div className="h-full flex flex-col gap-4 justify-center items-center">
            <Mouse
              className="cursor-pointer hover:opacity-80 transition-opacity"
              size={40}
              color="white"
              onClick={onScrollDown}
            />
            <MoveDown
              className="animate-bounce overflow-hidden"
              size={25}
              color="white"
            />
            <h1 className="text-[15px] text-white -mt-[10px]">Scroll Down</h1>
          </div>
        </div>
      </main>
    </section>
  );
}
