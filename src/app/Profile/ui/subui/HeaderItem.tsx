"use client";
import React from 'react';
import Image from 'next/image';

interface HeaderItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const HeaderItem: React.FC<HeaderItemProps> = ({ title, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-[124px] h-[33px] ml-5 mr-2 flex items-center text-[12px] font-tektur hover:cursor-pointer
        ${isActive ? 'border-b-[1.4px] border-[#B3FFED] text-[#B3FFED]' : 'text-[#9A999E]'}`}
    >
      <Image
        src={`/assets/images/Profile/Header/${title}-${isActive ? 'active' : 'inactive'}.svg`}
        alt={`${title} icon`}
        width={21}
        height={21}
        className="w-[21px] h-[21px] mr-[6px]"
        quality={100}
      />
      <span>{title}</span>
    </div>
  );
};

export default HeaderItem;