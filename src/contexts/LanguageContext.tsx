"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    "online.visa.application.form": "Online Visa Application Form",
    "application.no": "Application No.:",

    // Important Announcement
    "important.announcement": "Important Announcement",
    "covid.regulations": "As per regulations of Taiwan Central Epidemic Command Center, non-R.O.C. nationals not enrolled in the NHI program should pay their medical expenses during their isolation period if they are diagnosed with COVID-19 in Taiwan. Please refer to the following",
    "official.press.release": "official press release link for more details",
    "note.for.applicants": "Note for ROC(Taiwan) visa applicants who have resided in or visited Afghanistan, Pakistan, Mozambique, the Democratic Republic of the Congo, French Guiana, or Guinea for four weeks or longer in the past year.",
    "who.recommendations": "In accordance with World Health Organization recommendations, applicants for ROC (Taiwan) visas must submit proof of having been administered the oral polio vaccine (OPV) or the inactivated polio vaccine (IPV) from four weeks to one year before applying if they have resided in or visited countries or regions at high risk for polio transmission—namely, Afghanistan, Pakistan, Mozambique, the Democratic Republic of the Congo, French Guiana, and Guinea for four weeks or longer within the past year.",
    "terms.agreement": "I have read and agreed to the above terms and conditions",
    "terms.error": "You must agree to the terms and conditions to continue with the application",

    // Disclaimer
    "disclaimer": "Disclaimer",
    "disclaimer.system.access": "You are about to access the visa application computer system of the Bureau of Consular Affairs, Ministry of Foreign Affairs, Republic of China (Taiwan). This system and related data are property of the ROC Government, and provided for reviewing visa applications by the Bureau of Consular Affairs and ROC overseas missions and for official use by the ROC Government.",
    "disclaimer.security": "This site adopts security maintenance technology to prevent unauthorized access to the personal information you provided. However, according to Article 28 and 29 of Personal Information Protection Act, if your personal information and rights are compensated caused by such reasons as natural disaster, incident or other force majeure, and the third party's illegal collection, the ROC Government will not be liable for the damages.",
    "disclaimer.accuracy": "All information provided by you or a third party designated by you must be accurate and true. Even if you are granted a visa or an eVisa, immigration officers at ports of entry in Taiwan have the right to deny entry without providing further explanation.",
    "disclaimer.match.warning": "Please notice that the information you fill in online, including Surname, Given Name, Date of Birth, Passport No., Nationality and Sex, must completely match the information on your travel document; otherwise, your eVisa will be invalid.",

    // Buttons
    "cancel.exit": "Cancel & Exit",
    "confirm.continue": "Confirm & Continue",
  },
  zh: {
    // Header
    "online.visa.application.form": "線上簽證申請表",
    "application.no": "申請編號：",

    // Important Announcement
    "important.announcement": "重要公告",
    "covid.regulations": "依據台灣中央流行疫情指揮中心規定，未加入健保之非本國籍人士若在台確診COVID-19，需自行負擔隔離期間之醫療費用。詳情請參閱",
    "official.press.release": "官方新聞稿連結",
    "note.for.applicants": "提醒前往或居住阿富汗、巴基斯坦、莫三比克、剛果民主共和國、法屬圭亞那或幾內亞等地區四週以上的中華民國（台灣）簽證申請人。",
    "who.recommendations": "根據世界衛生組織建議，申請人若於申請前一年內曾前往或居住小兒麻痺症高風險傳播國家或地區（即阿富汗、巴基斯坦、莫三比克、剛果民主共和國、法屬圭亞那或幾內亞）四週以上，必須提交在申請前四週至一年內接種口服小兒麻痺症疫苗（OPV）或滅活小兒麻痺症疫苗（IPV）之證明。",
    "terms.agreement": "我已閱讀並同意上述條款和條件",
    "terms.error": "您必須同意條款和條件才能繼續申請",

    // Disclaimer
    "disclaimer": "免責聲明",
    "disclaimer.system.access": "您即將使用中華民國（台灣）外交部領事事務局簽證申請電腦系統。本系統及相關資料為中華民國政府所有，供領事事務局及中華民國駐外館處審核簽證申請案件及政府公務使用。",
    "disclaimer.security": "本網站採用安全維護技術，以防止未經授權存取您提供的個人資料。但是，根據個人資料保護法第28條和第29條，如因天災、事故或其他不可抗力因素，以及第三方非法蒐集而導致您的個人資料及權益受損，中華民國政府不負賠償責任。",
    "disclaimer.accuracy": "您或您指定的第三方所提供的所有資料必須準確真實。即使您獲得簽證或電子簽證，台灣入境港口的移民官仍有權拒絕入境而無需提供進一步解釋。",
    "disclaimer.match.warning": "請注意，您在線上填寫的資料，包括姓氏、名字、出生日期、護照號碼、國籍和性別，必須與您的旅行證件完全相符；否則，您的電子簽證將無效。",

    // Buttons
    "cancel.exit": "取消並退出",
    "confirm.continue": "確認並繼續",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
