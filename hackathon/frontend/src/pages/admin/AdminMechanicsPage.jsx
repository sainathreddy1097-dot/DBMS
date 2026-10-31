import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Wrench, Star, Briefcase, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminMechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      const res = await api.get('/mechanics');
      setMechanics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'BUSY' : currentStatus === 'BUSY' ? 'ON_LEAVE' : 'AVAILABLE';
    try {
      await api.put(`/mechanics/${id}/availability`, { status: nextStatus });
      loadMechanics();
    } catch (err) {
      alert('Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wrench className="w-6 h-6 text-cyan-400" />
          <span>Mechanic Roster & Specializations</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor technician workloads, review customer quality ratings, and manage workshop bay availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((m) => {
          const isAvail = m.availabilityStatus === 'AVAILABLE';
          const isBusy = m.availabilityStatus === 'BUSY';

          return (
            <div key={m.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isAvail
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isBusy
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {m.availabilityStatus}
                  </span>

                  <button
                    onClick={() => toggleStatus(m.id, m.availabilityStatus)}
                    className="text-[10px] text-cyan-400 hover:underline font-semibold"
                  >
                    Cycle Status
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white">{m.user?.fullName}</h3>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">{m.specialization}</p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Experience: <strong className="text-white">{m.experienceYears} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Rating: <strong className="text-amber-300 font-bold">{m.rating} / 5.0</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{m.user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{m.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Active Bay Orders</span>
                  <span className="text-lg font-mono font-black text-cyan-400">{m.activeJobsCount} Jobs</span>
                </div>

                <div className="text-[11px] text-slate-400 text-right">
                  <span className="block font-semibold text-slate-200">ID #{m.id}</span>
                  <span>Workshop Tech</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
