import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wrench, LogOut, User, Shield, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">Admin</span>;
      case 'ROLE_MECHANIC':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">Mechanic</span>;
      default:
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">Customer</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                AutoCare<span className="text-cyan-400">Pro</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">2026</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-medium hidden sm:block">SMART SERVICE • BETTER PERFORMANCE</p>
          </div>
        </Link>

        {/* User / Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{user.fullName}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <span className="text-[11px] text-slate-400">{user.email}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/services"
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition"
              >
                Services
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
