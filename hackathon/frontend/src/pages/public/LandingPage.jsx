import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Sparkles, Activity, FileText, Cpu, ArrowRight, CheckCircle2, Car, Clock } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Car,
      title: 'Customer & Vehicle Profiles',
      desc: 'Seamlessly register multiple multi-segment vehicles with detailed technical telemetry, mileage tracking, and historical service logs.'
    },
    {
      icon: Clock,
      title: 'Instant Service Booking',
      desc: 'Choose from 9 specialized service lines with upfront estimates, slot selection, and unique system-generated tracking IDs.'
    },
    {
      icon: Wrench,
      title: 'Smart Mechanic Assignment',
      desc: 'Admin console allows dynamic task assignment, workload balancing, and skill-specialization matching.'
    },
    {
      icon: Activity,
      title: 'Live Lifecycle Tracking',
      desc: 'Transparent 6-stage repair progression from BOOKED to DELIVERED with real-time technician notes.'
    },
    {
      icon: FileText,
      title: 'Automated Tax Invoicing',
      desc: 'Itemized billing with calculated labour, spare-parts reconciliation, 18% GST computations, and 1-click printable receipts.'
    },
    {
      icon: Sparkles,
      title: 'AI Maintenance Predictor',
      desc: 'Rule-based predictive intelligence analyzing mileage, elapsed duration, and age thresholds to prevent costly breakdowns.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-transparent blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>CODESPARK HACKATHON 2026 • PROBLEM STATEMENT 05</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
            Next-Gen Intelligence for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Vehicle Maintenance
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            AutoCare Pro bridges vehicle owners, certified mechanics, and workshop managers with end-to-end service tracking, transparent GST billing, and predictive maintenance algorithms.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:brightness-110 transition flex items-center gap-2 group"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/services"
              className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-800/80 hover:text-white transition"
            >
              View Service Catalog
            </Link>
          </div>

          {/* Quick Demo Logins Pill Bar */}
          <div className="mt-12 p-4 max-w-2xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <div className="font-semibold text-slate-300 mb-2">⚡ Pre-Configured Demo Accounts (Ready to Test):</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-left">
                <span className="text-purple-400 font-bold block">Admin Portal</span>
                <span className="text-[11px] text-slate-300">admin@autocare.com</span>
                <span className="text-[10px] text-slate-500 block">Password: admin123</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-left">
                <span className="text-amber-400 font-bold block">Technician</span>
                <span className="text-[11px] text-slate-300">ramesh@autocare.com</span>
                <span className="text-[10px] text-slate-500 block">Password: mechanic123</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-left">
                <span className="text-cyan-400 font-bold block">Vehicle Owner</span>
                <span className="text-[11px] text-slate-300">sainath@example.com</span>
                <span className="text-[10px] text-slate-500 block">Password: customer123</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mandatory Workflow Showcase */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Standardized Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-white">Full Lifecycle Visibility</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Every booking transitions smoothly across 6 verified milestone states with strict role authorization.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: '1', title: 'BOOKED', role: 'Customer Initiated', color: 'border-amber-500/40 text-amber-400' },
              { step: '2', title: 'APPROVED', role: 'Admin Verified', color: 'border-blue-500/40 text-blue-400' },
              { step: '3', title: 'ASSIGNED', role: 'Mechanic Allocated', color: 'border-indigo-500/40 text-indigo-400' },
              { step: '4', title: 'IN PROGRESS', role: 'Active Bay Repair', color: 'border-cyan-500/40 text-cyan-400' },
              { step: '5', title: 'COMPLETED', role: 'Quality Checked', color: 'border-emerald-500/40 text-emerald-400' },
              { step: '6', title: 'DELIVERED', role: 'Settled & Released', color: 'border-purple-500/40 text-purple-400' },
            ].map((s) => (
              <div key={s.step} className={`p-4 rounded-xl bg-slate-950 border ${s.color} text-center flex flex-col items-center justify-center`}>
                <span className="text-[10px] font-bold text-slate-500 mb-1">STAGE {s.step}</span>
                <span className="font-extrabold text-sm tracking-wide">{s.title}</span>
                <span className="text-[11px] text-slate-400 mt-1">{s.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Built For Commercial Workshops & Modern Drivers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
