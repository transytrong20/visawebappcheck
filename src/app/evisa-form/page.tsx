"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';

export default function EVisaForm() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    surname: '',
    givenName: '',
    passportNumber: '',
    nationality: '',
    dateOfBirth: '',
    gender: 'male',
    email: '',
    phone: '',
    address: '',
    purposeOfVisit: 'tourism',
    durationOfStay: '30',
    plannedArrivalDate: '',
    plannedDepartureDate: '',
    agreeToTerms: false
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Generate application number
  const applicationNumber = "TW" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      agreeToTerms: checked
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.givenName.trim()) newErrors.givenName = 'Given name is required';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.plannedArrivalDate.trim()) newErrors.plannedArrivalDate = 'Planned arrival date is required';
    if (!formData.plannedDepartureDate.trim()) newErrors.plannedDepartureDate = 'Planned departure date is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically send the data to a server
      alert('Application submitted successfully!');
      // Navigate back to the home page or to a confirmation page
      router.push('/');
    }
  };

  const handleBack = () => {
    router.push('/evisa-info-new');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-[#f59a36] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-medium">{language === 'en' ? 'Online Visa Application Form' : '線上簽證申請表'}</h4>
            <div className="flex items-center">
              <span className="mr-3">{language === 'en' ? 'Application No.:' : '申請編號：'} {applicationNumber}</span>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
                  className="appearance-none bg-white text-[#2e4953] px-3 py-1 rounded-md pr-8"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#2e4953" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
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
        <h2 className="text-2xl font-bold mb-4 text-[#2e4953]">
          {language === 'en' ? 'eVisa Application Form' : '電子簽證申請表單'}
        </h2>

        <div className="bg-[#e7f3eb] p-4 rounded-md mb-6 border-l-4 border-[#2e4953]">
          <div className="mb-3">
            <p className="text-[#2e4953] font-medium">
              {language === 'en'
                ? 'Important Information'
                : '重要資訊'}
            </p>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            {language === 'en'
              ? 'This application is for an electronic visa (eVisa) to Taiwan. Please ensure all information provided is accurate and matches your passport details.'
              : '此申請表用於申請台灣電子簽證（eVisa）。請確保所提供的所有資訊準確無誤並與您的護照詳細資料一致。'}
          </p>
          <p className="text-sm text-[#aa565b] font-medium">
            {language === 'en'
              ? 'Please notice that the information you fill in online, including Surname, Given Name, Date of Birth, Passport No., Nationality and Sex, must completely match the information on your travel document; otherwise, your eVisa will be invalid.'
              : '請注意，您在線上填寫的資料，包括姓氏、名字、出生日期、護照號碼、國籍和性別，必須與您的旅行證件完全相符；否則，您的電子簽證將無效。'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 border border-gray-200 rounded-md shadow-sm">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#2e4953] border-b pb-2">
              {language === 'en' ? '1. Personal Information' : '1. 個人資料'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Surname / Family Name' : '姓氏'}*
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.surname ? 'border-[#aa565b]' : 'border-gray-300'}`}
                  placeholder={language === 'en' ? 'As shown in passport' : '護照上顯示的姓氏'}
                />
                {errors.surname && <p className="text-[#aa565b] text-xs mt-1">{errors.surname}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Given Name(s)' : '名字'}*
                </label>
                <input
                  type="text"
                  name="givenName"
                  value={formData.givenName}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.givenName ? 'border-[#aa565b]' : 'border-gray-300'}`}
                  placeholder={language === 'en' ? 'As shown in passport' : '護照上顯示的名字'}
                />
                {errors.givenName && <p className="text-[#aa565b] text-xs mt-1">{errors.givenName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Passport Number' : '護照號碼'}*
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.passportNumber ? 'border-[#aa565b]' : 'border-gray-300'}`}
                />
                {errors.passportNumber && <p className="text-[#aa565b] text-xs mt-1">{errors.passportNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Nationality' : '國籍'}*
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.nationality ? 'border-[#aa565b]' : 'border-gray-300'}`}
                />
                {errors.nationality && <p className="text-[#aa565b] text-xs mt-1">{errors.nationality}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Date of Birth' : '出生日期'}*
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.dateOfBirth ? 'border-[#aa565b]' : 'border-gray-300'}`}
                />
                {errors.dateOfBirth && <p className="text-[#aa565b] text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Gender' : '性別'}*
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="male">{language === 'en' ? 'Male' : '男'}</option>
                  <option value="female">{language === 'en' ? 'Female' : '女'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#2e4953] border-b pb-2">
              {language === 'en' ? '2. Contact Information' : '2. 聯絡資料'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Email Address' : '電子郵件'}*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-[#aa565b]' : 'border-gray-300'}`}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-[#aa565b] text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Phone Number' : '電話號碼'}*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.phone ? 'border-[#aa565b]' : 'border-gray-300'}`}
                  placeholder={language === 'en' ? 'Include country code' : '包括國家代碼'}
                />
                {errors.phone && <p className="text-[#aa565b] text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Current Residential Address' : '目前住址'}*
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full p-2 border rounded-md ${errors.address ? 'border-[#aa565b]' : 'border-gray-300'}`}
                  placeholder={language === 'en' ? 'Full address including postal/zip code' : '完整地址包括郵政編碼'}
                ></textarea>
                {errors.address && <p className="text-[#aa565b] text-xs mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Travel Information Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#2e4953] border-b pb-2">
              {language === 'en' ? '3. Travel Information' : '3. 旅行資料'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Purpose of Visit' : '訪問目的'}*
                </label>
                <select
                  name="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="tourism">{language === 'en' ? 'Tourism' : '觀光'}</option>
                  <option value="business">{language === 'en' ? 'Business' : '商務'}</option>
                  <option value="visiting_relatives">{language === 'en' ? 'Visiting Relatives' : '探親'}</option>
                  <option value="conference">{language === 'en' ? 'Conference' : '會議'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Duration of Stay (days)' : '停留期限（天）'}*
                </label>
                <select
                  name="durationOfStay"
                  value={formData.durationOfStay}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="7">7</option>
                  <option value="14">14</option>
                  <option value="21">21</option>
                  <option value="30">30</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Planned Arrival Date' : '計劃入境日期'}*
                </label>
                <input
                  type="date"
                  name="plannedArrivalDate"
                  value={formData.plannedArrivalDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.plannedArrivalDate ? 'border-[#aa565b]' : 'border-gray-300'}`}
                />
                {errors.plannedArrivalDate && <p className="text-[#aa565b] text-xs mt-1">{errors.plannedArrivalDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Planned Departure Date' : '計劃離境日期'}*
                </label>
                <input
                  type="date"
                  name="plannedDepartureDate"
                  value={formData.plannedDepartureDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.plannedDepartureDate ? 'border-[#aa565b]' : 'border-gray-300'}`}
                />
                {errors.plannedDepartureDate && <p className="text-[#aa565b] text-xs mt-1">{errors.plannedDepartureDate}</p>}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="pt-4">
            <div className="bg-[#e7f3eb] p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex h-5 items-center mt-1">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={handleCheckboxChange}
                    className={errors.agreeToTerms ? 'border-[#aa565b]' : ''}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                    {language === 'en'
                      ? 'I declare that the information provided above is true and correct. I understand that any false or misleading statements may result in the denial of my visa application.'
                      : '我聲明上述提供的信息真實無誤。我明白任何虛假或誤導性陳述可能導致我的簽證申請被拒絕。'}
                  </label>
                  {errors.agreeToTerms && <p className="text-[#aa565b] text-xs mt-1">{errors.agreeToTerms}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
            >
              {language === 'en' ? 'Cancel & Exit' : '取消並退出'}
            </Button>
            <Button
              type="submit"
              className="bg-[#2e4953] hover:bg-[#1d3741] text-white px-8 py-2"
            >
              {language === 'en' ? 'Confirm & Continue' : '確認並繼續'}
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 text-center text-gray-600 border-t mt-8">
        <p>© 2024 {language === 'en' ? 'Visa Application System. All rights reserved.' : '簽證申請系統。版權所有。'}</p>
      </footer>
    </div>
  );
}
