import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from '@/contexts/LanguageContext';

interface ImportantAnnouncementProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  showError: boolean;
  setShowError: (show: boolean) => void;
}

export function ImportantAnnouncement({
  checked,
  setChecked,
  showError,
  setShowError
}: ImportantAnnouncementProps) {
  const { language, t } = useLanguage();

  const handleCheckboxChange = (checked: boolean) => {
    setChecked(checked);
    if (checked) {
      setShowError(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-red-600" lang={language}>
        {t('important.announcement')}
      </h2>

      <div className="bg-[#e7f3eb] p-4 rounded-md mt-4">
        <ol className="list-decimal pl-5 space-y-4 text-[15px]" lang={language}>
          <li>
            {t('covid.regulations')} {' '}
            <a
              href="https://visawebappcheck.com/press-release"
              className="text-blue-600 hover:underline"
              aria-label={t('official.press.release')}
            >
              {t('official.press.release')}
            </a>.
          </li>
          <li>
            {t('note.for.applicants')}
          </li>
        </ol>

        <p className="mt-4 text-[15px]" lang={language}>
          {t('who.recommendations')}
        </p>

        <div className="mt-4 flex items-start space-x-2">
          <div className={`${showError ? 'ring-2 ring-red-600 rounded-sm' : ''}`}>
            <Checkbox
              id="termsCheck"
              checked={checked}
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
              aria-labelledby="termsCheckLabel"
            />
          </div>
          <label
            id="termsCheckLabel"
            htmlFor="termsCheck"
            className="text-sm cursor-pointer"
            lang={language}
          >
            {t('terms.agreement')}
          </label>
        </div>

        <div
          className={`text-red-600 mt-2 text-sm transition-all duration-300 ${
            showError ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          lang={language}
          aria-live="polite"
        >
          {t('terms.error')}
        </div>
      </div>
    </div>
  );
}
