import React from 'react';

const statusConfig = {
  BOOKED: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400', label: 'Booked' },
  APPROVED: { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400', label: 'Approved' },
  ASSIGNED: { bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', dot: 'bg-indigo-400', label: 'Assigned' },
  IN_PROGRESS: { bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 animate-pulse', dot: 'bg-cyan-400', label: 'In Progress' },
  COMPLETED: { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', label: 'Completed' },
  DELIVERED: { bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30', dot: 'bg-purple-400', label: 'Delivered' },
  REJECTED: { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', dot: 'bg-rose-400', label: 'Rejected' },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { bg: 'bg-slate-700/50 text-slate-300 border-slate-600', dot: 'bg-slate-400', label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
