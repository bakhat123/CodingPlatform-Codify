import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface ProblemCardProps {
  first?: boolean;
  title: string;
  points: number | string;
  difficulty: 'easy' | 'medium' | 'hard';
  id: string;
}

const difficultyStyles = {
  easy: 'text-[#1CBABA] border-[#1CBABA]',
  medium: 'text-[#FFB700] border-[#FFB700]',
  hard: 'text-[#F23737] border-[#F23737]',
};

const ProblemCard = ({ first = false, title, points, difficulty, id }: ProblemCardProps) => {
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    const checkSolvedStatus = async () => {
      try {
        const response = await fetch(`/api/tournament/submit/status?problemId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setIsSolved(data.isSolved);
        }
      } catch (err) {
        console.error("Error checking solved status:", err);
      }
    };

    checkSolvedStatus();
  }, [id]);

  return (
    <Link
      href={`/Tournament/Problem/${id}`}
      className={`flex h-[71px] w-[430px] rounded-2xl 
        ${first ? 'mt-[50px]' : 'mt-[23px]'} ml-[30px]
        bg-[#141723] shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        hover:shadow-lg hover:scale-[1.02] transition-all duration-200
        items-center font-tektur text-[14px] tracking-[1px] font-medium
        text-white px-4 border-t-[1px] ${difficultyStyles[difficulty]} relative`}
    >
      <p className="w-[60%] mt-2 ml-[10px]">
        {title} <br />
        <span className={`text-[10px] font-light leading-[10px] ${difficultyStyles[difficulty]}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </p>
      <p className="w-[40%] pl-[75px]">{points} Points</p>
      {isSolved && (
        <div className="absolute -right-4 -top-4 z-10">
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full -z-10"></div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ProblemCard;
