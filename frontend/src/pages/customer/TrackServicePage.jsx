import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import WorkflowProgress from '../../components/common/WorkflowProgress';
import StatusBadge from '../../components/common/StatusBadge';
import { Activity, Car, Wrench, User, Clock, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TrackServicePage() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(location.state?.bookingId || '');
  const [activeRequest, setActiveRequest] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerBookings();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadRequestDetails(selectedId);
    }
  }, [selectedId]);

  const loadCustomerBookings = async () => {
    try {
      const res = await api.get('/service-requests');
      setBookings(res.data);
      if (res.data.length > 0 && !selectedId) {
        setSelectedId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRequestDetails = async (id) => {
    try {
      const [reqRes, updatesRes] = await Promise.all([
        api.get(`/service-requests/${id}`),
        api.get(`/service-requests/${id}/updates`),
      ]);
      setActiveRequest(reqRes.data);
      setUpdates(updatesRes.data);
    } catch (err) {
      console.error('Failed to load tracking details', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Real-Time Service Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live telemetry and stage verification of your vehicle during workshop maintenance.
          </p>
        </div>

        {/* Dropdown for selecting which booking to track */}
        {bookings.length > 0 && (
          <div className="w-full sm:w-72">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bookingReference} • {b.vehicle?.model} ({b.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeRequest ? (
        <div className="space-y-6">
          {/* Main Status & Workflow Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden glow-cyan">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                    {activeRequest.bookingReference}
                  </span>
                  <StatusBadge status={activeRequest.status} />
                </div>
                <h2 className="text-xl font-black text-white mt-2">
                  {activeRequest.vehicle?.manufacturer} {activeRequest.vehicle?.model}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="font-mono text-slate-300 font-bold">{activeRequest.vehicle?.registrationNumber}</span>
                  <span>• Category: <strong className="text-white">{activeRequest.serviceCategory}</strong></span>
                  <span>• Scheduled: <strong className="text-white">{activeRequest.preferredDate}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Estimated Service Total</span>
                <span className="text-lg font-mono font-black text-cyan-400">₹{activeRequest.estimatedCost?.toFixed(2)}</span>
              </div>
            </div>

            {/* Workflow Progress Tracker */}
            <div className="py-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Milestone Workflow Progression:
              </span>
              <WorkflowProgress currentStatus={activeRequest.status} />
            </div>

            {/* Problem Description & Admin Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Reported Issue Symptoms</span>
                <p className="text-slate-300 italic">{activeRequest.problemDescription}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Workshop Manager Notes</span>
                <p className="text-slate-300">{activeRequest.adminNotes || 'Service order logged into dispatch system.'}</p>
              </div>
            </div>
          </div>

          {/* Assigned Technician Profile */}
          {activeRequest.mechanic ? (
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Lead Mechanic Assigned</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{activeRequest.mechanic.user?.fullName}</h4>
                  <p className="text-slate-400 text-[11px]">{activeRequest.mechanic.specialization} • {activeRequest.mechanic.experienceYears} Years Exp</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Technician Rating</span>
                <span className="font-bold text-amber-400 text-sm">⭐ {activeRequest.mechanic.rating} / 5.0</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl glass-panel text-xs text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Awaiting mechanic bay assignment by the workshop manager.</span>
            </div>
          )}

          {/* Real-time Work Updates Log */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Technician Log & Repair Timeline</span>
            </h3>

            {updates.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No technician updates recorded yet for this order.</p>
            ) : (
              <div className="space-y-4">
                {updates.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs border-l-2 border-cyan-500/40 pl-4 py-1 relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute -left-[5.5px] top-1.5 ring-4 ring-slate-950" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">{u.status}</span>
                        <span className="text-[10px] text-slate-500">{new Date(u.updatedAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300">{u.notes}</p>
                      {u.partsReplaced && (
                        <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block">
                          Replaced Spares: {u.partsReplaced}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          Select a booking to view its live service progress.
        </div>
      )}
    </div>
  );
}
