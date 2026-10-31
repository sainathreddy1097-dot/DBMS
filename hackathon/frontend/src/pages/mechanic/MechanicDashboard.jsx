import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import { Wrench, CheckCircle2, Clock, Car, Star, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MechanicDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMechanicData();
  }, []);

  const loadMechanicData = async () => {
    try {
      const [pRes, jRes] = await Promise.all([
        api.get('/mechanics/me').catch(() => ({ data: null })),
        api.get('/service-requests'),
      ]);
      setProfile(pRes.data);
      setJobs(jRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter(j => j.status === 'ASSIGNED' || j.status === 'IN_PROGRESS');
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED' || j.status === 'DELIVERED');

  return (
    <div className="space-y-6">
      {/* Mechanic Welcome Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span>Certified Service Technician Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.fullName}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {profile?.specialization || 'Master Automotive Technician'} • {profile?.experienceYears || 5} Years Experience
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase">Quality Rating</span>
            <span className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{profile?.rating || '4.90'}</span>
            </span>
          </div>

          <Link
            to="/mechanic/jobs"
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition flex items-center gap-1.5"
          >
            <span>Open Work Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border-amber-500/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Bay Work Orders</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-black text-amber-400">{activeJobs.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Scheduled for inspection/repairs</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-emerald-500/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400">{completedJobs.length}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Quality cleared & delivered</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-cyan-500/30">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Bay Status</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300">{profile?.availabilityStatus || 'AVAILABLE'}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Ready to receive vehicle allocations</span>
        </div>
      </div>

      {/* Active Work Orders Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">My Active Work Orders</h2>
            <p className="text-xs text-slate-400">Assigned customer vehicles in current repair queue</p>
          </div>

          <Link to="/mechanic/jobs" className="text-xs font-bold text-amber-400 hover:underline">
            Manage All Jobs ({jobs.length})
          </Link>
        </div>

        {activeJobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">
            No active jobs in your queue right now. You are ready to accept new service requests.
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map((j) => (
              <div
                key={j.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/30 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-300">{j.bookingReference}</span>
                    <StatusBadge status={j.status} />
                    <span className="text-[11px] text-slate-500">• Preferred: {j.preferredDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {j.vehicle?.manufacturer} {j.vehicle?.model} ({j.vehicle?.registrationNumber})
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-0.5 max-w-lg">
                    Problem: "{j.problemDescription}"
                  </p>
                </div>

                <button
                  onClick={() => navigate('/mechanic/jobs', { state: { highlightId: j.id } })}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs transition self-end sm:self-center"
                >
                  Update Job & Spares
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
