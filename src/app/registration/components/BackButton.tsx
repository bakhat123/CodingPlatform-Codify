'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-white  w-fit font-tektur text-[18px] font-medium"
    >
      <ArrowLeft size={16} /> back
    </button>
  );
}
