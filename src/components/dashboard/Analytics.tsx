import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Users, BrainCircuit, Save, PenLine } from 'lucide-react';

interface CompanyInfo {
  name: string;
  industry: string;
  stage: string;
  size: string;
  founded: string;
}

interface Generation {
  id: string;
  type: 'idea' | 'document' | 'code';
  title: string;
  timestamp: Date;
  category: string;
}

export default function Analytics() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    stage: '',
    size: '',
    founded: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>([]);

  // Sample data - In production, fetch from API
  const usageData = [
    { date: '2024-01', ideas: 12, documents: 8, code: 5 },
    { date: '2024-02', ideas: 15, documents: 10, code: 7 },
    { date: '2024-03', ideas: 20, documents: 12, code: 9 }
  ];

  const handleSaveCompanyInfo = () => {
    // In production, save to backend
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-xl font-semibold">Company Information</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <PenLine className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(companyInfo).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setCompanyInfo((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              ) : (
                <p className="text-lg">{value || 'Not specified'}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Usage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Generation Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ideas" stroke="#3b82f6" />
                <Line type="monotone" dataKey="documents" stroke="#8b5cf6" />
                <Line type="monotone" dataKey="code" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Generation Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ideas" fill="#3b82f6" />
                <Bar dataKey="documents" fill="#8b5cf6" />
                <Bar dataKey="code" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Generation History */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6">Generation History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {generations.map((gen) => (
                <tr key={gen.id} className="border-b border-gray-700/50">
                  <td className="py-3 px-4">
                    <span className="capitalize">{gen.type}</span>
                  </td>
                  <td className="py-3 px-4">{gen.title}</td>
                  <td className="py-3 px-4">{gen.category}</td>
                  <td className="py-3 px-4">
                    {gen.timestamp.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}