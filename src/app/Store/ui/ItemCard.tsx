"use client";
import React from "react";
import Image from "next/image";
import Button from "@/app/ui/subui/Button";  // Assuming Button component exists

interface StoreCardProps {
  name: string;
  type: string;
  features: string[];
  price: string;
  onPurchase: () => void;  // Function to handle purchase
  isPurchased: boolean;  // Whether the item is purchased
}

const ItemCard: React.FC<StoreCardProps> = ({ name, type, features, price, onPurchase, isPurchased }) => {
  return (
    <div
      className={`w-[39.8214vh] h-[57.1429vh] mt-[4.2857vh] rounded-[4.2857vh] backdrop-blur-lg shadow-[0_4px_4px_rgba(0,0,0,0.4)] bg-[rgba(37,37,39,0.5)] relative`}
    >
      {/* Wooden Texture Overlay */}
      {isPurchased && (
        <div
          className="absolute top-[15vh]  w-[40vh] h-[15vh] bg-cover bg-center "
          style={{
            backgroundImage: "url('/assets/images/Store/wood.png')", // Replace with your actual wood texture image path
            backgroundBlendMode: "multiply",
            opacity: 0.8,
            zIndex: 10,
          }}
        >
          <div className="absolute top-[30%] left-[10%] text-4xl text-white font-extrabold transform ">
            PURCHASED
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="w-[35.7143vh] h-[35.3571vh] flex justify-center items-center rounded-[2.8571vh] ml-[2.1429vh] mt-[2.1429vh] shadow-md">
        <Image
          src={`/assets/images/Store/${name}.${type === "Background" ? "jpg" : "png"}`}
          alt="Image"
          width={900}
          height={800}
          className="w-[35.7143vh] h-[35.3571vh] object-cover object-center rounded-[2.8571vh]"
          quality={100}
        />
      </div>

      <div className="font-medium font-tektur text-white text-[3.2286vh] ml-[3.5714vh] mt-[1.3286vh] leading-[3.5714vh]">
        {name} <br />
        <div className="text-[#626164] text-[2.1429vh]">{type}</div>
      </div>

      <div className="ml-[3.5714vh] mt-[0.7143vh] flex flex-row items-center">
        <Image
          src={`/assets/images/Store/Diamond.svg`}
          alt="Diamond"
          width={27}
          height={27}
          className="w-[4.8214vh] h-[4.8214vh]"
        />
        <span className="font-bold text-[3.75vh] font-tektur text-white ml-[1.4286vh] mb-[0.7143vh]">{price}</span>

        {/* Disable button if item is purchased */}
        <Button
          onClick={onPurchase}
          children={isPurchased ? "Purchased" : "BUY"}
          top="0vh"
          left="3.3571vh"
          pos="relative w-[19.5914vh] h-[6.3364vh]"
          disabled={isPurchased}  // Disable the button if the item is purchased
        />
      </div>
    </div>
  );
};

export default ItemCard;
