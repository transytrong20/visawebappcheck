import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';

interface ActionButtonsProps {
  onCancel: () => void;
  onContinue: () => void;
  termsChecked: boolean;
  setShowTermsError: (show: boolean) => void;
}

export function ActionButtons({ onCancel, onContinue, termsChecked, setShowTermsError }: ActionButtonsProps) {
  const { language, t } = useLanguage();
  const termsCheckRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Tìm element checkbox để có thể scroll đến nó khi có lỗi
    termsCheckRef.current = document.getElementById('termsCheck');
  }, []);

  const handleContinue = () => {
    if (!termsChecked) {
      setShowTermsError(true);

      // Scroll đến vị trí checkbox khi có lỗi
      if (termsCheckRef.current) {
        setTimeout(() => {
          termsCheckRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
      return;
    }
    onContinue();
  };

  return (
    <div className="my-6 flex justify-center gap-4">
      <Button
        variant="secondary"
        onClick={onCancel}
        lang={language}
        className="px-5 py-2 text-base font-medium rounded-md hover:bg-gray-300 transition-colors"
      >
        {t('cancel.exit')}
      </Button>
      <Button
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 text-base font-medium rounded-md transition-colors"
        onClick={handleContinue}
        lang={language}
      >
        {t('confirm.continue')}
      </Button>
    </div>
  );
}
