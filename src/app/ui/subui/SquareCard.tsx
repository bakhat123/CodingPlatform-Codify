import React from 'react';
import Image from "next/image"; 
import arrow from '../../../../public/assets/images/cards/arrow.svg';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface SquareCardProps {
  title: string;
  detail: string;
  color: string;
  iconSrc: string;
  bgSrc: string;
}

const SquareCard: React.FC<SquareCardProps> = ({ title, detail, color, iconSrc, bgSrc }) => {
  const { data: session, status } = useSession();
  const rgbaBorderColor = `rgba(${color}, 0.7)`;

  const handleClick = (e: React.MouseEvent) => {
    if (title === "Profile" && status !== 'authenticated') {
      e.preventDefault();
      toast.error('Please login first', {
        position: 'top-center',
        duration: 3000,
      });
      return false;
    }

    if (title === "BuyCoins") {
      e.preventDefault();
      const paymentSection = document.getElementById('payment-section');
      if (paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
      }
      return false;
    }
    return true;
  };

  const getURL = () => {
    if (title === "Profile") {
      return status === 'authenticated' 
        ? `/Profile/${session?.user?.name || 'profile'}` 
        : '#';
    }
    if (title === "BuyCoins") {
      return '#';
    }
    return `/${title}`;
  };

  return (
    <div
      className={`relative flex h-[46.52vh] w-[43.2vh] flex-shrink-0 
                items-end gap-[9.8vh] overflow-hidden bg-primary
                border-t-[0.64vh] border-r border-b border-l border-solid
                rounded-tl-[3.8vh] rounded-bl-[3.8vh] rounded-br-[3.8vh] 
                rounded-tr-[11vh] hover:transition-all hover:duration-200 hover:ease-in-out group`}
      style={{
        borderColor: rgbaBorderColor, 
      }}
    >
      {/* Background Image */}
      <Image
        src={bgSrc}
        alt="Card Background"
        fill
        className="object-cover inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-20"
      />

      {/* Card Content */}
      <h1
        className="absolute left-[2.69vh] top-[5.4vh] w-[16.8vh] text-left ml-2
                  font-inter text-[2.53vh] font-normal text-white"
      >
        {title}
      </h1>

      <p
        className="absolute left-[4vh] top-[11.7vh] w-[35.3vh] text-left
                  font-sora text-[1.74vh] font-normal text-lightGray"
      >
        {detail}
      </p>

      <Image
        src={iconSrc}
        alt="Card Icon"
        width={48}
        height={48}
        className="absolute w-[7.6vh] h-[7.6vh] top-[32.44vh] left-[4vh]"
      />

      {/* Clickable Link */}
      <Link
        href={getURL()}
        onClick={handleClick}
        className="absolute left-[23.4vh] top-[35.13vh] font-sourceCodePro 
                   text-[1.6vh] font-extrabold text-white z-2"
      >
        EXPLORE MORE
      </Link>

      <Image
        src={arrow}
        alt="Arrow"
        width={24}
        height={24}
        className="absolute w-[2.5vh] h-[2.5vh] top-[35vh] left-[35.6vh]"
      />
    </div>
  );
};

export default SquareCard;