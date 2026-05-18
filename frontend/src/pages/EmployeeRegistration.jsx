import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus, Briefcase, Award, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '', // Will split by comma
    performanceScore: '',
    yearsOfExperience: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Process skills into array
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');
        
      const payload = {
        ...formData,
        skills: skillsArray,
        performanceScore: Number(formData.performanceScore),
        yearsOfExperience: Number(formData.yearsOfExperience)
      };
      
      await api.post('/employees', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
      
      <div className="glass-panel rounded-2xl p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-full bg-blue-500/20 p-3 text-blue-400">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Register New Employee</h1>
            <p className="text-sm text-gray-400">Add a new team member to the system</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> Department
            </label>
            <input
              type="text"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Engineering, Marketing"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="React, Node.js, Project Management"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Performance Score (0-100)
              </label>
              <input
                type="number"
                name="performanceScore"
                required
                min="0"
                max="100"
                value={formData.performanceScore}
                onChange={handleChange}
                className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="85"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                required
                min="0"
                step="0.5"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="glass-input block w-full rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="3.5"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Save Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
