"use client";
import React, { useState, useEffect } from "react";
import Heading from "./ui/TournamentHeading";
import ParticipentCard from "./ui/ParticipentCard";
import ProblemCard from "./ui/ProblemCard";
import Timer from "../LeaderBoard/ui/Timer";
import AwardContainer from "./ui/AwardContainer";

/* // Removed unused interface RawParticipant
interface RawParticipant {
  username?: string;
  totalPoints?: number;
  rank?: number;
  rewardClaimed?: boolean;
}
*/

interface Problem {
  _id: string;
  title: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Participant {
  username: string;
  totalPoints: number;
  rank?: number;
  rewardClaimed: boolean;
}

const Page = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [tournamentStatus, setTournamentStatus] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchTournamentData = async () => {
      setIsLoading(true);
      try {
        // Fetch participants data
        const participantsResponse = await fetch("/api/tournament/participants");
        const participantsData = await participantsResponse.json();

        if (participantsData.error) {
          console.error("Error fetching participants:", participantsData.error);
        } else {
          // Define the type of participant explicitly here
          const sortedParticipants: Participant[] = participantsData.participants.map((participant: { name: string, points: string }) => ({
            username: participant.name,
            totalPoints: parseInt(participant.points, 10),
            rank: 0, // Default rank if not available
            rewardClaimed: false, // Default value, change as needed
          }));
          
          setParticipants(sortedParticipants);
        }

        // Fetch current tournament data including problems
        const tournamentResponse = await fetch("/api/tournament/current");
        const tournamentData = await tournamentResponse.json();

        if (tournamentData.error) {
          console.error("Error fetching tournament:", tournamentData.error);
        } else {
          // Set problems from the current tournament
          setProblems(tournamentData.problems || []);
          setCurrentWeek(tournamentData.weekNumber || 0);
          setTournamentStatus(tournamentData.status || 'upcoming');
        }
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournamentData();
  }, []);
  
  return (
    <div className="relative max-w-[1280px] h-fit flex flex-wrap md:flex-nowrap gap-6 mt-[30px] px-4 md:px-0 mx-auto mb-[100px]">
      {/* Participants Section */}
      <div className="h-[452px] w-[374px] mt-[67px] rounded-[10px] relative">
        <Heading title="Participants" />
        <div className="h-[400px] overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-32 text-white">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border-t-2 border-blue-500 border-r-2 animate-spin mb-2"></div>
                <span>Loading participants...</span>
              </div>
            </div>
          ) : participants.length > 0 ? (
            participants.map((participant, index) => (
              <ParticipentCard
                key={participant.username || `participant-${index}`}
                position={participant.rank ? participant.rank.toString() : (index + 1).toString()}
                name={participant.username || "Unknown"}
                points={participant.totalPoints !== undefined ? participant.totalPoints.toString() : "0"}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-32 text-white">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <p className="mt-2">No participants yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Problems Section */}
      <div className="h-fit w-[490px] mt-[67px] ml-[86px]">
        <Heading title={`Week ${currentWeek} Problems`} />
        <div className="h-fit">
          {isLoading ? (
            <div className="flex justify-center items-center h-32 text-white">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border-t-2 border-blue-500 border-r-2 animate-spin mb-2"></div>
                <span>Loading problems...</span>
              </div>
            </div>
          ) : problems.length > 0 ? (
            problems.map((problem, index) => (
              <ProblemCard
                key={problem._id}
                first={index === 0}
                title={problem.title}
                points={problem.points}
                difficulty={problem.difficulty}
                id={problem._id}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-32 text-white">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <p className="mt-2">No problems available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timer and Award Section */}
      <div className="h-[452px] w-[300px] mt-[67px] ml-[10px] flex flex-col">
        <div className="h-[160px] flex justify-center items-center glass-morphism rounded-xl p-4 mb-5">
          <Timer />
        </div>
        {tournamentStatus === 'completed' ? (
          <div className="glass-morphism rounded-xl p-4">
            <AwardContainer />
          </div>
        ) : (
          <div className="glass-morphism rounded-xl p-4 flex flex-col items-center justify-center text-white text-center">
            <svg className="w-12 h-12 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold mb-1">Tournament {tournamentStatus === 'upcoming' ? 'Coming Soon' : 'In Progress'}</h3>
            <p className="text-sm text-gray-300">
              {tournamentStatus === 'upcoming' ? 'Stay tuned for the start!' : 'Complete challenges to earn points!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;