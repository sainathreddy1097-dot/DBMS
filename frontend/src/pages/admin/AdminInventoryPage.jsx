import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Boxes, Plus, AlertTriangle, ArrowDownRight, Search, Check, X } from 'lucide-react';

export default function AdminInventoryPage() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [issueModal, setIssueModal] = useState(null);
  const [issueQty, setIssueQty] = useState(1);
  const [issueReqId, setIssueReqId] = useState('');
  const [issueNotes, setIssueNotes] = useState('');
  const [newPart, setNewPart] = useState({
    partNumber: '',
    partName: '',
    category: 'Fluids & Lubricants',
    unitPrice: 1500,
    stockQuantity: 20,
    reorderLevel: 5,
  });

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const res = await api.get('/inventory');
      setParts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', newPart);
      setShowAddModal(false);
      loadParts();
    } catch (err) {
      alert('Add part failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleIssuePart = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/inventory/${issueModal.id}/issue`, {
        quantity: parseInt(issueQty),
        serviceRequestId: issueReqId ? Number(issueReqId) : null,
        notes: issueNotes,
      });
      setIssueModal(null);
      loadParts();
    } catch (err) {
      alert('Issue failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = parts.filter(
    (p) =>
      p.partNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.partName?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-400" />
            <span>Spare Parts & Consumables Inventory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workshop inventory tracking, automated reorder thresholds, and job consumption logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Part</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search part name, number, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          {parts.length} Active Catalog SKUs
        </span>
      </div>

      {/* Parts Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3 px-4">Part SKU</th>
                <th className="py-3 px-4">Component Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-center">Reorder Limit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((p) => {
                const isLow = p.stockQuantity <= p.reorderLevel;
                return (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{p.partNumber}</td>
                    <td className="py-3 px-4 font-medium text-white">{p.partName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-200">
                      ₹{p.unitPrice?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded ${
                          isLow
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isLow && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{p.reorderLevel} units</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setIssueModal(p);
                          setIssueQty(1);
                          setIssueNotes('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <ArrowDownRight className="w-3 h-3" />
                        <span>Issue</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Add New Spare Part</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPart} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Part SKU Number</label>
                <input
                  type="text"
                  required
                  placeholder="SP-BRK-PAD-02"
                  value={newPart.partNumber}
                  onChange={(e) => setNewPart({ ...newPart, partNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Component Name</label>
                <input
                  type="text"
                  required
                  placeholder="Front Disc Brake Pads (Ceramic)"
                  value={newPart.partName}
                  onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newPart.category}
                    onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Fluids & Lubricants">Fluids & Lubricants</option>
                    <option value="Filters">Filters</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Body Parts">Body Parts</option>
                    <option value="Ignition">Ignition</option>
                    <option value="Suspension">Suspension</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newPart.unitPrice}
                    onChange={(e) => setNewPart({ ...newPart, unitPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPart.stockQuantity}
                    onChange={(e) => setNewPart({ ...newPart, stockQuantity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reorder Threshold</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPart.reorderLevel}
                    onChange={(e) => setNewPart({ ...newPart, reorderLevel: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition mt-2"
              >
                Save Spare Part
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Issue Part Modal */}
      {issueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-white mb-1">Issue Spare Part to Work Order</h3>
            <p className="text-slate-400 mb-4">
              Deducting <strong>{issueModal.partName}</strong> (Available: {issueModal.stockQuantity})
            </p>

            <form onSubmit={handleIssuePart} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quantity to Deduct</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={issueModal.stockQuantity}
                  value={issueQty}
                  onChange={(e) => setIssueQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Request ID (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={issueReqId}
                  onChange={(e) => setIssueReqId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Usage Notes</label>
                <input
                  type="text"
                  placeholder="Installed on front brake caliper assembly"
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Confirm Issue
                </button>
                <button
                  type="button"
                  onClick={() => setIssueModal(null)}
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
