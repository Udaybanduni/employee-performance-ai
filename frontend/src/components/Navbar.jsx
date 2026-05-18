import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null; // Don't show navbar on login/signup pages

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-400">
          <Activity className="h-6 w-6" />
          <span>TalentPulse AI</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 transition-colors hover:text-white">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/employees/new" className="flex items-center gap-2 text-gray-300 transition-colors hover:text-white">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </Link>
          
          <div className="h-6 w-px bg-gray-700"></div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
