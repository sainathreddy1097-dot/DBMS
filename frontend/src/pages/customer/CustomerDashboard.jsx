import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import WorkflowProgress from '../../components/common/WorkflowProgress';
import { Car, CalendarPlus, ClipboardList, Sparkles, FileText, ArrowRight, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(false);
      const [vRes, bRes, rRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/service-requests'),
        api.get('/recommendations/my-vehicles').catch(() => ({ data: {} })),
      ]);
      setVehicles(vRes.data);
      setBookings(bRes.data);

      // Collect recommendations
      const recList = [];
      Object.keys(rRes.data || {}).forEach(k => {
        const item = rRes.data[k];
        if (item.recommendations) {
          item.recommendations.forEach(r => recList.push({ ...r, regNo: k }));
        }
      });
      setRecommendations(recList);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = bookings.find(b => b.status !== 'DELIVERED' && b.status !== 'REJECTED');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>AutoCare Pro Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hello, {user?.fullName}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Monitor your vehicle telemetry, review AI maintenance alerts, and track live repair progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/book-service"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition flex items-center gap-1.5"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Service</span>
            </Link>
            <Link
              to="/vehicles"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <Car className="w-4 h-4" />
              <span>Register Vehicle</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Service Tracker Card */}
      {activeBooking ? (
        <div className="rounded-2xl glass-panel p-6 border-cyan-500/30 glow-cyan">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Active Repair</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {activeBooking.bookingReference}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {activeBooking.vehicle?.manufacturer} {activeBooking.vehicle?.model} • {activeBooking.serviceCategory}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={activeBooking.status} />
              <Link
                to="/track-service"
                state={{ bookingId: activeBooking.id }}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <WorkflowProgress currentStatus={activeBooking.status} />

          {activeBooking.adminNotes && (
            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <span className="text-cyan-400 font-semibold">Workshop Update: </span>
              {activeBooking.adminNotes}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl glass-panel text-center">
          <p className="text-sm text-slate-400">All registered vehicles are currently in nominal operating condition.</p>
          <Link
            to="/book-service"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline mt-2"
          >
            <span>Schedule next preventative maintenance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* AI Recommendations Alert Bar */}
      {recommendations.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">AI Maintenance Predictor Alert</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {recommendations.length} Recommendations
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Predictive engine detected service milestones based on accumulated mileage and operational age.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommendations.slice(0, 3).map((r, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-200">
                      • {r.regNo}: <strong className="text-white">{r.title}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/recommendations"
              className="shrink-0 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              Review AI Insights
            </Link>
          </div>
        </div>
      )}

      {/* Vehicles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-cyan-400" />
            <span>My Garage ({vehicles.length})</span>
          </h2>
          <Link to="/vehicles" className="text-xs font-semibold text-cyan-400 hover:underline">
            Manage Vehicles
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="p-5 rounded-2xl glass-card relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-bold border border-slate-800">
                    {v.vehicleCategory}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {v.manufacturer} {v.model}
                  </h3>
                  <div className="text-xs font-mono font-semibold text-cyan-300">{v.registrationNumber}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {v.manufacturingYear}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800/80 mb-3 text-slate-400">
                <div>
                  <span className="text-[10px] block text-slate-500">Current Odometer</span>
                  <span className="font-mono font-semibold text-slate-200">{v.currentMileage?.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-[10px] block text-slate-500">Fuel System</span>
                  <span className="font-semibold text-slate-200">{v.fuelType}</span>
                </div>
              </div>

              <Link
                to="/book-service"
                state={{ preselectedVehicleId: v.id }}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-bold text-center block transition"
              >
                Book Routine Service
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
