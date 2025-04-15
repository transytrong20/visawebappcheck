"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookUser, Briefcase, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApplicationForm() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Tránh lỗi hydration bằng cách sử dụng useEffect để xác định khi component đã mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Các loại visa
  const visaTypes = [
    {
      id: 'general',
      icon: <BookUser size={32} />,
      titleEn: 'General Visa Applications',
      titleZh: '一般簽證申請',
      descEn: 'Apply for a general visa to visit our country',
      descZh: '申請訪問我國的一般簽證',
      color: '#1b4598',
      iconBg: '#c9e2e7',
    },
    {
      id: 'labor',
      icon: <Briefcase size={32} />,
      titleEn: 'Foreign Labor Visa Applications',
      titleZh: '外籍勞工簽證申請',
      descEn: 'Apply for a work visa or labor permit',
      descZh: '申請工作簽證或勞工許可',
      color: '#33ad85',
      iconBg: '#e5d7a2',
    },
    {
      id: 'evisa',
      icon: <Globe size={32} />,
      titleEn: 'eVisa Applications',
      titleZh: '電子簽證申請',
      descEn: 'Apply for an electronic visa online',
      descZh: '在線申請電子簽證',
      color: '#0d6efd',
      iconBg: '#d8ad94',
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1b4598] text-white py-5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1 rounded-md mr-2 ${language === 'en' ? 'bg-white text-[#1b4598]' : 'bg-transparent text-white border border-white'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-4 py-1 rounded-md ${language === 'zh' ? 'bg-white text-[#1b4598]' : 'bg-transparent text-white border border-white'}`}
            >
              中文
            </button>
          </div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Visa Application System' : '簽證申請系統'}
          </h1>
          <p className="mt-2">
            {language === 'en' ? 'Please choose one of the following application types' : '請選擇以下其中一種申請類型'}
          </p>
        </div>
      </header>

      {/* Logo */}
      <div className="border-b border-gray-300 py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="max-w-[600px] w-full">
            <Image
              src="/logo.jpg"
              alt="Bureau of Consular Affairs logo"
              width={600}
              height={100}
              className="h-auto w-full"
              priority
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visaTypes.map((visa) => (
            <div key={visa.id} className="border rounded-lg p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white"
                style={{ backgroundColor: visa.color }}
              >
                {visa.icon}
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">
                {language === 'en' ? visa.titleEn : visa.titleZh}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {language === 'en' ? visa.descEn : visa.descZh}
              </p>
              <div className="w-full space-y-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {language === 'en' ? 'New Application' : '新申請'}
                </Button>
                {visa.id !== 'evisa' ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      {language === 'en' ? 'Edit' : '編輯'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      {language === 'en' ? 'Print' : '列印'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => router.push('/evisa-info')}
                  >
                    {language === 'en' ? 'Check Status' : '查詢狀態'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 text-center text-gray-600 border-t">
        <p>© 2024 {language === 'en' ? 'Visa Application System. All rights reserved.' : '簽證申請系統。版權所有。'}</p>
      </footer>
    </div>
  );
}
