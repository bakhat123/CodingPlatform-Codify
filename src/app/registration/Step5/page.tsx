'use client';

import { useState } from 'react';
import StepTracker from '../components/StepTracker';
import ChatBot from '../components/ChatBot';
import StepInput from '../components/StepInput';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';
import { useRouter } from 'next/navigation';

export default function Step5() {
  const [details, setDetails] = useState('');
  const router = useRouter();

  const handleNext = () => {
    console.log('Further Details:', details);
    // You could navigate to a summary or confirmation screen
    router.push('/Registration/Summary');
  };

  return (
    <div className="min-h-screen bg-[#0E0C15] text-white p-8 mt-24 flex flex-col gap-8">
      <StepTracker currentStep={4} />
      <div className="flex mt-[40px]">
        <div className="flex flex-col gap-6 ml-[70px] w-[650px]">
          <BackButton />
          <StepInput label="More about you" value={details} onChange={setDetails} />
          <NextButton onClick={handleNext} />
        </div>
        <ChatBot question="Tell me more" answer={details} />
      </div>
    </div>
  );
}
