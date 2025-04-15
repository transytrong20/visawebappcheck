import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <div className="bg-[#f69b35] py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <h4 className="text-xl font-medium text-white">{t('online.visa.application.form')}</h4>
            <div className="flex items-center">
              <span className="text-white mr-3">{t('application.no')}</span>
              <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "zh")}>
                <SelectTrigger className="w-[90px] bg-white text-black">
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
}
