import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import WorkflowProgress from '../../components/common/WorkflowProgress';
import { Wrench, CheckCircle2, Clock, Car, FileText, Check, Plus, AlertCircle, X } from 'lucide-react';

export default function MechanicJobsPage() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [updateModal, setUpdateModal] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [notes, setNotes] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [partsList, setPartsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jRes, pRes] = await Promise.all([
        api.get('/service-requests'),
        api.get('/inventory'),
      ]);
      setJobs(jRes.data);
      setSpareParts(pRes.data);
      if (pRes.data.length > 0) setSelectedPart(pRes.data[0].partNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = () => {
    if (!selectedPart) return;
    const found = spareParts.find(p => p.partNumber === selectedPart);
    if (!found) return;
    setPartsList([...partsList, `${found.partName} (${found.partNumber}) x${partQty}`]);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      const partsReplacedString = partsList.join(', ');
      await api.put(`/service-requests/${updateModal.id}/status`, {
        status: newStatus,
        notes: notes || `Technician progressed service order to ${newStatus}.`,
        partsReplaced: partsReplacedString,
      });

      // Deduct used inventory in backend
      for (const item of partsList) {
        const skuMatch = item.match(/\((SP-[A-Z0-9-]+)\)/);
        if (skuMatch) {
          const sku = skuMatch[1];
          const partObj = spareParts.find(p => p.partNumber === sku);
          if (partObj) {
            await api.post(`/inventory/${partObj.id}/issue`, {
              quantity: 1,
              serviceRequestId: updateModal.id,
              notes: `Consumed by mechanic for order ${updateModal.bookingReference}`,
            }).catch(() => {});
          }
        }
      }

      setUpdateModal(null);
      setPartsList([]);
      setNotes('');
      loadData();
    } catch (err) {
      alert('Status update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-400" />
            <span>Assigned Work Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Perform diagnostics, update milestone status, record technician notes, and register replaced parts.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
            No work orders assigned to your station at this moment.
          </div>
        ) : (
          jobs.map((j) => (
            <div
              key={j.id}
              className="glass-card rounded-2xl p-6 relative overflow-hidden hover:border-amber-500/40 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30">
                      {j.bookingReference}
                    </span>
                    <StatusBadge status={j.status} />
                    <span className="text-xs text-slate-400">• Scheduled: {j.preferredDate}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {j.vehicle?.manufacturer} {j.vehicle?.model}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Reg: <strong className="text-cyan-300">{j.vehicle?.registrationNumber}</strong> • Odometer: {j.vehicle?.currentMileage?.toLocaleString()} km • Fuel: {j.vehicle?.fuelType}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUpdateModal(j);
                      setNewStatus(j.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'COMPLETED');
                      setNotes('');
                      setPartsList([]);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Update Progress & Spares</span>
                  </button>
                </div>
              </div>

              {/* Workflow Status Line */}
              <div className="py-2">
                <WorkflowProgress currentStatus={j.status} />
              </div>

              {/* Reported Problem & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Customer Reported Problem</span>
                  <p className="text-slate-300 italic">"{j.problemDescription}"</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Customer Contact Telemetry</span>
                  <div className="text-slate-300">
                    <div>{j.user?.fullName}</div>
                    <div className="text-slate-400">{j.user?.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Progress & Parts Modal */}
      {updateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Update Repair Progress ({updateModal.bookingReference})</span>
              </h3>
              <button onClick={() => setUpdateModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Advance Status Milestone</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-cyan-300"
                >
                  <option value="IN_PROGRESS">IN PROGRESS (Disassembly, Servicing, Testing)</option>
                  <option value="COMPLETED">COMPLETED (All Repairs Done & Quality Passed)</option>
                  <option value="ASSIGNED">ASSIGNED (In Queue)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technician Work Notes & Diagnostics</label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Drained synthetic oil, replaced front ceramic brake pads, rotor disc runout within 0.02mm tolerance, 35-point safety check passed."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              {/* Spare Parts Usage Selection */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Record Consumed / Replaced Spare Parts
                </span>

                <div className="flex gap-2">
                  <select
                    value={selectedPart}
                    onChange={(e) => setSelectedPart(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-[11px]"
                  >
                    {spareParts.map((p) => (
                      <option key={p.id} value={p.partNumber}>
                        {p.partName} ({p.partNumber}) - ₹{p.unitPrice}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Add Part
                  </button>
                </div>

                {partsList.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-slate-500 block">Parts to be registered to work log:</span>
                    {partsList.map((item, idx) => (
                      <div key={idx} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] flex justify-between items-center">
                        <span>• {item}</span>
                        <button
                          type="button"
                          onClick={() => setPartsList(partsList.filter((_, i) => i !== idx))}
                          className="text-rose-400 text-[10px]"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20"
                >
                  Save & Update Work Log
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
