import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import { ClipboardList, Calendar, Car, ArrowRight, Eye, FileText, Search } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get('/service-requests');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch =
      b.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceCategory?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.model?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-cyan-400" />
            <span>Service Bookings History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete log of your booked workshop maintenance orders and real-time repair stages.
          </p>
        </div>

        <Link
          to="/book-service"
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
        >
          + New Service Booking
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'BOOKED', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 text-xs">
            No service bookings match the selected criteria.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                    {b.bookingReference}
                  </span>
                  <StatusBadge status={b.status} />
                  <span className="text-[11px] text-slate-500">• {b.preferredDate}</span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {b.vehicle?.manufacturer} {b.vehicle?.model} ({b.vehicle?.registrationNumber})
                </h3>

                <p className="text-xs text-slate-300 font-medium">{b.serviceCategory}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1 italic max-w-xl">
                  "{b.problemDescription}"
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="text-right mr-2">
                  <span className="text-[10px] text-slate-500 block uppercase">Est. Cost</span>
                  <span className="font-mono font-bold text-sm text-slate-200">₹{b.estimatedCost?.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate('/track-service', { state: { bookingId: b.id } })}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Track Status</span>
                </button>

                {(b.status === 'COMPLETED' || b.status === 'DELIVERED') && (
                  <button
                    onClick={() => navigate('/invoices')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition"
                    title="View Tax Invoice"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
