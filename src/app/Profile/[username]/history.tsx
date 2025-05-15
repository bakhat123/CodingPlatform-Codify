"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RatingCard from "../components/HistoryCard";
import Image from "next/image";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  weekNumber: number;
  tournamentTitle: string;
  solvedAt: string;
  points: number;
  language: string;
  submissions: number;
}

const History = () => {
  const { username } = useParams();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/profile/history?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const data = await response.json();
        setProblems(data.history);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="ml-[18px] mt-[25px]">
      <div className="h-8 flex flex-row items-center mt-[14px] mr-[10px] 
          font-tektur text-[14px] tracking-wider font-medium text-[#9A999E] 
          px-4">
        <div className="flex w-[15%]">
          <p>Week </p>
          <Image src="/assets/images/Profile/History/dropdown.svg"
                alt="Dropdown"
                width={26}
                height={20}
                className="inset-0 mb-1"
          />
        </div>
        <p className="w-[30%]">Problem</p>
        <p className="w-[20%]">Last Result</p>
        <p className="w-[20%] pl-9">Submissions</p>
      </div>

      <div className="mt-4">
        {problems.map((problem) => (
          <RatingCard
            key={problem.id}
            week={problem.weekNumber.toString()}
            problem={problem.title}
            difficulty={problem.difficulty}
            lastResult="Accepted"
            submissions={problem.submissions.toString()}
            problemId={problem.id}
            tournamentId={problem.tournamentTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default History;