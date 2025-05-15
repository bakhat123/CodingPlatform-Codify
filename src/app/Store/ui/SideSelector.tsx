"use client";
import React, { useState } from "react";
import Image from "next/image";
import SelectorItem from "./subui/SelectorItem";

interface SideSelectorProps {
  onApplyFilters: (selectedFilter: string) => void;
}

const SideSelector: React.FC<SideSelectorProps> = ({ onApplyFilters }) => {
  const [selectedTitle, setSelectedTitle] = useState<string>("All Items");

  const handleSelect = (title: string) => {
    if (selectedTitle === title) return;
    setSelectedTitle(title); 
    onApplyFilters(title);
  };

  return (
    <div className="bg-[rgba(37,37,39,0.4)] w-[48.3929vh] h-[78.2857vh] mt-[14.2857vh] mb-[5.4vh] rounded-[4.2857vh] flex flex-col shadow-[0_4px_6px_rgba(0,0,0,0.4)] backdrop-blur-md">
      <p className="font-tektur font-bold text-[3.5714vh] text-white ml-[5vh] mt-[5vh] mb-[2.8571vh]">
        Categories
      </p>
      {["Diamond", "Pfp", "Background"].map((title) => (
        <SelectorItem
          key={title}
          title={title}
          onSelect={handleSelect}
          selected={selectedTitle === title}
        />
      ))}

      <Image
        src="/assets/images/Store/line.svg"
        alt="line"
        width={220}
        height={12}
        style={{ objectFit: "cover" }}
        className="w-[39.29vh] h-[2.14vh] ml-[3.5714vh] mt-[2.8571vh]"
      />

      <p className="font-tektur font-bold text-[3.5714vh] text-white ml-[5vh] mt-[2.1429vh] mb-[2.8571vh]">
        What&apos;s new!
      </p>
      {["Recent", "Most Popular", "Owned", "Buy Coins", "All Items"].map((title) => (
        <SelectorItem
          key={title}
          title={title}
          onSelect={handleSelect}
          selected={selectedTitle === title}
        />
      ))}
    </div>
  );
};

export default SideSelector;