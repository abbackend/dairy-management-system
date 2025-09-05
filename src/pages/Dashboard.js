import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  CubeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/outline';

const Dashboard = () => {
  // Mock data - in a real app, this would come from an API
  const stats = [
    {
      name: 'Total Members',
      value: '156',
      change: '+4.75%',
      changeType: 'positive',
      icon: UsersIcon,
      href: '/members',
    },
    {
      name: 'Today\'s Collection',
      value: '2,450L',
      change: '+12.02%',
      changeType: 'positive',
      icon: CubeIcon,
      href: '/collections',
    },
    {
      name: 'Monthly Revenue',
      value: '₹45,230',
      change: '+8.12%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      href: '/reports',
    },
    {
      name: 'Average Quality',
      value: '8.5/10',
      change: '+2.02%',
      changeType: 'positive',
      icon: ChartBarIcon,
      href: '/reports',
    },
  ];

  const recentCollections = [
    { id: 1, member: 'Rajesh Kumar', quantity: '25L', quality: '8.5', time: '06:30 AM', amount: '₹750' },
    { id: 2, member: 'Sunita Devi', quantity: '18L', quality: '9.2', time: '07:15 AM', amount: '₹540' },
    { id: 3, member: 'Mohan Singh', quantity: '32L', quality: '8.8', time: '07:45 AM', amount: '₹960' },
    { id: 4, member: 'Priya Sharma', quantity: '22L', quality: '9.0', time: '08:00 AM', amount: '₹660' },
    { id: 5, member: 'Amit Patel', quantity: '28L', quality: '8.7', time: '08:30 AM', amount: '₹840' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your dairy today.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="btn-secondary mr-3">
            <CalendarIcon className="h-4 w-4" />
            Last 30 days
          </button>
          <Link to="/collections" className="btn-primary">
            New Collection
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.href} className="group">
              <div className="card p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                      <div className="flex items-center text-sm">
                        {stat.changeType === 'positive' ? (
                          <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingUpIcon className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                        )}
                        <span className={`${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Collections */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Collections</h3>
              <Link to="/collections" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {recentCollections.map((collection) => (
                <li key={collection.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {collection.member.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{collection.member}</p>
                        <p className="text-sm text-gray-500">{collection.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {collection.quantity}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {collection.quality}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{collection.amount}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/collections"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <CubeIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Record Milk Collection</p>
                  <p className="text-sm text-gray-500">Add new milk collection entry</p>
                </div>
              </Link>
              
              <Link
                to="/members"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <UsersIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Manage Members</p>
                  <p className="text-sm text-gray-500">Add or edit member information</p>
                </div>
              </Link>
              
              <Link
                to="/reports"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <ChartBarIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-500">{"Check analytics and generate reports"}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
