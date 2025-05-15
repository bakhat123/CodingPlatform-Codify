// src/app/profile/components/InfoCard.tsx
import React from 'react'

interface InfoCardProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InfoCard = ({ label, value, onChange }: InfoCardProps) => {
  return (
    <div className='mb-4 flex items-center'>
      <div className='text-white text-lg font-medium w-[100px]'>{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='ml-4 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none flex-grow'
      />
    </div>
  )
}

export default InfoCard