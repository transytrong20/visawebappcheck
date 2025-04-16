"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function AdminPage() {
  const [visaRecords, setVisaRecords] = useState<VisaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
            <h1 className="text-2xl font-semibold text-gray-900">Visa Records Administration</h1>
            
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