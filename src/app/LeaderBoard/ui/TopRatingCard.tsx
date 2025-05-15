import React from 'react';
import Image from 'next/image';

interface TopRatingCardProps {
  place: string;
  username: string;
  points: number;
  prize: number;
}

const TopRatingCard: React.FC<TopRatingCardProps> = ({
  place,
  username,
  points,
  prize,
}) => {
  return (
    <div className={`w-[244px] h-[357px] self-start flex flex-col items-center`}>
      <div className="w-[110px] h-[100px] shadow-[0_0_40px_15px_rgba(255,255,255,0.2)] rounded-xl outline outline-1 outline-[#C0C0C0] outline-opacity-20 backdrop-blur-md backdrop-brightness-125 pointer-events-none">
        <Image  
          src={`/assets/images/leaderboard/Image${place}.png`}
          alt="Image"
          width={900}
          height={800}
          className="w-[110px] h-[100px] object-cover object-center rounded-xl"
          quality={100}
        />
      </div>

      <div className="text-white tracking-wider font-semibold text-[24px] font-tektur mt-2 pointer-events-none">
        {username}
      </div> 

      <div className="w-[244px] h-[223px] shadow-[inset_0_4px_10px_rgba(0,0,0,0.30)] rounded-3xl bg-gradient-to-b from-[#252937] to-[#0E0C15] via-[#252937] via-[0%] to-[80%] flex flex-col items-center pointer-events-none">
        <Image  
          src={`/assets/images/leaderboard/Trophy${place}.svg`}
          alt="Trophy"
          width={44}
          height={44}
          className="mt-1"
        />  

        <div className="text-white font-tektur text-[12px] font-medium tracking wider">Earn {points} points</div>   

        <Image  
          src="/assets/images/leaderboard/line.svg"
          alt="line"
          width={217}
          height={4}
          className="mt-1"
        />

        <div className="font-tektur text-white font-medium text-[24px] flex justify-center h-[31px] mr-7">
          <Image  
            src="/assets/images/leaderboard/Diamond.svg"
            alt="Diamond"
            width={21}
            height={21}
            className="mr-2 mt-1"
          />
          {prize}
        </div>
        <div className="text-[10px] font-light font-tektur text-white w-full flex justify-center mr-4">Prize</div>
      </div>
    </div>
  );
};

export default TopRatingCard;
