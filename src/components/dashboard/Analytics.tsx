import React from 'react';
import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react';

function Analytics() {
  const metrics = [
    {
      title: 'Revenue Growth',
      value: '+28%',
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      change: 'up',
    },
    {
      title: 'Active Users',
      value: '2,420',
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: 'up',
    },
    {
      title: 'Monthly Revenue',
      value: '$12,500',
      icon: <DollarSign className="h-6 w-6 text-yellow-500" />,
      change: 'up',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      change: 'down',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              {metric.icon}
              <span className={`text-sm ${
                metric.change === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.change === 'up' ? '↑' : '↓'}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-400">
              {metric.title}
            </h3>
            <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Growth Trajectory</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart visualization coming soon</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">User Engagement</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;