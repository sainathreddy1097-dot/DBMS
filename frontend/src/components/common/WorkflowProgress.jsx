import React from 'react';
import { Check, Clock, ShieldCheck, Wrench, CheckCircle2, Truck } from 'lucide-react';

const steps = [
  { key: 'BOOKED', label: 'Booked', icon: Clock },
  { key: 'APPROVED', label: 'Approved', icon: ShieldCheck },
  { key: 'ASSIGNED', label: 'Assigned', icon: Wrench },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
  { key: 'DELIVERED', label: 'Delivered', icon: Truck },
];

export default function WorkflowProgress({ currentStatus }) {
  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  if (isRejected) {
    return (
      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-center gap-2">
        <span className="font-semibold">Service Request Declined / Rejected</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-0">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%'
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isPassed = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPassed
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : isCurrent
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/50 scale-110 animate-pulse'
                    : 'bg-slate-900 border border-slate-700 text-slate-500'
                }`}
              >
                {isPassed ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`mt-2 text-xs font-medium tracking-tight ${
                  isCurrent
                    ? 'text-cyan-400 font-bold'
                    : isPassed
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
