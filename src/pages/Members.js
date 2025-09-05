import React, { useState, useCallback } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  PhoneIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline';
import { Badge } from '../components/ui/badge';
import { STATUS } from '../constants';
import { getInitials } from '../utils/helpers';

const Members = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      first_name: 'Rajesh',
      last_name: 'Kumar',
      email: 'rajesh@example.com',
      phone: '+91 9876543210',
      address: 'Village Rampur, District Meerut',
      status: STATUS.ACTIVE,
      owns: 'Cow',
      joinDate: '2024-01-15',
      totalCollections: 45,
      avgQuality: 8.5
    },
    {
      id: 2,
      first_name: 'Sunita',
      last_name: 'Devi',
      email: 'sunita@example.com',
      phone: '+91 9876543211',
      address: 'Village Kashipur, District Haridwar',
      status: STATUS.ACTIVE,
      owns: 'Buffalo',
      joinDate: '2024-02-10',
      totalCollections: 38,
      avgQuality: 9.2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    status: STATUS.ACTIVE,
    owns: 'Mixed'
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchTerm || 
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    const matchesStatus = !statusFilter || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = useCallback(() => {
    setEditingMember(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      status: STATUS.ACTIVE,
      owns: 'Mixed'
    });
    setShowModal(true);
  }, []);

  const handleEditMember = useCallback((member) => {
    setEditingMember(member);
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      status: member.status,
      owns: member.owns
    });
    setShowModal(true);
  }, []);

  const handleDeleteMember = useCallback((memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (editingMember) {
      setMembers(prev => prev.map(member =>
        member.id === editingMember.id ? { ...member, ...formData } : member
      ));
    } else {
      const newMember = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        totalCollections: 0,
        avgQuality: 0
      };
      setMembers(prev => [...prev, newMember]);
    }
    
    setShowModal(false);
  }, [editingMember, formData]);

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Members Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your dairy cooperative members
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button onClick={handleAddMember} className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search members by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select 
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value={STATUS.ACTIVE}>{STATUS.ACTIVE}</option>
              <option value={STATUS.INACTIVE}>{STATUS.INACTIVE}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-lg">
                      {getInitials(`${member.first_name} ${member.last_name}`)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{`${member.first_name} ${member.last_name}`}</h3>
                    <p className="text-sm text-gray-500">DM{String(member.id).padStart(3, '0')}</p>
                  </div>
                </div>
                <Badge variant={member.status === STATUS.ACTIVE ? 'success' : 'secondary'}>
                  {member.status}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {member.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <LocationMarkerIcon className="h-4 w-4 mr-2" />
                  {member.address}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Collections:</span> {member.totalCollections}
                </div>
                <div>
                  <span className="font-medium">Avg Quality:</span> {member.avgQuality}/10
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Joined: {new Date(member.joinDate).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMember(member)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="input-field"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="input-field"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    className="input-field"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    className="input-field"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value={STATUS.ACTIVE}>{STATUS.ACTIVE}</option>
                    <option value={STATUS.INACTIVE}>{STATUS.INACTIVE}</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingMember ? 'Update' : 'Add'} Member
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

export default Members;
