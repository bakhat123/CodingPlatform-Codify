"use client";
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="relative w-screen min-h-screen flex mt-5">
      {/* Sidebar Skeleton */}
      <div className="w-[88.7857vh] min-h-screen flex justify-center items-start">
        <div className="bg-[rgba(37,37,39,0.4)] w-[48.3929vh] h-[78.2857vh] mt-[14.2857vh] mb-[5.4vh] rounded-[4.2857vh] flex flex-col shadow-[0_4px_6px_rgba(0,0,0,0.4)] backdrop-blur-md animate-pulse">
          <div className="h-[3.5714vh] w-[20vh] bg-gray-700 rounded ml-[5vh] mt-[5vh] mb-[2.8571vh]"></div>
          
          {[...Array(3)].map((_, i) => (
            <div key={`category-${i}`} className="h-[5vh] w-[90%] bg-gray-700 rounded mx-auto my-[1vh]"></div>
          ))}
          
          <div className="h-[2.14vh] w-[39.29vh] bg-gray-700 rounded ml-[3.5714vh] mt-[2.8571vh]"></div>
          
          <div className="h-[3.5714vh] w-[20vh] bg-gray-700 rounded ml-[5vh] mt-[2.1429vh] mb-[2.8571vh]"></div>
          
          {[...Array(5)].map((_, i) => (
            <div key={`new-${i}`} className="h-[5vh] w-[90%] bg-gray-700 rounded mx-auto my-[1vh]"></div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full h-full flex flex-col">
        {/* Sliding Card Skeleton */}
        <div className="w-full h-[62vh] flex justify-start items-center">
          <div className="relative w-[142.8571vh] h-[48.2143vh] mt-[14.2857vh] ml-[7.1429vh] rounded-[4.2857vh] outline outline-[0.1786vh] outline-black shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_4px_10px_rgba(0,0,0,0.25)] overflow-hidden bg-gray-800 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-700"></div>
            </div>
          </div>
        </div>

        {/* Item Cards Skeleton */}
        <div className="w-full grid grid-cols-3 gap-[5.1286vh] px-[9.9286vh] mb-[7.14vh] gap-y-[0vh]">
          {[...Array(6)].map((_, i) => (
            <div key={`card-${i}`} className="w-[39.8214vh] h-[57.1429vh] mt-[4.2857vh] rounded-[4.2857vh] shadow-[0_4px_4px_rgba(0,0,0,0.4)] bg-gray-800 animate-pulse">
              <div className="w-[35.7143vh] h-[35.3571vh] bg-gray-700 rounded-[2.8571vh] ml-[2.1429vh] mt-[2.1429vh]"></div>
              <div className="h-[3.2286vh] w-[60%] bg-gray-700 rounded ml-[3.5714vh] mt-[1.3286vh]"></div>
              <div className="h-[2.1429vh] w-[40%] bg-gray-700 rounded ml-[3.5714vh] mt-[1vh]"></div>
              <div className="flex items-center ml-[3.5714vh] mt-[2vh]">
                <div className="w-[4.8214vh] h-[4.8214vh] bg-gray-700 rounded-full"></div>
                <div className="h-[3.75vh] w-[10vh] bg-gray-700 rounded ml-[1.4286vh]"></div>
                <div className="h-[6.3364vh] w-[19.5914vh] bg-gray-700 rounded ml-[3.3571vh]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;