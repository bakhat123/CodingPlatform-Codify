import React from 'react'
import Image from 'next/image'

interface RatingCardProps {
  place: string;
  username: string;
  points: number;
  prize: number;
  isLoggedInUser: boolean;  // New prop to highlight logged-in user
}

const RatingCard: React.FC<RatingCardProps> = ({ place, username, points, prize, isLoggedInUser }) => {
  return (
    <div className={`flex h-[64px] w-[990px] bg-[#141723] rounded-2xl 
                    shadow-[0_4px_4px_rgba(0,0,0,0.25)] items-center mb-2
                    font-tektur text-[14px] tracking-wider font-medium text-white pointer-events-none
                    ${isLoggedInUser ? 'border-2 border-[#D0A4FF] bg-[#1E233A] shadow-[0_0px_20px_5px_rgba(208,164,255,0.2)]' : ''}`}> {/* Subtle highlight for logged-in user */}
      
      <Image
        src="/assets/images/leaderboard/Trophy.svg"
        alt="Trophy"
        width={21}
        height={21}
        className="ml-[40px]"
      />
      <p className='ml-[10px] w-[180px]'>{place}</p>
      <p className={`w-[400px] ${isLoggedInUser ? 'text-[#D0A4FF]' : ''}`}>{username}</p> {/* Highlight logged-in username */}
      <p className={`w-[250px] ${isLoggedInUser ? 'text-[#D0A4FF]' : ''}`}>{points}</p> {/* Highlight points for logged-in user */}
      <div className='flex justify-center items-center bg-[#1E233A] w-[73px] h-[35px] rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)]'>
        <Image 
          src="/assets/images/leaderboard/Diamond.svg"
          alt="Diamond"
          width={15}
          height={15}
          className="inset-0 mr-1"
        />
        {prize}
      </div>
    </div>
  )
}

export default RatingCard
