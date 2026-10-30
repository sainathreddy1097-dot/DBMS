import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  CalendarPlus,
  ClipboardList,
  Sparkles,
  FileText,
  Users,
  Wrench,
  Boxes,
  Activity,
  CheckCircle,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/book-service', label: 'Book Servicing', icon: CalendarPlus },
    { to: '/bookings', label: 'My Bookings', icon: ClipboardList },
    { to: '/track-service', label: 'Track Service', icon: Activity },
    { to: '/recommendations', label: 'AI Health Predictor', icon: Sparkles, badge: 'AI' },
    { to: '/invoices', label: 'My Invoices', icon: FileText },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Analytics Hub', icon: LayoutDashboard },
    { to: '/admin/service-requests', label: 'Service Requests', icon: ClipboardList },
    { to: '/admin/mechanics', label: 'Mechanic Roster', icon: Wrench },
    { to: '/admin/inventory', label: 'Spare Parts Inventory', icon: Boxes },
    { to: '/admin/invoices', label: 'Revenue & Invoices', icon: FileText },
    { to: '/admin/customers', label: 'Customer Directory', icon: Users },
  ];

  const mechanicLinks = [
    { to: '/mechanic/dashboard', label: 'Tech Dashboard', icon: LayoutDashboard },
    { to: '/mechanic/jobs', label: 'Assigned Work Orders', icon: Wrench },
  ];

  const links =
    role === 'ROLE_ADMIN'
      ? adminLinks
      : role === 'ROLE_MECHANIC'
      ? mechanicLinks
      : customerLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block min-h-[calc(100vh-4rem)] glass-panel border-r border-slate-800/80 p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          {role === 'ROLE_ADMIN' ? 'Fleet Administration' : role === 'ROLE_MECHANIC' ? 'Workshop Terminal' : 'Customer Portal'}
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Quick Portal Info Card */}
      <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-navy-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>Workshop Live</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Spring Boot + MySQL JPA connected. Service status events update live.
        </p>
      </div>
    </aside>
  );
}
