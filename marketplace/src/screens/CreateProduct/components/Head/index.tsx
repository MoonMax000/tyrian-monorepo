import React, { useState } from "react";
import ManyPerson from "@/assets/icons/profile/manyPerson.svg";
import CheveronIcon from "./chevron-custom.svg";

const Head = ({ hideRisk = false}: {hideRisk?: boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Low");
  const options = ["Low"];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="flex gap-3 p-4">
      <div className="w-[240px] h-[135px] rounded-[8px] bg-gunpowder" />
      <div className="flex flex-col flex-1 gap-[2px]">
        <div className="font-semibold text-[19px] leading-none tracking-normal">
          Your product’s title
        </div>
  
        <div className="flex gap-6 items-center">
            <ManyPerson width={24} height={24} />
            {!hideRisk && (
              <div className="flex items-center h-6">
                <span className="text-gray-400 text-[12px] uppercase font-bold">
                  Risk:&nbsp;
                </span>
                <div className="relative top-[-1px]">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center bg-transparent text-white hover:text-regaliaPurple transition-colors duration-200"
                  >
                    <span className="h-full text-gray-400 text-[12px] uppercase font-bold">
                      {selectedOption}
                    </span>
                    <CheveronIcon width={24} height={24} />
                  </button>
                  {isOpen && (
                    <div className="w-full absolute top-full left-0 bg-regaliaPurple shadow-lg z-10 overflow-hidden min-w-max">
                      {options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(option)}
                          className="w-full text-[12px] px-2 py-1 font-bold text-white uppercase hover:bg-regaliaPurple/20 transition-colors duration-150 whitespace-nowrap"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Head;