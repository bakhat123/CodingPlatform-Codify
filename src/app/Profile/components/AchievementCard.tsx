import React from 'react'
import Image from 'next/image'

interface AchievementCardProps {
    title: string; 
  }
const AchievementCard: React.FC<AchievementCardProps> = ({ title }) => {
  return (
    <div className='w-[185px] h-[215px] outline outline-1 outline-[#212023] rounded-[10px] mr-5 flex flex-col'>
    <Image
      src={`/assets/images/Profile/Achievements/tick.svg`}
      alt={`Icon`}
      width={25} 
      height={23}
      className="w-[25px] h-[23px] object-cover mt-[18px] mr-[12px] self-end"
      quality={100}
    />
    <Image
      src={`/assets/images/Profile/Achievements/${title}.svg`}
      alt={`Icon`}
      width={100} 
      height={90}
      className="w-[100px] h-[90px] object-cover mt-[10px] self-center"
      quality={100}
    />
<p className='text-white text-[15px] font-medium font-tektur self-center mt-[25px] '>{title}</p>
</div>
  )
}

export default AchievementCard