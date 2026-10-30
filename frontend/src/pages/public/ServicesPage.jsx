import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Disc, Battery, Wind, Gauge, Sparkles, Check, ArrowRight } from 'lucide-react';

export const serviceCatalog = [
  {
    id: 'general-servicing',
    name: 'General Servicing',
    estimate: '₹5,500',
    duration: '4 - 5 Hours',
    description: 'Comprehensive 45-point maintenance inspection, engine oil flush, coolant replenishment, spark plug check, and chassis lubrication.',
    included: ['Synthetic Engine Oil Renewal', 'Oil & Air Filter Replacement', 'Fluid Top-Up (Coolant & Brake)', 'Underbody & Suspension Scrutiny']
  },
  {
    id: 'oil-change',
    name: 'Oil Change',
    estimate: '₹3,200',
    duration: '60 Minutes',
    description: 'Premium grade synthetic 5W-30 / 0W-20 engine oil drainage and refill with original high-flow micro-filtration elements.',
    included: ['4 Litres Fully Synthetic Oil', 'OEM Oil Filter Replacement', 'Sump Plug Washer Inspection', 'Oil Pressure & Leak Check']
  },
  {
    id: 'engine-repair',
    name: 'Engine Repair',
    estimate: '₹8,500',
    duration: '1 - 2 Days',
    description: 'Advanced OBD-II computational diagnostics, cylinder compression analysis, timing belt/chain adjustment, and fuel injector ultrasonic cleaning.',
    included: ['ECU Error Code Telemetry', 'Timing & Spark Synchronisation', 'Intake Manifold Carbon Decarb', 'Dynamometer Post-Test']
  },
  {
    id: 'brake-inspection',
    name: 'Brake Inspection',
    estimate: '₹3,800',
    duration: '2 Hours',
    description: 'Front and rear caliper servicing, ceramic brake pad wear measurement, rotor disc runout micrometer evaluation, and hydraulic fluid bleed.',
    included: ['Brake Pad Depth Profiling', 'Disc Rotor Resurfacing Check', 'Dot 4 Hydraulic Fluid Flush', 'Emergency Handbrake Adjustment']
  },
  {
    id: 'wheel-alignment',
    name: 'Wheel Alignment',
    estimate: '₹1,800',
    duration: '90 Minutes',
    description: '3D high-precision computerised laser wheel alignment, camber, caster, toe angle correction, and dynamic high-speed wheel balancing.',
    included: ['Computerized 3D Laser Alignment', '4-Wheel Dynamic Balancing', 'Tyre Pressure Optimization', 'Steering Centering Calibration']
  },
  {
    id: 'battery-replacement',
    name: 'Battery Replacement',
    estimate: '₹6,000',
    duration: '45 Minutes',
    description: 'Cold-cranking amp (CCA) load test, terminal anti-corrosion treatment, altenator output validation, and fresh warranty-backed battery installation.',
    included: ['Exide/Amaron 12V Battery', 'Old Battery Safe Disposal', 'Altenator 14V Charging Check', 'BMS Sensor ECU Re-Registration']
  },
  {
    id: 'ac-service',
    name: 'AC Service',
    estimate: '₹3,500',
    duration: '3 Hours',
    description: 'Complete HVAC diagnostic, R134a refrigerant evacuation and recharge, compressor oil top-up, condenser deep cleaning, and cabin ozone sanitization.',
    included: ['R134a Refrigerant Re-Gas', 'Condenser High-Pressure Wash', 'HEPA Cabin Filter Renewal', 'Vent Microbial Disinfection']
  },
  {
    id: 'tyre-replacement',
    name: 'Tyre Replacement',
    estimate: '₹9,000',
    duration: '2 Hours',
    description: 'Replacement with fresh radial tyres, automated mounting, electronic rim balance, tubeless valve stem replacement, and nitrogen inflation.',
    included: ['Premium Brand Radial Tyres', 'Brass Valve Replacement', 'Nitrogen Gas Inflation', 'Road Hazard Guarantee']
  },
  {
    id: 'full-vehicle-inspection',
    name: 'Full Vehicle Inspection',
    estimate: '₹2,000',
    duration: '3 Hours',
    description: 'Pre-purchase or pre-long drive comprehensive 75-point physical and electronic audit with downloadable vehicle health report.',
    included: ['Paint & Chassis Structural Audit', 'Full OBD System Diagnostic', 'Steering, Brakes & Tyres Health', 'Digital Vehicle Health Card']
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Certified Automotive Services</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Engineered Precision For Every Vehicle</h1>
          <p className="text-slate-400 text-sm mt-3">
            Choose from our specialized workshop service lines. Transparent pricing with genuine spares and automated digital invoicing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCatalog.map((svc) => (
            <div
              key={svc.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{svc.name}</h3>
                  <span className="text-sm font-mono font-bold text-cyan-400">{svc.estimate}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mb-3">Turnaround: {svc.duration}</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{svc.description}</p>

                <div className="space-y-1.5 mb-6">
                  {svc.included.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/book-service"
                state={{ selectedCategory: svc.name }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 group"
              >
                <span>Book This Service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
