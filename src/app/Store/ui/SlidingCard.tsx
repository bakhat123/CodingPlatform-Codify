"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/assets/images/Store/diablo.jpg",
  "/assets/images/Store/fortnite.jpg",
  "/assets/images/Store/terrorance.jpg",
  "/assets/images/Store/witcher.jpg",
  "/assets/images/Store/shadow.jpg",
];

const SlidingCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[142.8571vh] h-[48.2143vh] mt-[14.2857vh] ml-[7.1429vh] rounded-[4.2857vh] outline outline-[0.1786vh]
      outline-black shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_4px_10px_rgba(0,0,0,0.25)] overflow-hidden bg-black">
      
      {/* Sliding Container */}
      <div
        className="absolute top-0 left-0 w-full h-full flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {/* Images */}
        {images.map((img, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <Image
              src={img}
              alt="Sliding Background"
              width={800}
              height={270}
              className="w-full h-full object-cover object-center rounded-[4.2857vh]"
              quality={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingCard;
