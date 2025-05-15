import React from 'react'
import Image from 'next/image'

const AwardContainer = () => {
  return (
    <div className='h-[293px] border-white border-b-[1px] border-l-[4px] 
    rounded-[20px] flex flex-col font-tektur text-[14px] font-medium tracking-[1px] '>
      <div className='text-white mt-[15px] ml-[10px] flex items-center'>
      <Image
            src="/assets/images/Tournament/bullet.svg"
            alt="bullet"
            width={42}
            height={42}
            className="w-[21px] h-[21px] mr-[10px] mb-[15px]"
            quality={100}
            priority
          />
        Come in top 3 to win this medal and 300 gems</div>

        <div className='flex mt-[30px] ml-[20px] mb-[15px] items-center'>


        <div className="flex flex-col items-center">
        <Image
        src="/assets/images/Tournament/medal.svg"
        alt="medal"
        width={42}
        height={42}
        className="w-[100px] h-[90px]"
        />
        <span className="text-white text-sm mt-2">Stashh Whale</span>
        </div>
        
        <Image
        src="/assets/images/Tournament/plus.svg"
        alt="plus"
        width={42}
        height={42}
        className="w-[50px] h-[50px] mt-2 ml-2 mr-2"
        />
        
        <div className="flex flex-col items-center">
        <Image
        src="/assets/images/Tournament/Diamonds.svg"
        alt="diamonds"
        width={42}
        height={42}
        className="w-[85px] h-[85px]"
        />
        <span className="text-white text-sm mt-2">300 Gems</span>
        </div>
        
        </div>

    </div>
  )
}

export default AwardContainer