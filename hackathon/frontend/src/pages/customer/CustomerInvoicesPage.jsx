import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import InvoiceModal from '../../components/common/InvoiceModal';
import { FileText, Printer, CreditCard, CheckCircle2, Clock, Search } from 'lucide-react';

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
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
            <span>Invoices & Billing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access itemized GST tax invoices, breakdown of parts and labour, and settle payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'PAID'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center glass-panel rounded-2xl text-slate-400 text-xs">
            No invoices found for this selection.
          </div>
        ) : (
          filteredInvoices.map((inv) => {
            const isPaid = inv.paymentStatus === 'PAID';
            return (
              <div
                key={inv.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                        isPaid
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {inv.paymentStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {inv.vehicle?.manufacturer} {inv.vehicle?.model}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Reg: {inv.vehicle?.registrationNumber} • Date: {inv.invoiceDate}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Labour</span>
                      <span className="font-mono font-semibold text-slate-300">₹{inv.labourCharges?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Spare Parts</span>
                      <span className="font-mono font-semibold text-slate-300">₹{inv.sparePartsCharges?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">GST (18%)</span>
                      <span className="font-mono font-semibold text-slate-300">₹{inv.gstAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Total Invoice Value</span>
                    <span className="text-xl font-mono font-black text-cyan-400">₹{inv.totalAmount?.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>

                    {!isPaid && (
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal for View / Print / Pay */}
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
