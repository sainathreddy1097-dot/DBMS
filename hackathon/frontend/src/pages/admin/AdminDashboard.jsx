import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Users,
  Car,
  ClipboardList,
  Wrench,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  Boxes,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading live workshop analytics...</div>;
  }

  const kpis = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: ClipboardList, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Active Repairs', value: stats.activeRepairs, icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Pending Approval', value: stats.pendingServices, icon: Clock, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Completed Jobs', value: stats.completedServices, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Registered Fleet', value: stats.totalVehicles, icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Workshop Command Center</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Workshop Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time MySQL relational operational metrics across dispatch, technicians, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/service-requests"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
          >
            Manage Requests
          </Link>
          <Link
            to="/admin/invoices"
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Invoices & GST
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className={`text-xl font-mono font-black ${kpi.color}`}>{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Trend */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Monthly Revenue Inflow (₹)</h2>
              <p className="text-[11px] text-slate-400">Database-aggregated settlements</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Total: ₹{stats.totalRevenue?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Categories Distribution */}
        <div className="glass-panel rounded-2xl p-6">
          <div>
            <h2 className="text-sm font-bold text-white">Service Breakdown</h2>
            <p className="text-[11px] text-slate-400">Category request volume distribution</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.serviceCategories || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {(stats.serviceCategories || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Bookings Live Dispatch Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Work Orders</h2>
            <p className="text-[11px] text-slate-400">Latest active bookings in workshop queue</p>
          </div>
          <Link to="/admin/service-requests" className="text-xs font-bold text-cyan-400 hover:underline">
            View All ({stats.totalBookings})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats.recentBookings?.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{r.bookingReference}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{r.customerName}</td>
                  <td className="py-2.5 px-3 text-slate-300">{r.vehicle}</td>
                  <td className="py-2.5 px-3">{r.serviceCategory}</td>
                  <td className="py-2.5 px-3 text-slate-400">{r.preferredDate}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={r.status} /></td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">₹{r.estimatedCost?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
