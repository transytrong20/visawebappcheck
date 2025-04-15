import { useLanguage } from '@/contexts/LanguageContext';

export function Disclaimer() {
  const { language, t } = useLanguage();

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold" lang={language}>
        {t('disclaimer')}
      </h2>

      <div className="bg-[#e7f3eb] p-4 rounded-md mt-4">
        <div lang={language}>
          <p className="mb-4 text-[15px]">
            {t('disclaimer.system.access')}
          </p>
          <p className="mb-4 text-[15px]">
            {t('disclaimer.security')}
          </p>
          <p className="mb-4 text-[15px]">
            {t('disclaimer.accuracy')}
          </p>
          <p className="text-red-600 text-[15px] font-medium">
            {t('disclaimer.match.warning')}
          </p>
        </div>
      </div>
    </div>
  );
}
