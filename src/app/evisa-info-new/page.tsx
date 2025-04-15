"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EVisaInfoNew() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#204189] text-white py-5">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1 rounded-md mr-2 ${language === 'en' ? 'bg-white text-[#204189]' : 'bg-transparent text-white border border-white'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-4 py-1 rounded-md ${language === 'zh' ? 'bg-white text-[#204189]' : 'bg-transparent text-white border border-white'}`}
            >
              中文
            </button>
          </div>
          <h1 className="text-3xl font-bold text-center">
            {language === 'en' ? 'General Information on eVisa Application' : '電子簽證申請一般資訊'}
          </h1>
          <p className="mt-2 text-center">
            {language === 'en'
              ? 'Important information about eVisa eligibility and requirements'
              : '電子簽證申請資格和要求的重要資訊'}
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
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-[#f1f6f1] p-8 rounded-lg space-y-8">
          {/* Eligibility Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#204189] text-center">
              {language === 'en' ? 'ELIGIBILITY' : '申請資格'}
            </h2>
            <div className="space-y-4">
              <p>
                {language === 'en'
                  ? 'Nationals of the following countries are eligible for an eVisa when they meet relevant criteria: Bahrain, Bosnia and Herzegovina, Burkina Faso, Colombia*, Dominica, Ecuador, Kuwait, Mauritius, Montenegro, Oman, Panama, Peru, Qatar, Saudi Arabia, Solomon Islands, Türkiye, United Arab Emirates.'
                  : '符合相關條件的以下國家國民可申請電子簽證：巴林、波斯尼亞和黑塞哥維那、布基納法索、哥倫比亞*、多米尼克、厄瓜多爾、科威特、毛里求斯、黑山、阿曼、巴拿馬、秘魯、卡塔爾、沙特阿拉伯、所羅門群島、土耳其、阿拉伯聯合大公國。'}
              </p>
              <p className="text-sm italic">
                {language === 'en'
                  ? 'Note: Colombian passport holders must provide a valid visa or resident certificate issued by a Schengen country or a valid resident certificate or visa valid for more than 180 days issued by the United States.'
                  : '注意：哥倫比亞護照持有人必須提供申根國家簽發的有效簽證或居留證，或美國簽發的有效期超過180天的居留證或簽證。'}
              </p>
              <p>
                {language === 'en'
                  ? 'Furthermore, foreign nationals who have been invited to attend international conferences, sporting events, trade fairs or other activities in Taiwan—organized, co-organized, or sponsored by central government agencies—are also eligible for an eVisa.'
                  : '此外，受邀參加台灣中央政府機構主辦、合辦或贊助的國際會議、體育賽事、商展或其他活動的外國人士也可申請電子簽證。'}
              </p>
            </div>
          </section>

          {/* Requirements Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#204189] text-center">
              {language === 'en' ? 'REQUIREMENTS & PROCEDURES' : '申請要求和程序'}
            </h2>
            <div className="space-y-4">
              <p>
                {language === 'en'
                  ? 'eVisa applicants must possess an ordinary, official, or diplomatic passport with validity of at least six months as of the date of intended entry into Taiwan.'
                  : '電子簽證申請人必須持有普通、公務或外交護照，且自預定入境台灣之日起有效期至少六個月。'}
              </p>
              <p>
                {language === 'en'
                  ? 'To obtain an eVisa, applicants must submit relevant personal information and pay the required fee by credit card (Visa or MasterCard) online.'
                  : '申請電子簽證時，申請人必須在線提交相關個人資料，並使用信用卡（Visa或MasterCard）支付所需費用。'}
              </p>
            </div>
          </section>

          {/* Purposes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#204189] text-center">
              {language === 'en' ? 'PURPOSES OF VISIT' : '訪問目的'}
            </h2>
            <p>
              {language === 'en'
                ? 'Please note that eVisas are only granted for tourism and business purposes, as well as for visiting relatives and attending international conferences or sporting events in Taiwan.'
                : '請注意，電子簽證僅適用於觀光、商務目的，以及探親訪友和參加台灣的國際會議或體育賽事。'}
            </p>
          </section>

          {/* Validity Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#204189] text-center">
              {language === 'en' ? 'VALIDITY & DURATION OF STAY' : '有效期和停留期限'}
            </h2>
            <p>
              {language === 'en'
                ? 'The validity of an eVisa is three months starting from the issue date. The eVisa is a single-entry visa, and the maximum duration of stay in Taiwan is 30 days.'
                : '電子簽證自簽發之日起有效期為三個月。電子簽證為單次入境簽證，在台灣的最長停留期限為30天。'}
            </p>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button
            onClick={() => router.push('/evisa-info')}
            className="bg-[#f6970f] hover:bg-[#e58a0a] text-white px-8 py-3 text-lg font-medium"
          >
            {language === 'en' ? 'Online Application Form' : '線上申請表'}
          </Button>
          <Button
            onClick={() => router.push('/evisa-form')}
            className="bg-[#5ab8ee] hover:bg-[#3a9ddb] text-white px-8 py-3 text-lg font-medium"
          >
            {language === 'en' ? 'Confirm & Continue' : '確認並繼續'}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 text-center text-gray-600 border-t">
        <p>© 2024 {language === 'en' ? 'Visa Application System. All rights reserved.' : '簽證申請系統。版權所有。'}</p>
      </footer>
    </div>
  );
}
