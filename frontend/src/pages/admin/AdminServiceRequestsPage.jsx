import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import { ClipboardList, Check, X, Wrench, FileText, UserCheck, Search, Truck } from 'lucide-react';

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState(null); // holds selected request
  const [selectedMechanicId, setSelectedMechanicId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [approveModal, setApproveModal] = useState(null);
  const [customEstimate, setCustomEstimate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadRequests();
    loadMechanics();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get('/service-requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMechanics = async () => {
    try {
      const res = await api.get('/mechanics');
      setMechanics(res.data);
      if (res.data.length > 0) setSelectedMechanicId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async () => {
    try {
      await api.put(`/service-requests/${approveModal.id}/approve`, {
        estimatedCost: customEstimate ? parseFloat(customEstimate) : approveModal.estimatedCost,
        adminNotes: adminNotes || 'Booking accepted. Bay scheduling initiated.',
      });
      setApproveModal(null);
      loadRequests();
    } catch (err) {
      alert('Approve failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
      await api.put(`/service-requests/${id}/reject`, { adminNotes: reason || 'Capacity reached.' });
      loadRequests();
    } catch (err) {
      alert('Reject failed');
    }
  };

  const handleAssignMechanic = async () => {
    try {
      await api.post(`/service-requests/${assignModal.id}/assign`, {
        mechanicId: Number(selectedMechanicId),
        notes: assignNotes || 'Assigned by workshop dispatch manager.',
      });
      setAssignModal(null);
      loadRequests();
      loadMechanics();
    } catch (err) {
      alert('Assignment failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeliver = async (id) => {
    if (!window.confirm('Mark this vehicle as DELIVERED to the customer?')) return;
    try {
      await api.put(`/service-requests/${id}/status`, {
        status: 'DELIVERED',
        notes: 'Vehicle inspected, keys handed over, and job closed.',
      });
      loadRequests();
    } catch (err) {
      alert('Delivery update failed');
    }
  };

  const filtered = requests.filter((r) => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch =
      r.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceCategory?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-cyan-400" />
            <span>Service Requests Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review customer bookings, approve work orders, assign certified mechanics, and release completed vehicles.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['ALL', 'BOOKED', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                filter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref, customer, reg..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle Specs</th>
                <th className="py-3 px-4">Service Category</th>
                <th className="py-3 px-4">Preferred Date</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{r.bookingReference}</td>
                  <td className="py-3 px-4 font-medium text-white">
                    <div>{r.user?.fullName}</div>
                    <div className="text-[10px] text-slate-500">{r.user?.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{r.vehicle?.manufacturer} {r.vehicle?.model}</div>
                    <div className="font-mono text-[10px] text-cyan-300">{r.vehicle?.registrationNumber}</div>
                  </td>
                  <td className="py-3 px-4">{r.serviceCategory}</td>
                  <td className="py-3 px-4 text-slate-400">{r.preferredDate}</td>
                  <td className="py-3 px-4">
                    {r.mechanic ? (
                      <span className="font-semibold text-amber-300">
                        {r.mechanic.user?.fullName}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {r.status === 'BOOKED' && (
                      <>
                        <button
                          onClick={() => {
                            setApproveModal(r);
                            setCustomEstimate(r.estimatedCost || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 font-bold text-[11px] transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {(r.status === 'APPROVED' || (r.status === 'ASSIGNED' && !r.mechanic)) && (
                      <button
                        onClick={() => {
                          setAssignModal(r);
                          setAssignNotes(r.adminNotes || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] transition flex items-center gap-1 inline-flex"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Assign Tech</span>
                      </button>
                    )}

                    {r.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleDeliver(r.id)}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/30 font-bold text-[11px] transition flex items-center gap-1 inline-flex"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Deliver Vehicle</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white mb-2">Approve Service Booking</h3>
            <p className="text-slate-400 mb-4">
              Approving <strong>{approveModal.bookingReference}</strong> for {approveModal.vehicle?.manufacturer} {approveModal.vehicle?.model}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Approved Estimated Total (₹)</label>
                <input
                  type="number"
                  value={customEstimate}
                  onChange={(e) => setCustomEstimate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Admin Remarks / Instructions</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Service bay slot reserved. Parts verification in order."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleApprove}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
                >
                  Confirm Approval
                </button>
                <button
                  onClick={() => setApproveModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Mechanic Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white mb-2">Assign Technician to Order</h3>
            <p className="text-slate-400 mb-4">
              Allocate bay technician for <strong>{assignModal.bookingReference}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Qualified Mechanic</label>
                <select
                  value={selectedMechanicId}
                  onChange={(e) => setSelectedMechanicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-cyan-300"
                >
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.user?.fullName} — {m.specialization} (Active Jobs: {m.activeJobsCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Order Instructions</label>
                <textarea
                  rows={3}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="Conduct thorough brake and suspension check before road test."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAssignMechanic}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Assign Work Order
                </button>
                <button
                  onClick={() => setAssignModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
