import React from 'react'
import { useRouter } from 'next/navigation'

interface RatingCardProps {
    week: string;
    problem: string;
    difficulty: string;
    lastResult: string;
    submissions: string;
    problemId: string;
    tournamentId: string;
}

const RatingCard: React.FC<RatingCardProps> = ({ 
    week, 
    problem,
    difficulty, 
    lastResult,
    submissions,
    problemId,
    tournamentId
}) => {
  const router = useRouter();
  const difficultyClass = difficulty.toLowerCase() === "easy" ? "text-[#1CBABA]" 
    : difficulty.toLowerCase() === "medium" ? "text-[#FFB700]" 
    : difficulty.toLowerCase() === "hard" ? "text-[#F23737]" 
    : "text-white";

  const handleClick = () => {
    router.push(`/Tournament/Problem/${problemId}`);
  };

  return (
    <div 
      onClick={handleClick}
      className='flex h-[64px] w-[830px] bg-[#141723] rounded-2xl mt-1
                shadow-[0_4px_4px_rgba(0,0,0,0.25)] items-center mb-4
                font-tektur text-[14px] tracking-wider font-medium
                text-[#9A999E] px-4 cursor-pointer hover:bg-[#1a1d2d]
                transition-colors duration-200'>

      <p className="w-[20%] pl-3">{week}</p>
      <p className="w-[40%] text-white mt-2">{problem} <br /> <span className={`text-[10px] ${difficultyClass}`}>{difficulty}</span>
      </p>
      <p className="w-[20%]">{lastResult}</p>
      <p className="w-[20%] pl-20">{submissions}</p>
    </div>
  )
}

export default RatingCard
