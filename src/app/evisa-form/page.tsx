"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Danh sách quốc gia đầy đủ
const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, the Democratic Republic of the" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Cote D'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and Mcdonald Islands" },
  { code: "VA", name: "Holy See (Vatican City State)" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran, Islamic Republic of" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea, Democratic People's Republic of" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libyan Arab Jamahiriya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MK", name: "Macedonia, the Former Yugoslav Republic of" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia, Federated States of" },
  { code: "MD", name: "Moldova, Republic of" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "AN", name: "Netherlands Antilles" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestinian Territory, Occupied" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Reunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "SH", name: "Saint Helena" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "CS", name: "Serbia and Montenegro" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SZ", name: "Swaziland" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania, United Republic of" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "VG", name: "Virgin Islands, British" },
  { code: "VI", name: "Virgin Islands, U.S." },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
];

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
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);

  // Lọc danh sách quốc gia
  const filteredCountries = countries.filter(country =>
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
        // Gửi yêu cầu đến API endpoint của bạn để kiểm tra dữ liệu
        const response = await fetch('/api/check-evisa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nationality: formData.nationality,
            fullName: formData.fullName,
            passportNumber: formData.passportNumber,
            dateOfBirth: formData.dateOfBirth,
          }),
        });

        const data = await response.json();

        if (response.ok && data.imageUrl) {
          setResultImage(data.imageUrl);
          setResultError(null);
        } else {
          setResultError(language === 'en' ? 'No matching record found.' : '未找到匹配的記錄。');
          setResultImage(null);
        }
      } catch (error) {
        console.error('Error checking eVisa:', error);
        setResultError(language === 'en' ? 'An error occurred. Please try again.' : '發生錯誤，請重試。');
        setResultImage(null);
      }
    }
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
            {resultImage && (
              <div className="mt-6">
                <h2 className="text-lg font-bold">
                  {language === 'en' ? 'Visa Image' : '簽證圖片'}
                </h2>
                <Image
                  src={resultImage}
                  alt="Visa Image"
                  width={500}
                  height={300}
                  className="mt-2 rounded"
                />
              </div>
            )}
            {resultError && (
              <div className="mt-6 text-red-500">
                {resultError}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}