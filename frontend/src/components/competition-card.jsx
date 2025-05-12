import Image from "next/image";
import BGCard from "../../public/competition-assets/bg-card.png";
import Test from "../../public/competition-assets/test.png";

export default function CompetitionCard({ competition }) {
  const {
    title,
    description,
    category,
    type,
    // start_date,
    // end_date,
    // close_registration,
    // poster_url,
  } = competition;

  // const startDate = new Date(start_date);
  // const closeRegDate = new Date(close_registration);
  // const now = new Date();
  // const countdown = Math.max(0, closeRegDate - now);

  // Format countdown (misalnya dalam hari)
  // const daysLeft = Math.ceil(countdown / (1000 * 60 * 60 * 24));

  return (
    <div className="relative w-full max-w-[300px] md:max-w-[650px] h-[650px] md:h-[400px] flex flex-col md:flex-row gap-[24px] outline-2 outline-white rounded-[40px] px-8 py-6 backdrop-blur-3xl">
      <div className="z-0 absolute inset-0 flex justify-end items-end w-full h-full rounded-[40px]">
        <Image
          src={BGCard}
          alt="BG"
          className="w-full h-[40%] md:h-full rounded-[40px]"
        />
      </div>

      <div className="z-10 w-full md:w-[40%] h-full flex justify-start items-center">
        <div className="w-[250px] h-auto md:h-[350px] outline-1 outline-white rounded-[36px]">
          <Image src={Test} alt="" className="w-full h-full rounded-[36px]" />
        </div>
      </div>

      <div className="z-10 w-full md:w-[60%] h-full">
        <div className="w-full h-full flex flex-col text-white ">
          <div className="w-full h-[45%]">
            <h1 className="text-[18px] md:text-[24px] font-[700]">{title}</h1>
            <h1 className="text-[12px] md:text-[16px] font-[400]">
              {description}
            </h1>
          </div>
          <div className="w-full h-[40%] text-[10px] md:text-[16px] font-[400]">
            <h1>Category: {category}</h1>
            <h1>Type: {type}</h1>
            <h1>Date & Time</h1>
            <h1>Countdown</h1>
            <h1>Close Registration</h1>
          </div>
          <div className="w-full h-[15%]">
            <div className="cursor-pointer w-full h-full ring-2 ring white rounded-[36px] text-[12px] md:text-[20px] font-[400] flex justify-center items-center hover:ring-[#2541CD] transition-all duration-300 ease-in-out hover:shadow-[10px_10px_33px_#121212,#2541CD_0px_0px_30px_5px] hover:scale-95">
              Regiser
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
