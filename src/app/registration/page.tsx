'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/Registration/Step1');
  }, [router]);

  return null;
}