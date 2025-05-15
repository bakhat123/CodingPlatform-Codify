'use client';

const steps = [
  'User Details',
  'Extra Info',
  'User Email',
  'Authentication',
  'Further Details',
];

type Props = {
  currentStep: number; // 0-based index
};

export default function StepTracker({ currentStep }: Props) {
  return (
    <div className="flex justify-center items-center gap-0 font-tektur">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center mx-6">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold
              ${
                index <= currentStep
                  ? 'bg-[#B3FFED] text-black border-[#B3FFED]'
                  : 'border-[#9A999E] text-white'
              }`}
          >
            {index + 1}
          </div>
          <span className="text-[11px] font-normal mt-2 text-center w-24">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}
