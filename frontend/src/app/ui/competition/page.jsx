"use client";

import { useEffect, useState } from "react";
import { fetchCompetitions } from "../../../lib/api";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Moon from "../../../../public/competition-assets/moon.png";
import CompetitionCard from "../../../components/competition-card";

export default function CompetitionPage() {
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const categories = ["Technology", "Business", "Art", "Science", "Other"];

  const types = ["Individual", "Team"];

  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        const data = await fetchCompetitions();
        setCompetitions(data);
        setFilteredCompetitions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompetitions();
  }, []);

  useEffect(() => {
    let result = competitions;

    if (filters.category) {
      result = result.filter((comp) => comp.category === filters.category);
    }

    if (filters.type) {
      result = result.filter((comp) => comp.type === filters.type);
    }

    setFilteredCompetitions(result);
  }, [filters, competitions]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    if (filterType === "category") setShowCategoryDropdown(false);
    if (filterType === "type") setShowTypeDropdown(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      type: "",
    });
  };

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
            <div className="relative w-[240px] h-[35px] md:h-[50px] ring-1 md:ring-2 ring-black rounded-[16px] md:rounded-[20px] flex flex-row items-center px-[10px] md:px-[20px]">
              <div
                className="w-full flex justify-between items-center cursor-pointer"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <h1 className="text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-[400]">
                  {filters.category || "Category"}
                </h1>
                <ChevronDown
                  className="w-5 h-5 transition-transform duration-200"
                  style={{
                    transform: showCategoryDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg z-50">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        filters.category === cat ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleFilterChange("category", cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-[240px] h-[35px] md:h-[50px] ring-1 md:ring-2 ring-black rounded-[16px] md:rounded-[20px] flex flex-row items-center px-[10px] md:px-[20px]">
              <div
                className="w-full flex justify-between items-center cursor-pointer"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <h1 className="text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] font-[400]">
                  {filters.type || "Type"}
                </h1>
                <ChevronDown
                  className="w-5 h-5 transition-transform duration-200"
                  style={{
                    transform: showTypeDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg z-50">
                  {types.map((type) => (
                    <div
                      key={type}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        filters.type === type ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleFilterChange("type", type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(filters.category || filters.type) && (
              <button
                onClick={clearFilters}
                className="cursor-pointer ml-4 px-3 py-1 bg-red-500 text-white rounded-md text-[12px] sm:text-[14px] md:text-[18px] lg:text-[24px] hover:bg-red-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="w-full h-full px-[40px] md:px-[62px] my-[80px] flex justify-center items-start">
          <div
            className={`z-20 w-full max-w-[1600px] h-full flex flex-wrap flex-row justify-center 2xl:justify-between items-center gap-15 sm:gap-20 ${
              filteredCompetitions.length <= 2
                ? "mb-[200px] sm:mb-[300px] md:mb-[600px] lg:mb-[900px]"
                : "mb-[200px]"
            }`}
          >
            {filteredCompetitions.length > 0 ? (
              filteredCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))
            ) : (
              <div className="text-white text-center py-10 w-full">
                <p>No competitions found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="cursor-pointer mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="z-10 absolute left-0 bottom-0 ">
            <Image
              src={Moon}
              alt=""
              className="w-screen h-full max-h-[1000px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
