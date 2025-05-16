"use client";
import React from 'react';
import Image from 'next/image';
import Button from '@/app/ui/subui/Button';

interface CardProps {
  assetPath: string;
  type: 'pfp' | 'background';
  onUse: (assetPath: string, type: 'pfp' | 'background') => void;
}

const AssetCard: React.FC<CardProps> = ({ assetPath, type, onUse }) => {
  // Normalize the asset path and determine extension
  const normalizedPath = assetPath.trim().toLowerCase();
  const fileExtension = type === 'pfp' ? 'png' : 'jpg';
  const imagePath = `/assets/images/Store/${normalizedPath}.${fileExtension}`;
  

  const handleUse = () => {
    onUse(normalizedPath, type);
  };

  return (
    <div className='w-[200px] h-[245px] outline outline-1 outline-[#212023] rounded-[10px] mr-5 mb-4 flex flex-col hover:outline-[#B3FFED] hover:outline-2 transition-all'>
      {/* Image Container */}
      <div className='w-full h-[142px] outline outline-1 outline-[#212023] rounded-t-[10px] relative overflow-hidden'>
        <Image
          src={imagePath}
          alt={`${type === 'pfp' ? 'Profile' : 'Background'} image`}
          fill
          className="object-cover"
          quality={100}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.classList.add('object-contain'); // Change style for default images
            target.classList.add('p-2'); // Add padding for default images
          }}
        />
      </div>

      {/* Text Content */}
      <div className='p-2 flex-grow flex flex-col'>
        <p className='text-white text-[18px] font-medium font-tektur truncate'>
          {assetPath}
        </p>
        
        <div className='flex justify-between items-end mt-auto'>
          <span className='text-[#626164] text-[10px] font-medium font-tektur'>
            {type}
          </span>
          <Button 
            top="0px" 
            left="0px" 
            pos={`w-[77px] h-[23px]`}
            onClick={handleUse}
            disabled={false}
          >
            Use
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;