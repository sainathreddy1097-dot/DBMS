import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import InvoiceModal from '../../components/common/InvoiceModal';
import { FileText, Plus, Printer, DollarSign, CheckCircle2, Search, X } from 'lucide-react';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [newInvoice, setNewInvoice] = useState({
    serviceRequestId: '',
    labourCharges: 2500,
    sparePartsCharges: 4200,
    gstRate: 18,
    items: [
      { itemType: 'LABOUR', description: 'Technician Diagnostics & Labour', quantity: 1, unitPrice: 2500 },
      { itemType: 'PART', description: 'Consumables & Replaced Hardware', quantity: 1, unitPrice: 4200 },
    ]
  });

  useEffect(() => {
    loadInvoices();
    loadCompletedRequests();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCompletedRequests = async () => {
    try {
      const res = await api.get('/service-requests');
      const reqs = res.data.filter(r => r.status === 'COMPLETED' || r.status === 'DELIVERED');
      setCompletedRequests(reqs);
      if (reqs.length > 0) {
        setNewInvoice(prev => ({ ...prev, serviceRequestId: reqs[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/invoices', {
        serviceRequestId: Number(newInvoice.serviceRequestId),
        labourCharges: parseFloat(newInvoice.labourCharges),
        sparePartsCharges: parseFloat(newInvoice.sparePartsCharges),
        gstRate: parseFloat(newInvoice.gstRate),
        items: newInvoice.items,
      });
      setShowCreateModal(false);
      loadInvoices();
    } catch (err) {
      alert('Failed to generate invoice: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = invoices.filter(inv => {
    if (filter === 'PAID') return inv.paymentStatus === 'PAID';
    if (filter === 'PENDING') return inv.paymentStatus === 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Revenue Management & Tax Invoices</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconcile parts and labour costs, calculate statutory 18% GST, and issue digital invoices.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4 text-right">Labour (₹)</th>
                <th className="py-3 px-4 text-right">Parts (₹)</th>
                <th className="py-3 px-4 text-right">GST 18% (₹)</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((inv) => {
                const isPaid = inv.paymentStatus === 'PAID';
                return (
                  <tr key={inv.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-medium text-white">{inv.user?.fullName}</td>
                    <td className="py-3 px-4">
                      <div>{inv.vehicle?.manufacturer} {inv.vehicle?.model}</div>
                      <div className="text-[10px] font-mono text-cyan-300">{inv.vehicle?.registrationNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">₹{inv.labourCharges?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono">₹{inv.sparePartsCharges?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono">₹{inv.gstAmount?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                      ₹{inv.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isPaid
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-[11px] font-semibold transition inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Generate Workshop Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Completed Work Order</label>
                {completedRequests.length === 0 ? (
                  <p className="text-amber-400 text-xs">No completed service requests awaiting invoice generation.</p>
                ) : (
                  <select
                    value={newInvoice.serviceRequestId}
                    onChange={(e) => setNewInvoice({ ...newInvoice, serviceRequestId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-cyan-300"
                  >
                    {completedRequests.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.bookingReference} • {r.vehicle?.manufacturer} {r.vehicle?.model} ({r.user?.fullName})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Labour Charges (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newInvoice.labourCharges}
                    onChange={(e) => setNewInvoice({ ...newInvoice, labourCharges: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Spare Parts Cost (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newInvoice.sparePartsCharges}
                    onChange={(e) => setNewInvoice({ ...newInvoice, sparePartsCharges: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{(newInvoice.labourCharges + newInvoice.sparePartsCharges).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (18%):</span>
                  <span className="font-mono">₹{((newInvoice.labourCharges + newInvoice.sparePartsCharges) * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex justify-between font-bold text-white">
                  <span>Calculated Invoice Total:</span>
                  <span className="font-mono text-cyan-400">
                    ₹{((newInvoice.labourCharges + newInvoice.sparePartsCharges) * 1.18).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={completedRequests.length === 0}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition mt-2 disabled:opacity-50"
              >
                Create Tax Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPaymentSuccess={() => {
            loadInvoices();
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
}
