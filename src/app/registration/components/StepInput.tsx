import { useState } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
};

export default function StepInput({
  label,
  value,
  onChange,
  placeholder = 'type here',
  type = 'text',
}: Props) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);

  return (
    <div className="flex flex-col font-inter">
      <h2 className="text-[25px] font-semibold tracking-[1px]">{label}</h2>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setCurrentPlaceholder('')}
        onBlur={() => setCurrentPlaceholder(placeholder)}
        placeholder={currentPlaceholder}
        className="text-[60px] font-tektur bg-transparent border-none outline-none text-white placeholder-white font-regular"
      />
    </div>
  );
}
