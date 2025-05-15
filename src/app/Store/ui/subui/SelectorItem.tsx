"use client";
import React from "react";
import Image from "next/image";

interface Item {
  title: string;
  onSelect: (title: string) => void;
  selected: boolean;
}

const SelectorItem: React.FC<Item> = ({ title, onSelect, selected }) => {
  return (
    <div
      className="font-tektur font-medium text-[2.6786vh] text-[#8F8D8C] flex ml-[5.7143vh] mt-[0.7143vh] items-center cursor-pointer"
      onClick={() => onSelect(title)}
    >
      <div
        className={`bg-[#333237] w-[2.6786vh] h-[2.6786vh] rounded-[0.7143vh]
          outline outline-[0.1786vh] outline-white/30 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.25)] flex items-center justify-center
          ${selected ? "bg-[#FFA500] outline-orange-300" : ""}`}
      >
        {selected && (
          <Image
            src="/assets/images/Store/tick.svg"
            alt="tick"
            width={8}
            height={8}
            className="w-[5.5vh] h-[5.5vh] mt-[0.9vh]"
          />
        )}
      </div>
      <p className="ml-[2.1429vh]">{title}</p>
    </div>
  );
};

export default SelectorItem;
