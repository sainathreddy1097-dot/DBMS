import React, { useState } from 'react';
import { X, Printer, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export default function InvoiceModal({ invoice, onClose, onPaymentSuccess }) {
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  if (!invoice) return null;

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post(`/invoices/${invoice.id}/pay`, { paymentMethod });
      if (onPaymentSuccess) onPaymentSuccess();
      onClose();
    } catch (err) {
      alert('Payment processing failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.paymentStatus === 'PAID';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Actions header (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-300">Invoice Details</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isPaid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {invoice.paymentStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 bg-slate-900 text-slate-100">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                AutoCare<span className="text-cyan-400">Pro</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Smart Vehicle Service & Maintenance Hub</p>
              <p className="text-xs text-slate-500">Bachupally Campus, Hyderabad, TS 500090</p>
              <p className="text-xs text-slate-500">GSTIN: 36AAACA1234F1Z8 | info@autocarepro.com</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">TAX INVOICE</span>
              <div className="text-lg font-mono font-bold text-white mt-1">{invoice.invoiceNumber}</div>
              <p className="text-xs text-slate-400 mt-1">Date: {invoice.invoiceDate}</p>
              <p className="text-xs text-slate-400">Due: {invoice.dueDate || invoice.invoiceDate}</p>
            </div>
          </div>

          {/* Customer & Vehicle Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Billed To</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">{invoice.user?.fullName}</p>
              <p className="text-slate-400">{invoice.user?.email}</p>
              <p className="text-slate-400">{invoice.user?.phone}</p>
              <p className="text-slate-400 mt-1">{invoice.user?.address || 'Hyderabad, Telangana'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vehicle & Job</span>
              <p className="text-sm font-semibold text-cyan-300 mt-1">
                {invoice.vehicle?.manufacturer} {invoice.vehicle?.model}
              </p>
              <p className="font-mono text-slate-300">Reg: {invoice.vehicle?.registrationNumber}</p>
              <p className="text-slate-400">Mileage: {invoice.vehicle?.currentMileage?.toLocaleString()} km</p>
              <p className="text-slate-400">Ref: {invoice.serviceRequest?.bookingReference}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.itemType === 'PART' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {item.itemType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium">{item.description}</td>
                      <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{item.unitPrice?.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">₹{item.totalPrice?.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">LABOUR</span></td>
                      <td className="py-2.5 px-3">Technical Diagnostics & Servicing Labour</td>
                      <td className="py-2.5 px-3 text-center">1</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{invoice.labourCharges?.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">₹{invoice.labourCharges?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">PARTS</span></td>
                      <td className="py-2.5 px-3">Replaced Consumables & Spare Parts</td>
                      <td className="py-2.5 px-3 text-center">1</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{invoice.sparePartsCharges?.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">₹{invoice.sparePartsCharges?.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Labour Subtotal:</span>
                <span className="font-mono">₹{invoice.labourCharges?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Parts Subtotal:</span>
                <span className="font-mono">₹{invoice.sparePartsCharges?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST ({invoice.gstRate}%):</span>
                <span className="font-mono">₹{invoice.gstAmount?.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 flex justify-between text-sm font-bold text-white">
                <span>Total Payable:</span>
                <span className="font-mono text-cyan-400 text-base">₹{invoice.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-800 pt-4 text-[11px] text-slate-500 flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-cyan-400/80">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified 90-Day Quality Assurance Guarantee</span>
            </div>
            <span>AutoCare Pro Digital Systems</span>
          </div>
        </div>

        {/* Payment CTA (Only visible for unpaid invoices, hidden in print) */}
        {!isPaid && (
          <div className="no-print p-6 bg-slate-950/80 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">Select Instant Payment Gateway:</span>
                <div className="flex items-center gap-2 mt-1">
                  {['UPI', 'CREDIT_CARD', 'NET_BANKING', 'CASH'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                        paymentMethod === m
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 transition disabled:opacity-50"
              >
                {paying ? 'Authorizing Payment...' : `Complete Payment (₹${invoice.totalAmount?.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
