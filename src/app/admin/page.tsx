"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Danh sách quốc gia
const COUNTRIES = [
  { code: 'VN', name: 'Vietnam' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'TH', name: 'Thailand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RU', name: 'Russia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'OM', name: 'Oman' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'IL', name: 'Israel' },
  { code: 'TR', name: 'Turkey' },
  { code: 'EG', name: 'Egypt' },
].sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên

interface VisaRecord {
  id: number;
  nationality: string;
  full_name: string;
  passport_number: string;
  date_of_birth: string;
  image_urls: string[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  records?: VisaRecord[];
}

interface CreateRecordResponse {
  success: boolean;
  message: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

export default function AdminPage() {
  const [visaRecords, setVisaRecords] = useState<VisaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nationality: '',
    full_name: '',
    passport_number: '',
    date_of_birth: '',
  });
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<keyof VisaRecord>('full_name');

  useEffect(() => {
    fetchVisaRecords();
  }, []);

  const fetchVisaRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/records');
      const data = await response.json() as ApiResponse;
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch records');
      }

      setVisaRecords(data.records || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImages(prev => [...prev, {
            file,
            preview: reader.result as string
          }]);
        };
        reader.readAsDataURL(file);
      });
      // Reset input value so the same file can be selected again
      e.target.value = '';
    }
  };

  // Remove image at specific index
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      setError('Please select at least one image');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('nationality', formData.nationality);
      form.append('fullName', formData.full_name);
      form.append('passportNumber', formData.passport_number);
      form.append('dateOfBirth', formData.date_of_birth);

      selectedImages.forEach(({file}) => {
        form.append('visaImages', file);
      });

      const response = await fetch('/api/admin/records', {
        method: 'POST',
        body: form,
      });

      const data = await response.json() as CreateRecordResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create record');
      }

      // Reset form and refresh records
      setFormData({
        nationality: '',
        full_name: '',
        passport_number: '',
        date_of_birth: '',
      });
      setSelectedImages([]);
      setShowForm(false);
      fetchVisaRecords();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter records based on search
  const filteredRecords = visaRecords.filter(record => {
    if (!searchTerm) return true;
    const value = String(record[searchField]).toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-600">Loading records...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error Loading Records</h2>
            <p>{error}</p>
            <button
              onClick={fetchVisaRecords}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Visa Records Administration</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showForm ? 'Cancel' : 'Add New Record'}
              </button>
            </div>

            {/* Add New Record Form */}
            {showForm && (
              <div className="mt-6 border rounded-lg p-4 bg-gray-50">
                <h2 className="text-lg font-medium mb-4">Add New Record</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nationality</label>
                      <select
                        required
                        value={formData.nationality}
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Select a country</option>
                        {COUNTRIES.map(country => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                      <input
                        type="text"
                        required
                        value={formData.passport_number}
                        onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Visa Images</label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      <span className="text-sm text-gray-500">
                        {selectedImages.length} images selected
                      </span>
                    </div>
                    
                    {selectedImages.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                  hover:bg-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedImages([]);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || selectedImages.length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search Controls */}
            <div className="mt-4 flex gap-4">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as keyof VisaRecord)}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="full_name">Full Name</option>
                <option value="nationality">Nationality</option>
                <option value="passport_number">Passport Number</option>
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          
          {visaRecords.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No records found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nationality
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Passport Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Images
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.nationality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.passport_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date_of_birth}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex flex-wrap gap-2">
                            {record.image_urls.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Visa ${index + 1}`}
                                className="w-20 h-20 object-cover rounded border border-gray-200"
                                onClick={() => window.open(url, '_blank')}
                                style={{ cursor: 'pointer' }}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{indexOfFirstRecord + 1}</span>
                      {' '}-{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastRecord, filteredRecords.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{filteredRecords.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: Math.ceil(filteredRecords.length / recordsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            ${currentPage === index + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }
                            ${index === 0 ? 'rounded-l-md' : ''}
                            ${index === Math.ceil(filteredRecords.length / recordsPerPage) - 1 ? 'rounded-r-md' : ''}
                          `}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 