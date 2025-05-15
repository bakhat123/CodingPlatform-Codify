"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import RatingCard from './ui/RatingCard'
import TopRatingCard from './ui/TopRatingCard'
import Timer from './ui/Timer'
import Standing from './ui/Standing'
import Information from './ui/Information'
import LeaderboardSkeleton from './skeleton'

interface LeaderboardEntry {
  id: number;
  place: string;
  username: string;
  points: number;
  prize: number;
}

interface LeaderboardResponse {
  ratings: LeaderboardEntry[];
  userRank?: number;
  totalUsers: number;
}

const Page = () => {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | undefined>();
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const username = session?.user?.name;
        console.log('Fetching leaderboard for user:', username);
        
        const url = username 
          ? `/api/leaderboard?username=${encodeURIComponent(username)}`
          : '/api/leaderboard';

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
        
        const data: LeaderboardResponse = await response.json();
        console.log('API response:', data);
        
        setRatings(data.ratings);
        setUserRank(data.userRank);
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [session]);

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return (
      <div className='h-fit flex flex-col my-[55px] mt-24 items-center justify-center'>
        <div className="text-red-500 text-lg">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className='h-fit flex flex-col my-[55px] mt-24 items-center justify-center'>
        <div className="text-white text-lg">No leaderboard data available</div>
      </div>
    );
  }

  return (
    <div className='h-fit flex flex-col my-[55px] mt-24'>
      {/* Top 3 Cards */}
      <div className='h-[450px] mt-3 flex justify-center items-end gap-32'>
        {/* 3rd Place */}
        <div className='w-[244px] h-[357px] self-end'>
          {ratings.length > 2 && (
            <TopRatingCard
              key={ratings[2].id}
              place={ratings[2].place}
              username={ratings[2].username}
              points={ratings[2].points}
              prize={ratings[2].prize}
            />
          )}
        </div>

        {/* 1st Place with Timer */}
        <div className='flex flex-col h-full self-start mt-5'>
          {ratings.length > 0 && (
            <TopRatingCard
              key={ratings[0].id}
              place={ratings[0].place}
              username={ratings[0].username}
              points={ratings[0].points}
              prize={ratings[0].prize}
            />
          )}
          <Timer />
        </div>

        {/* 2nd Place */}
        <div className='w-[244px] h-[357px] self-end'>
          {ratings.length > 1 && (
            <TopRatingCard
              key={ratings[1].id}
              place={ratings[1].place}
              username={ratings[1].username}
              points={ratings[1].points}
              prize={ratings[1].prize}
            />
          )}
        </div>
      </div>

      {/* Standing Section */}
      <div className='mt-5 h-[120] flex flex-col items-center justify-start'>
        <Standing userRank={userRank} totalUsers={totalUsers} />
      </div>

      {/* Rest of the Leaderboard */}
      <div className='h-full mx-[140px] flex flex-col items-center'> 
        <Information />
        {ratings.slice(3).map((rating) => (
          <RatingCard
            key={rating.id}
            place={rating.place}
            username={rating.username}
            points={rating.points}
            prize={rating.prize}
            isLoggedInUser={session?.user?.name === rating.username}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;