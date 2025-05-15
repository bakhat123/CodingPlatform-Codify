import React from 'react'
import Image from 'next/image'

const SocialIcons = () => {
  return (
    <div className="flex items-center space-x-[4.2857vh]">
    <a href="https://www.discord.com" target="_blank" rel="noopener noreferrer">
    <div className="w-[5.7143vh] h-[5.7143vh]">
     <Image
        src="/assets/images/footer/Component1.svg"
        alt="Discord Icon"
        width={32}
        height={32}
        className="w-[5.7143vh] h-[5.7143vh] cursor-pointer"
      />
      </div>
    </a>
    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <div className="w-[5.7143vh] h-[5.7143vh]"> 
      <Image
        src="/assets/images/footer/Component2.svg"
        alt="Instagram Icon"
        width={32}
        height={32}
        className="w-[5.7143vh] h-[5.7143vh] cursor-pointer"
      />
    </div>
    </a>
    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <div className="w-[5.7143vh] h-[5.7143vh]"> 
      <Image
        src="/assets/images/footer/Component3.svg"
        alt="Facebook Icon"
        width={32}
        height={32}
        className="w-[5.7143vh] h-[5.7143vh] cursor-pointer"
      />
      </div>
    </a>
    <a href="https://www.skype.com" target="_blank" rel="noopener noreferrer">
    <div className="w-[5.7143vh] h-[5.7143vh]"> 
      <Image
        src="/assets/images/footer/Component4.svg"
        alt="Skype Icon"
        width={32}
        height={32}
        className="w-[5.7143vh] h-[5.7143vh] cursor-pointer"
      />
      </div>
    </a>
  </div>
  )
}

export default SocialIcons