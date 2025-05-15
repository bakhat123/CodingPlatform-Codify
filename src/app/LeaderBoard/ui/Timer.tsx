"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time
      const now = new Date();
      
      // Get next Saturday at midnight (12:00 AM)
      const nextSaturday = new Date();
      nextSaturday.setDate(now.getDate() + (6 - now.getDay())); // 6 is Saturday
      nextSaturday.setHours(24, 0, 0, 0); // Set to midnight
      
      // If today is Saturday, add 7 days to get to next Saturday
      if (now.getDay() === 6 && now.getHours() >= 0) {
        nextSaturday.setDate(nextSaturday.getDate() + 7);
      }
      
      const difference = nextSaturday.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Format numbers to always show 2 digits
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className='flex flex-col self-center pointer-events-none'>
      <Image 
        src="/assets/images/leaderboard/Alarm Clock.svg"
        alt="Alarm Clock"
        width={26}
        height={26}
        className="inset-0 mb-1 ml-10"
      />
      <p className='text-center font-tektur font-medium tracking-wider text-[#646C8B] text-[10px]'>
        Ends in
      </p>
      <p className='text-center font-tektur font-medium tracking-wider text-white text-[12px]'>
        {`${formatNumber(timeLeft.days)}d ${formatNumber(timeLeft.hours)}h ${formatNumber(timeLeft.minutes)}m ${formatNumber(timeLeft.seconds)}s`}
      </p>
    </div>
  );
};

export default Timer;