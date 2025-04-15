"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { ImportantAnnouncement } from '@/components/ImportantAnnouncement';
import { Disclaimer } from '@/components/Disclaimer';
import { ActionButtons } from '@/components/ActionButtons';

export default function Home() {
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Tránh lỗi hydration bằng cách sử dụng useEffect để xác định khi component đã mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCancel = () => {
    // Trong thực tế, có thể chuyển hướng về trang chủ
    alert('Application canceled');
  };

  const handleContinue = () => {
    if (checked) {
      router.push('/application-form');
    } else {
      setShowError(true);
    }
  };

  // Chỉ render khi client-side
  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen pb-10 bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4">
        <ImportantAnnouncement
          checked={checked}
          setChecked={setChecked}
          showError={showError}
          setShowError={setShowError}
        />

        <Disclaimer />

        <ActionButtons
          onCancel={handleCancel}
          onContinue={handleContinue}
          termsChecked={checked}
          setShowTermsError={setShowError}
        />
      </div>
    </main>
  );
}
