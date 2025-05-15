"use client";
import React from 'react';

const LeaderboardSkeleton = () => {
  return (
    <div className='h-fit flex flex-col my-[55px] mt-24 animate-pulse'>
      {/* Top 3 Cards Skeleton */}
      <div className='h-[450px] mt-3 flex justify-center items-end gap-32'>
        {/* 3rd Place Skeleton */}
        <div className='w-[244px] h-[357px] self-end flex flex-col items-center'>
          <div className="w-[110px] h-[100px] bg-gray-700 rounded-xl"></div>
          <div className="h-6 w-3/4 bg-gray-700 rounded mt-2"></div>
          <div className="w-[244px] h-[223px] bg-gray-800 rounded-3xl mt-2 flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-700 rounded-full mt-4"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded mt-2"></div>
            <div className="h-1 w-5/6 bg-gray-700 rounded mt-2"></div>
            <div className="h-8 w-1/2 bg-gray-700 rounded mt-4"></div>
            <div className="h-3 w-1/4 bg-gray-700 rounded mt-1"></div>
          </div>
        </div>

        {/* 1st Place with Timer Skeleton */}
        <div className='flex flex-col h-full self-start mt-5 items-center'>
          <div className='w-[244px] h-[357px] flex flex-col items-center'>
            <div className="w-[110px] h-[100px] bg-gray-700 rounded-xl"></div>
            <div className="h-6 w-3/4 bg-gray-700 rounded mt-2"></div>
            <div className="w-[244px] h-[223px] bg-gray-800 rounded-3xl mt-2 flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full mt-4"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded mt-2"></div>
              <div className="h-1 w-5/6 bg-gray-700 rounded mt-2"></div>
              <div className="h-8 w-1/2 bg-gray-700 rounded mt-4"></div>
              <div className="h-3 w-1/4 bg-gray-700 rounded mt-1"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-700 rounded-full mt-4"></div>
          <div className="h-4 w-24 bg-gray-700 rounded mt-2"></div>
          <div className="h-4 w-32 bg-gray-700 rounded mt-1"></div>
        </div>

        {/* 2nd Place Skeleton */}
        <div className='w-[244px] h-[357px] self-end flex flex-col items-center'>
          <div className="w-[110px] h-[100px] bg-gray-700 rounded-xl"></div>
          <div className="h-6 w-3/4 bg-gray-700 rounded mt-2"></div>
          <div className="w-[244px] h-[223px] bg-gray-800 rounded-3xl mt-2 flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-700 rounded-full mt-4"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded mt-2"></div>
            <div className="h-1 w-5/6 bg-gray-700 rounded mt-2"></div>
            <div className="h-8 w-1/2 bg-gray-700 rounded mt-4"></div>
            <div className="h-3 w-1/4 bg-gray-700 rounded mt-1"></div>
          </div>
        </div>
      </div>

      {/* Standing Section Skeleton */}
      <div className='mt-5 h-[40px] flex justify-center'>
        <div className='h-full w-64 bg-gray-800 rounded-xl px-5 flex items-center'>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Information Header Skeleton */}
      <div className='h-[32px] flex flex-row items-center mb-1 ml-[240px]'>
        <div className="h-4 w-16 bg-gray-700 rounded ml-[30px]"></div>
        <div className="h-4 w-24 bg-gray-700 rounded ml-[150px]"></div>
        <div className="h-4 w-16 bg-gray-700 rounded ml-[320px]"></div>
        <div className="h-4 w-16 bg-gray-700 rounded ml-[230px]"></div>
      </div>

      {/* Rating Cards Skeleton */}
      <div className='h-full mx-[140px] flex flex-col items-center'>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex h-[64px] w-[990px] bg-gray-800 rounded-2xl items-center mb-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full ml-[40px]"></div>
            <div className="h-4 w-16 bg-gray-700 rounded ml-[10px]"></div>
            <div className="h-4 w-64 bg-gray-700 rounded ml-[60px]"></div>
            <div className="h-4 w-32 bg-gray-700 rounded ml-[60px]"></div>
            <div className="h-8 w-16 bg-gray-700 rounded-xl ml-[60px]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;