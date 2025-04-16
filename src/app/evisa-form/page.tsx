"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { COUNTRIES } from '@/constants/countries';

export default function EVisaForm() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  interface FormData {
    nationality: string;
    fullName: string;
    passportNumber: string;
    dateOfBirth: string;
  }

  // Thêm interface cho API response
  interface ApiResponse {
    success: boolean;
    message: string;
    data?: {
      id: number;
      nationality: string;
      full_name: string;
      passport_number: string;
      date_of_birth: string;
      image_urls: string[];
    };
  }

  const [formData, setFormData] = useState<FormData>({
    nationality: '',
    fullName: '',
    passportNumber: '',
    dateOfBirth: '',
  });

  // State cho searchable dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Error state
  interface FormErrors {
    nationality?: string;
    fullName?: string;
    passportNumber?: string;
    dateOfBirth?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});

  // State để lưu trữ kết quả hình ảnh
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [resultError, setResultError] = useState<string | null>(null);

  // State for selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Lọc danh sách quốc gia
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý click ngoài dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCountrySelect = (code: string, name: string) => {
    setFormData({
      ...formData,
      nationality: code
    });
    setSelectedCountry(name);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.nationality.trim()) newErrors.nationality = language === 'en' ? 'Nationality is required' : '國籍為必填項';
    if (!formData.fullName.trim()) newErrors.fullName = language === 'en' ? 'Full Name is required' : '姓名為必填項';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = language === 'en' ? 'Passport number is required' : '護照號碼為必填項';
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = language === 'en' ? 'Date of birth is required' : '出生日期為必填項';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setResultError(null);
        setResultImages([]);
        
        console.log('GET request params:', formData);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');
        const apiUrl = `${baseUrl}/evisa?nationality=${formData.nationality}&fullName=${encodeURIComponent(formData.fullName)}&passportNumber=${encodeURIComponent(formData.passportNumber)}&dateOfBirth=${formData.dateOfBirth}`;
        console.log('Sending request to worker:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });

        console.log('Worker response status:', response.status);
        const responseData = await response.json() as ApiResponse;
        console.log('Worker response data:', responseData);

        if (response.ok && responseData.success && responseData.data?.image_urls) {
          // Use the URLs directly from the response
          const imageUrls = responseData.data.image_urls;
          console.log('Image URLs from response:', imageUrls);
          setResultImages(imageUrls);
          setResultError(null);
        } else {
          console.log('No images found or error in response:', responseData);
          setResultError(language === 'en' 
            ? responseData.message || 'No visa information found.' 
            : responseData.message || '未找到簽證信息。');
          setResultImages([]);
        }
      } catch (error) {
        console.error('Error checking eVisa:', error);
        setResultError(language === 'en' 
          ? 'An error occurred while checking your visa. Please try again.' 
          : '檢查簽證時發生錯誤，請重試。');
        setResultImages([]);
      }
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white py-12 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-1 rounded-md mr-2 ${language === 'en' ? 'bg-white text-[#1e3a8a]' : 'bg-transparent text-white border border-white'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-4 py-1 rounded-md ${language === 'zh' ? 'bg-white text-[#1e3a8a]' : 'bg-transparent text-white border border-white'}`}
            >
              中文
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? 'Check eVisa Status' : '查詢eVisa狀態'}
          </h1>
          <p className="text-lg">
            {language === 'en' 
              ? 'Please enter your information to check your eVisa status'
              : '請輸入您的資料以查詢eVisa狀態'}
          </p>
        </div>
      </header>

      {/* Logo */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4 flex justify-center">
          <Image
            src="/logo-new.jpg"
            alt="Bureau of Consular Affairs logo"
            width={500}
            height={100}
            className="h-auto"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8 bg-gray-100">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="bg-white rounded-lg shadow-md p-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nationality - Searchable Dropdown */}
              <div className="bg-[#98eb95] p-4 rounded">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-500">*</span> {language === 'en' ? 'Nationality' : '國籍'} <span className="text-red-500">({language === 'en' ? 'Required' : '必填'})</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="w-full p-2 border border-gray-300 rounded bg-white flex justify-between items-center cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedCountry || (language === 'en' ? '--Please Select--' : '--請選擇--')}
                    </div>
                    <div className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {showDropdown && (
                    <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-10">
                      <div className="sticky top-0 bg-white p-2 border-b">
                        <input
                          type="text"
                          placeholder={language === 'en' ? "Search countries..." : "搜尋國家..."}
                          className="w-full p-2 border border-gray-300 rounded"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        {filteredCountries.length === 0 ? (
                          <div className="p-2 text-gray-500">{language === 'en' ? 'No results found' : '未找到結果'}</div>
                        ) : (
                          filteredCountries.map((country) => (
                            <div
                              key={country.code}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCountrySelect(country.code, country.name)}
                            >
                              {country.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
              </div>

              {/* Full Name */}
              <div className="bg-[#98eb95] p-4 rounded">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-500">*</span> {language === 'en' ? 'Full Name' : '姓名'} <span className="text-red-500">({language === 'en' ? 'Required' : '必填'})</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Passport Number */}
              <div className="bg-[#98eb95] p-4 rounded">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-500">*</span> {language === 'en' ? 'Passport No.' : '護照號碼'} <span className="text-red-500">({language === 'en' ? 'Required' : '必填'})</span>
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
              </div>

              {/* Date of Birth */}
              <div className="bg-[#98eb95] p-4 rounded">
                <label className="block text-sm font-medium mb-2">
                  <span className="text-red-500">*</span> {language === 'en' ? 'Date of Birth' : '出生日期'} <span className="text-red-500">({language === 'en' ? 'Required' : '必填'})</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">(MM/DD/YYYY)</p>
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  className="bg-[#0d6efd] hover:bg-blue-700 text-white font-medium py-2 px-8 rounded"
                >
                  {language === 'en' ? 'Check Visa Status' : '查詢簽證狀態'}
                </Button>
              </div>
            </form>

            {/* Kết quả */}
            {resultImages && resultImages.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">
                  {language === 'en' ? 'Visa Information Found' : '找到簽證信息'}
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-700">
                    {language === 'en' 
                      ? 'Your visa information has been verified successfully.' 
                      : '您的簽證信息已成功驗證。'}
                  </p>
                  <p className="text-sm mt-2">Found {resultImages.length} image(s)</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {resultImages.map((imageUrl, index) => {
                    console.log(`Rendering image ${index}:`, imageUrl);
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <img
                          src={imageUrl}
                          alt={`Visa Image ${index + 1}`}
                          className="w-full h-auto max-h-[500px] object-contain mx-auto cursor-pointer"
                          onClick={() => handleImageClick(imageUrl)}
                          onError={(e) => {
                            console.error(`Error loading image ${index}:`, imageUrl);
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.style.display = 'none';
                            imgElement.parentElement?.classList.add('hidden');
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {resultError && (
              <div className="mt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{resultError}</p>
                  <p className="text-red-600 mt-2 text-sm">
                    {language === 'en'
                      ? 'Please check your information and try again.'
                      : '請檢查您的信息並重試。'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Selected Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={closeModal}>
          <img
            src={selectedImage}
            alt="Selected Visa"
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={closeModal}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
}