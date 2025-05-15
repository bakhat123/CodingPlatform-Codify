import React from 'react'
import Image from 'next/image'

interface ParticipentCardProps {
  position: string;
  name: string;
  points: string;
}

const ParticipentCard: React.FC<ParticipentCardProps> = ({ position, name, points }) => {
  const safePosition = position || "N/A";
  const safeName = name || "Unknown";
  const safePoints = points || "0";
  
  let badgeColor = "bg-blue-600";
  if (safePosition === "1") {
    badgeColor = "bg-yellow-500"; // Gold for 1st
  } else if (safePosition === "2") {
    badgeColor = "bg-gray-300"; // Silver for 2nd
  } else if (safePosition === "3") {
    badgeColor = "bg-amber-700"; // Bronze for 3rd
  }

  return (
    <div className="w-[313px] h-[55px] rounded-[16px] bg-[#141723] shadow-[0_4px_4px_rgba(0,0,0,0.25)] ml-[25px] mt-[13px] flex items-center font-tektur font-medium text-[14px] text-white tracking-[1px] participant-card hover:bg-[#1a1f2e] transition-all duration-300">
      <div className={`ml-[20px] w-8 h-8 flex items-center justify-center rounded-full ${badgeColor}`}>
        {safePosition}
      </div>
      <div className="w-[90px] ml-[15px] mt-[5px] truncate">
        {safeName}
      </div>
      <div className="flex items-center gap-2 ml-auto mr-6">
        <Image
          src="/assets/images/leaderboard/Trophy.svg"
          alt="Trophy"
          width={18}
          height={18}
        />
        <div className="text-blue-400 font-semibold">
          {safePoints}
        </div>
      </div>
    </div>
  );
};


export default ParticipentCard;