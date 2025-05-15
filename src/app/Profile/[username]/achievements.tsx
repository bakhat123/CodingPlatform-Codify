"use client";
import React, { useEffect, useState } from "react";
import AchievementCard from "../components/AchievementCard";

interface AchievementsProps {
  username: string;
}

const Achievements = ({ username }: AchievementsProps) => {
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/${username}/achievements`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        setAchievements(Array.isArray(data) ? data : []);  
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
        setAchievements([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAchievements();
  }, [username]);

  if (isLoading) {
    return (
      <div className="ml-[18px] mt-[25px] h-full w-full mb-[20px]">
        <div className="font-tektur font-semibold text-[30px] text-white ml-3">
          Medals
        </div>
        <div className="flex justify-center mt-8">
          <div className="animate-pulse text-gray-400">Loading achievements...</div>
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="ml-[18px] mt-[25px] h-full w-full mb-[20px]">
        <div className="font-tektur font-semibold text-[30px] text-white ml-3">
          Medals
        </div>
        <div className="relative mt-12 w-full h-48 flex justify-center items-center">
          <div className="relative z-10 text-center">
            <div className="font-tektur text-6xl text-lightGray font-bold tracking-wider uppercase
                           [text-shadow:_3px_3px_0_#000,_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000] text-opacity-30">
              NO ACHIEVEMENTS
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[18px] mt-[25px] h-full w-full mb-[20px]">
      <div className="font-tektur font-semibold text-[30px] text-white ml-3">
        Medals
      </div>
      <div className="flex flex-wrap ml-2 mt-4 gap-4">
        {achievements.map((achievementName, index) => (
          <AchievementCard key={index} title={achievementName} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;