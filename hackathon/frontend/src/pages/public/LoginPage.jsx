import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wrench, Lock, Mail, ArrowRight, ShieldCheck, User, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.role === 'ROLE_MECHANIC') {
        navigate('/mechanic/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.error);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/25 mb-3">
            <Wrench className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your AutoCare Pro portal</p>
        </div>

        {/* Login Form Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@autocare.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 hover:brightness-110 transition disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* 1-Click Demo Logins for Hackathon Evaluators */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block text-center mb-2.5">
              🚀 1-Click Evaluator Quick Fill
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@autocare.com', 'admin123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center transition group"
              >
                <span className="text-[11px] font-bold text-purple-400 block group-hover:text-purple-300">Admin</span>
                <span className="text-[9px] text-slate-500">Workshop Mgr</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('ramesh@autocare.com', 'mechanic123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center transition group"
              >
                <span className="text-[11px] font-bold text-amber-400 block group-hover:text-amber-300">Mechanic</span>
                <span className="text-[9px] text-slate-500">Sr. Technician</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('sainath@example.com', 'customer123')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center transition group"
              >
                <span className="text-[11px] font-bold text-cyan-400 block group-hover:text-cyan-300">Customer</span>
                <span className="text-[9px] text-slate-500">Vehicle Owner</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
