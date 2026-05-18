import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Filter, TrendingUp, Award, Zap, Edit2, Check, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AiRecommendationsModal from '../components/AiRecommendationsModal';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ department: '', skills: '', performance_min: '' });
  
  // Dynamic Score Edit State
  const [editingId, setEditingId] = useState(null);
  const [editScore, setEditScore] = useState('');

  // AI Modal State
  const [selectedEmployeeForAi, setSelectedEmployeeForAi] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/employees/search?${queryString}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter out empty params
    const activeParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v.trim() !== '')
    );
    fetchEmployees(activeParams);
  };

  const handleClearSearch = () => {
    setSearchParams({ department: '', skills: '', performance_min: '' });
    fetchEmployees();
  };

  const handleScoreUpdate = async (id) => {
    try {
      const res = await api.put(`/employees/${id}`, { performanceScore: Number(editScore) });
      // Dynamically update UI
      setEmployees(employees.map(emp => 
        emp._id === id ? { ...emp, performanceScore: res.data.employee.performanceScore } : emp
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  const openAiRecommendation = (employee) => {
    setSelectedEmployeeForAi(employee);
    setIsAiModalOpen(true);
  };

  // Derive Analytics Data
  const totalEmployees = employees.length;
  const avgScore = totalEmployees > 0 
    ? Math.round(employees.reduce((acc, curr) => acc + curr.performanceScore, 0) / totalEmployees) 
    : 0;
  
  // Sort for Rankings
  const rankedEmployees = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Analytics Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass-panel flex items-center gap-4 rounded-2xl p-6">
          <div className="rounded-full bg-blue-500/20 p-4 text-blue-400">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Average Performance</p>
            <h3 className="text-3xl font-bold text-white">{avgScore}/100</h3>
          </div>
        </div>
        
        <div className="glass-panel flex items-center gap-4 rounded-2xl p-6">
          <div className="rounded-full bg-emerald-500/20 p-4 text-emerald-400">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Top Performer</p>
            <h3 className="text-xl font-bold text-white truncate max-w-[150px]">
              {rankedEmployees.length > 0 ? rankedEmployees[0].name : 'N/A'}
            </h3>
            <p className="text-sm text-emerald-400">
              {rankedEmployees.length > 0 ? `${rankedEmployees[0].performanceScore} Score` : ''}
            </p>
          </div>
        </div>
        
        <div className="glass-panel flex items-center gap-4 rounded-2xl p-6">
          <div className="rounded-full bg-purple-500/20 p-4 text-purple-400">
            <Zap className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Employees</p>
            <h3 className="text-3xl font-bold text-white">{totalEmployees}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 glass-panel rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Filter className="h-5 w-5" /> Search & Filter
        </h2>
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-sm text-gray-400">Department</label>
            <input
              type="text"
              value={searchParams.department}
              onChange={(e) => setSearchParams({...searchParams, department: e.target.value})}
              placeholder="e.g. Engineering"
              className="glass-input block w-full rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-sm text-gray-400">Skills (comma separated)</label>
            <input
              type="text"
              value={searchParams.skills}
              onChange={(e) => setSearchParams({...searchParams, skills: e.target.value})}
              placeholder="e.g. React, Node"
              className="glass-input block w-full rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-[150px]">
            <label className="mb-1 block text-sm text-gray-400">Min Score</label>
            <input
              type="number"
              value={searchParams.performance_min}
              onChange={(e) => setSearchParams({...searchParams, performance_min: e.target.value})}
              placeholder="0-100"
              className="glass-input block w-full rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              <Search className="h-4 w-4" /> Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex items-center gap-2 rounded-xl bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Rankings / Employee List */}
      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white">Employee Performance Rankings</h2>
          <Link
            to="/employees/new"
            className="rounded-lg bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-600/30"
          >
            + Add New
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-800/50 text-xs uppercase text-gray-300">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Skills</th>
                <th className="px-6 py-4">Performance Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  </td>
                </tr>
              ) : rankedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No employees found matching criteria.
                  </td>
                </tr>
              ) : (
                rankedEmployees.map((emp, index) => (
                  <tr key={emp._id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30">
                    <td className="px-6 py-4 font-medium text-white">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{emp.name}</div>
                      <div className="text-xs text-gray-500">{emp.email} • {emp.yearsOfExperience} yrs exp</div>
                    </td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="rounded-md bg-gray-800 px-2 py-0.5 text-xs">
                            {skill}
                          </span>
                        ))}
                        {emp.skills.length > 3 && (
                          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs">+{emp.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === emp._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editScore}
                            onChange={(e) => setEditScore(e.target.value)}
                            className="glass-input w-20 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          />
                          <button onClick={() => handleScoreUpdate(emp._id)} className="text-green-400 hover:text-green-300">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${emp.performanceScore >= 80 ? 'bg-emerald-500' : emp.performanceScore >= 60 ? 'bg-blue-500' : 'bg-warning'}`}
                              style={{ width: `${emp.performanceScore}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-white w-8">{emp.performanceScore}</span>
                          <button 
                            onClick={() => { setEditingId(emp._id); setEditScore(emp.performanceScore); }}
                            className="text-gray-500 hover:text-blue-400 ml-1"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openAiRecommendation(emp)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:from-purple-500 hover:to-blue-500"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI Insights
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AiRecommendationsModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        employee={selectedEmployeeForAi} 
      />
    </div>
  );
};

export default Dashboard;
