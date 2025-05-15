'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepTracker from '../components/StepTracker';
import ChatBot from '../components/ChatBot';
import StepInput from '../components/StepInput';
import BackButton from '../components/BackButton';
import NextButton from '../components/NextButton';

export default function Step4() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleNext = () => {
    console.log('Code:', code);
    router.push('/Registration/Step5');
  };

  return (
    <div className="min-h-screen bg-[#0E0C15] text-white p-8 mt-24 flex flex-col gap-8">
      <StepTracker currentStep={3} />
      <div className="flex mt-[40px]">
        <div className="flex flex-col gap-6 ml-[70px] w-[650px]">
          <BackButton/>
          <StepInput label="Authentication code" value={code} onChange={setCode} />
          <NextButton onClick={handleNext} />
        </div>
        <ChatBot question="Auth code?" answer={code} />
      </div>
    </div>
  );
}
