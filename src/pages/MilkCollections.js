import React, { useState } from 'react';
import {
  PlusIcon,
  CalendarIcon,
  SearchIcon,
  DownloadIcon,
  EyeIcon
} from '@heroicons/react/outline';
import { Badge } from '../components/ui/badge';

const MilkCollections = () => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      memberId: 1,
      memberName: 'Rajesh Kumar',
      membershipNumber: 'DM001',
      date: '2024-12-05',
      time: '06:30',
      quantity: 25.5,
      quality: 8.5,
      fat: 4.2,
      clr: 28,
      pricePerLiter: 30,
      totalAmount: 765,
      collectedBy: 'Admin'
    },
    {
      id: 2,
      memberId: 2,
      memberName: 'Sunita Devi',
      membershipNumber: 'DM002',
      date: '2024-12-05',
      time: '07:15',
      quantity: 18.0,
      quality: 9.2,
      fat: 4.5,
      clr: 30,
      pricePerLiter: 32,
      totalAmount: 576,
      collectedBy: 'Admin'
    },
    {
      id: 3,
      memberId: 3,
      memberName: 'Mohan Singh',
      membershipNumber: 'DM003',
      date: '2024-12-05',
      time: '07:45',
      quantity: 32.0,
      quality: 8.8,
      fat: 4.3,
      clr: 29,
      pricePerLiter: 31,
      totalAmount: 992,
      collectedBy: 'Admin'
    },
    {
      id: 4,
      memberId: 4,
      memberName: 'Priya Sharma',
      membershipNumber: 'DM004',
      date: '2024-12-04',
      time: '08:00',
      quantity: 22.0,
      quality: 9.0,
      fat: 4.4,
      clr: 31,
      pricePerLiter: 31.5,
      totalAmount: 693,
      collectedBy: 'Admin'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    membershipNumber: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    quantity: '',
    type: 'Cow',
    fat: '',
    snf: '',
    pricePerLiter: 30
  });

  // Mock member data - in real app, this would come from API
  const members = [
    { id: 1, name: 'Rajesh Kumar', membershipNumber: 'DM001' },
    { id: 2, name: 'Sunita Devi', membershipNumber: 'DM002' },
    { id: 3, name: 'Mohan Singh', membershipNumber: 'DM003' },
    { id: 4, name: 'Priya Sharma', membershipNumber: 'DM004' },
  ];

  const filteredCollections = collections.filter(collection =>
    collection.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(collection => 
    selectedDate ? collection.date === selectedDate : true
  );

  const handleAddCollection = () => {
    setFormData({
      memberId: '',
      memberName: '',
      membershipNumber: '',
      date: new Date().toISOString().split('T')[0],
      shift: 'Morning',
      quantity: '',
      type: 'Cow',
      fat: '',
      clr: '',
      pricePerLiter: 30
    });
    setShowModal(true);
  };

  const handleMemberSelect = (e) => {
    const selectedMember = members.find(member => member.id === parseInt(e.target.value));
    if (selectedMember) {
      setFormData({
        ...formData,
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        membershipNumber: selectedMember.membershipNumber
      });
    }
  };

  const calculateTotalAmount = (quantity, pricePerLiter) => {
    return (parseFloat(quantity || 0) * parseFloat(pricePerLiter || 0)).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCollection = {
      id: Date.now(),
      ...formData,
      quantity: parseFloat(formData.quantity),
      quality: parseFloat(formData.quality),
      fat: parseFloat(formData.fat),
      clr: parseFloat(formData.clr),
      pricePerLiter: parseFloat(formData.pricePerLiter),
      totalAmount: parseFloat(calculateTotalAmount(formData.quantity, formData.pricePerLiter)),
      collectedBy: 'Admin'
    };
    
    setCollections([newCollection, ...collections]);
    setShowModal(false);
  };

  const todayTotal = collections
    .filter(c => c.date === new Date().toISOString().split('T')[0])
    .reduce((sum, c) => sum + c.quantity, 0);

  const todayRevenue = collections
    .filter(c => c.date === new Date().toISOString().split('T')[0])
    .reduce((sum, c) => sum + c.totalAmount, 0);

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Milk Collections
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Record and manage daily milk collections
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
          <button className="btn-secondary">
            <DownloadIcon className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={handleAddCollection}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4" />
            New Collection
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">{todayTotal.toFixed(1)}L</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{todayRevenue.toFixed(0)}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by member name or ID..."
                className="input-field pl-10 w-full sm:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                className="input-field"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collections table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Member</th>
                <th className="table-header">Date & Shift</th>
                <th className="table-header">Quantity (L)</th>
                <th className="table-header">Type</th>
                <th className="table-header">Fat %</th>
                <th className="table-header">CLR</th>
                <th className="table-header">Rate/L</th>
                <th className="table-header">Total Amount</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCollections.map((collection) => (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {collection.memberName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {collection.membershipNumber}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(collection.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{collection.shift || 'Morning'}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <Badge variant="success">
                      {collection.quantity}L
                    </Badge>
                  </td>
                  <td className="table-cell">
                    <Badge variant="info">
                      {collection.type || 'Cow'}
                    </Badge>
                  </td>
                  <td className="table-cell text-sm text-gray-900">{collection.fat}%</td>
                  <td className="table-cell text-sm text-gray-900">{collection.clr}</td>
                  <td className="table-cell text-sm text-gray-900">₹{collection.pricePerLiter}</td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{collection.totalAmount}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Record New Milk Collection
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member
                    </label>
                    <select
                      className="input-field"
                      value={formData.memberId}
                      onChange={handleMemberSelect}
                      required
                    >
                      <option value="">Select Member</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.membershipNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shift
                    </label>
                    <select
                      className="input-field"
                      value={formData.shift}
                      onChange={(e) => setFormData({...formData, shift: e.target.value})}
                      required
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity (Liters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      className="input-field"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      required
                    >
                      <option value="Cow">Cow</option>
                      <option value="Buffalo">Buffalo</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fat %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={formData.fat}
                      onChange={(e) => setFormData({...formData, fat: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CLR
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="40"
                      className="input-field"
                      value={formData.clr}
                      onChange={(e) => setFormData({...formData, clr: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Liter (₹)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      value={formData.pricePerLiter}
                      onChange={(e) => setFormData({...formData, pricePerLiter: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{calculateTotalAmount(formData.quantity, formData.pricePerLiter)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Record Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilkCollections;
