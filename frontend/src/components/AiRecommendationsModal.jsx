import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const AiRecommendationsModal = ({ isOpen, onClose, employee }) => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && employee) {
      fetchRecommendation();
    } else {
      setRecommendation('');
      setError('');
    }
  }, [isOpen, employee]);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/recommend', { employeeId: employee._id });
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch AI insights. Check API keys.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-6 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2 text-purple-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Insights</h2>
              <p className="text-sm text-gray-400">for {employee?.name} ({employee?.department})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              <p className="mt-4 text-sm text-gray-400 animate-pulse">Analyzing employee data and generating insights...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-red-500/10 p-4 text-red-400">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Error Generating Insights</h3>
              <p className="text-sm text-gray-400 max-w-md">{error}</p>
            </div>
          ) : recommendation ? (
            <div className="prose prose-invert max-w-none text-gray-300">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                {recommendation}
              </pre>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 bg-gray-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="rounded-xl bg-gray-800 px-6 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiRecommendationsModal;
