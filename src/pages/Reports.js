import React, { useState } from 'react';
import {
  DownloadIcon,
  ChartBarIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/react/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState('7days');

  // Mock data for charts
  const dailyCollectionData = [
    { date: '2024-11-29', quantity: 2420, revenue: 75220, members: 145 },
    { date: '2024-11-30', quantity: 2380, revenue: 73780, members: 148 },
    { date: '2024-12-01', quantity: 2520, revenue: 78120, members: 150 },
    { date: '2024-12-02', quantity: 2350, revenue: 72850, members: 152 },
    { date: '2024-12-03', quantity: 2680, revenue: 83080, members: 154 },
    { date: '2024-12-04', quantity: 2450, revenue: 75950, members: 155 },
    { date: '2024-12-05', quantity: 2590, revenue: 80290, members: 156 },
  ];

  const memberPerformanceData = [
    { name: 'Rajesh Kumar', quantity: 245, revenue: 7350, avgQuality: 8.5 },
    { name: 'Mohan Singh', quantity: 302, revenue: 9060, avgQuality: 8.8 },
    { name: 'Sunita Devi', quantity: 198, revenue: 6336, avgQuality: 9.2 },
    { name: 'Priya Sharma', quantity: 156, revenue: 4914, avgQuality: 9.0 },
    { name: 'Amit Patel', quantity: 189, revenue: 5670, avgQuality: 8.7 },
  ];

  const qualityDistribution = [
    { quality: '8.0-8.5', count: 45, color: '#ef4444' },
    { quality: '8.5-9.0', count: 78, color: '#f59e0b' },
    { quality: '9.0-9.5', count: 92, color: '#10b981' },
    { quality: '9.5-10.0', count: 35, color: '#3b82f6' },
  ];

  const monthlyTrends = [
    { month: 'Jan', quantity: 68420, revenue: 2168640, quality: 8.6 },
    { month: 'Feb', quantity: 72350, revenue: 2355200, quality: 8.7 },
    { month: 'Mar', quantity: 75680, revenue: 2421760, quality: 8.8 },
    { month: 'Apr', quantity: 78920, revenue: 2525440, quality: 8.9 },
    { month: 'May', quantity: 82150, revenue: 2628800, quality: 8.8 },
    { month: 'Jun', quantity: 79850, revenue: 2554400, quality: 8.7 },
  ];

  const summaryStats = {
    totalMembers: 156,
    totalMembersChange: '+4.75%',
    totalCollection: '18,450L',
    totalCollectionChange: '+12.02%',
    totalRevenue: '₹5,72,350',
    totalRevenueChange: '+8.12%',
    avgQuality: '8.7/10',
    avgQualityChange: '+2.02%',
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reports & Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive insights into your dairy operations
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          <select 
            className="input-field"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="btn-primary">
            <DownloadIcon className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <div className="flex items-center text-sm">
                  <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{summaryStats.totalMembersChange}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalMembers}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Weekly Collection</p>
                <div className="flex items-center text-sm">
                  <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{summaryStats.totalCollectionChange}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalCollection}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
                <div className="flex items-center text-sm">
                  <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{summaryStats.totalRevenueChange}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Avg Quality</p>
                <div className="flex items-center text-sm">
                  <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{summaryStats.avgQualityChange}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.avgQuality}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Collection Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Collection Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyCollectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                className="text-sm"
              />
              <YAxis className="text-sm" />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value, name) => [
                  name === 'quantity' ? `${value}L` : `₹${value}`,
                  name === 'quantity' ? 'Quantity' : 'Revenue'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="quantity" 
                stroke="#0ea5e9" 
                fill="#0ea5e9" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ quality, count }) => `${quality}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {qualityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis yAxisId="left" className="text-sm" />
              <YAxis yAxisId="right" orientation="right" className="text-sm" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="quantity" fill="#0ea5e9" name="Quantity (L)" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="quality" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Avg Quality"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Members */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Members</h3>
          <div className="space-y-4">
            {memberPerformanceData.slice(0, 5).map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-medium text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">Quality: {member.avgQuality}/10</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{member.quantity}L</p>
                  <p className="text-xs text-gray-500">₹{member.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
