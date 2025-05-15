import React from 'react'
import Image from 'next/image'
const Information = () => {
  return (
    <div className='h-8 flex flex-row items-center mt-[14px] mr-[10px] 
        font-tektur text-[14px] tracking-wider font-medium text-[#9A999E] 
        px-4'>
      <div className='flex w-[15%]'>
      <p>Week </p>
      <Image  src="/assets/images/Profile/History/dropdown.svg"
              alt="Dropdown"
              width={26}
              height={20}
              className="inset-0 mb-1 "
              />
      </div>
      <p className="w-[30%]">Problem</p>
      <p className="w-[20%]">Last Result</p>
      <p className="w-[20%] pl-9">Submissions</p>
      
    </div>
  )
}

export default Information
