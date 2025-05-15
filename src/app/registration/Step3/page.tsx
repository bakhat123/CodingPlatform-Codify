'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepTracker from '../components/StepTracker';
import ChatBot from '../components/ChatBot';
import StepInput from '../components/StepInput';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';

export default function Step3() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleNext = () => {
    console.log('Email:', email);
    router.push('/Registration/Step4');
  };

  return (
    <div className="min-h-screen bg-[#0E0C15] text-white p-8 mt-24 flex flex-col gap-8">
      <StepTracker currentStep={2} />
      <div className="flex mt-[40px]">
        <div className="flex flex-col gap-6 ml-[70px] w-[650px]">
          <BackButton/>
          <StepInput label="Your email" value={email} onChange={setEmail} type="email" />
          <NextButton onClick={handleNext} />
        </div>
        <ChatBot question="Your email?" answer={email} />
      </div>
    </div>
  );
}
