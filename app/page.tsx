'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'];

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any[]>>({});
  const [error, setError] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(RECORD_TYPES);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults({});

    try {
      const response = await fetch('/api/dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, types: selectedTypes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform DNS lookup');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecordType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">DNS Checker</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Enter a domain name to retrieve its DNS records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., example.com)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  Lookup
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {RECORD_TYPES.map((type) => (
              <Switch.Group key={type}>
                <div className="flex items-center">
                  <Switch
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleRecordType(type)}
                    className={`${
                      selectedTypes.includes(type) ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        selectedTypes.includes(type) ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-gray-900 dark:text-gray-100">{type}</Switch.Label>
                </div>
              </Switch.Group>
            ))}
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-md">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {Object.keys(results).length > 0 && (
          <div className="mt-8 space-y-6">
            {Object.entries(results).map(([type, records]) => (
              <div key={type} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{type} Records</h3>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {records.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide hover:scrollbar-default">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800 font-bold">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                              Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                              TTL
                            </th>
                            {type === 'MX' && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                Priority
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {records.map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                {record.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 break-all">
                                {record.value}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {record.ttl}
                              </td>
                              {type === 'MX' && (
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {record.priority}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No records found</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 