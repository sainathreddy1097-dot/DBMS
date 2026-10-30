import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight, Gauge, Clock, Cpu, CheckCircle2 } from 'lucide-react';

export default function RecommendationsPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const res = await api.get('/recommendations/my-vehicles');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const vehiclesKeys = Object.keys(data);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Explainable AI Diagnostic Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Automotive Predictive Maintenance</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Rule-based predictive health algorithms evaluate continuous odometer accumulation, operational degradation curves, and seasonal durations to forecast critical component replacements before failure.
        </p>
      </div>

      {/* Model Transparency Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3 text-xs">
        <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-300">
          <span className="font-bold text-cyan-300">Explainable AI Architecture Notice: </span>
          Recommendations are computed via deterministic automotive wear models adhering to SAE (Society of Automotive Engineers) service intervals. Each prediction transparently details the specific telemetry trigger factor.
        </div>
      </div>

      {vehiclesKeys.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
          No vehicle telemetry available. Please register a vehicle to run AI predictive diagnostics.
        </div>
      ) : (
        vehiclesKeys.map((regNo) => {
          const item = data[regNo];
          const vehicle = item.vehicle;
          const recs = item.recommendations || [];

          return (
            <div key={regNo} className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-slate-900 border border-cyan-500/30">
                      {vehicle?.registrationNumber}
                    </span>
                    <span className="text-xs text-slate-400">• Year: {vehicle?.manufacturingYear}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {vehicle?.manufacturer} {vehicle?.model}
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <span>Odometer: <strong className="text-white font-mono">{vehicle?.currentMileage?.toLocaleString()} km</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Last Service: <strong className="text-white">{vehicle?.lastServiceDate || 'Baseline'}</strong></span>
                  </div>
                </div>
              </div>

              {recs.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All telemetry parameters nominal. No urgent service intervention required.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recs.map((rec, i) => {
                    const isHigh = rec.urgency === 'HIGH';
                    const isMed = rec.urgency === 'MEDIUM';

                    return (
                      <div
                        key={i}
                        className={`rounded-xl p-5 border flex flex-col justify-between ${
                          isHigh
                            ? 'bg-rose-950/20 border-rose-500/30'
                            : isMed
                            ? 'bg-amber-950/20 border-amber-500/30'
                            : 'bg-cyan-950/20 border-cyan-500/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isHigh
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : isMed
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}
                            >
                              {rec.urgency} URGENCY
                            </span>
                            <span className="font-mono text-xs font-bold text-white">Est. ₹{rec.estimatedCost?.toFixed(2)}</span>
                          </div>

                          <h3 className="text-sm font-bold text-white mb-1">{rec.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3">{rec.explanation}</p>

                          <div className="text-[11px] p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 mb-4">
                            <span className="text-cyan-400 font-semibold">Engine Trigger Factor: </span>
                            {rec.triggerFactor}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            navigate('/book-service', {
                              state: {
                                preselectedVehicleId: vehicle?.id,
                                selectedCategory: rec.category,
                              },
                            })
                          }
                          className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <span>Schedule {rec.category}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
