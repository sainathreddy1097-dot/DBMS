import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CalendarPlus, Car, Wrench, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { serviceCatalog } from '../public/ServicesPage';

export default function BookServicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState(location.state?.preselectedVehicleId || '');
  const [serviceCategory, setServiceCategory] = useState(location.state?.selectedCategory || 'General Servicing');
  const [problemDescription, setProblemDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data);
      if (res.data.length > 0 && !vehicleId) {
        setVehicleId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedServiceInfo = serviceCatalog.find(s => s.name === serviceCategory) || serviceCatalog[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        vehicleId: Number(vehicleId),
        serviceCategory,
        problemDescription,
        preferredDate,
      };
      const res = await api.post('/service-requests', payload);
      setBookingSuccess(res.data);
    } catch (err) {
      alert('Service booking failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="glass-card rounded-2xl p-8 text-center border-cyan-500/40 glow-cyan">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Booking Confirmed</span>
          <h2 className="text-2xl font-black text-white mt-1">Service Appointment Scheduled!</h2>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Unique Booking Reference:</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">{bookingSuccess.bookingReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scheduled Date:</span>
              <span className="font-semibold text-white">{bookingSuccess.preferredDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Service Category:</span>
              <span className="font-semibold text-white">{bookingSuccess.serviceCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Estimated Charges:</span>
              <span className="font-mono font-bold text-emerald-400">₹{bookingSuccess.estimatedCost?.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/track-service', { state: { bookingId: bookingSuccess.id } })}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
            >
              Track Live Service Progress
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarPlus className="w-6 h-6 text-cyan-400" />
          <span>Book Vehicle Servicing</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select your registered vehicle, pick a certified service category, and enter problem symptoms for precision workshop diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Booking Form */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Vehicle Selection */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Vehicle from Garage</span>
              </label>
              {vehicles.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  No vehicles found in your garage. Please{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/vehicles')}
                    className="font-bold underline text-white"
                  >
                    register a vehicle first
                  </button>.
                </div>
              ) : (
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.manufacturer} {v.model} ({v.registrationNumber}) - {v.currentMileage?.toLocaleString()} km
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Service Category */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>Service Category</span>
              </label>
              <select
                required
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none font-semibold text-cyan-300"
              >
                {serviceCatalog.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} (Estimated {s.estimate})
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preferred Service Date</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Problem Description */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reported Problem Symptoms & Notes</span>
              </label>
              <textarea
                required
                rows={4}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe noises, vibrations, warning lights, cold start issues, or specific parts requiring attention..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || vehicles.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-cyan-500/25 hover:brightness-110 transition disabled:opacity-50 mt-4 uppercase"
            >
              {submitting ? 'Generating Booking...' : 'Confirm Service Booking'}
            </button>
          </form>
        </div>

        {/* Selected Service Preview Box */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Selected Package</span>
            <h3 className="text-base font-bold text-white mt-1">{selectedServiceInfo.name}</h3>
            <p className="text-slate-400 mt-2 leading-relaxed text-[11px]">{selectedServiceInfo.description}</p>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Service Coverage</span>
              {selectedServiceInfo.included.map((inc, i) => (
                <div key={i} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Estimate:</span>
            <span className="text-lg font-mono font-black text-cyan-400">{selectedServiceInfo.estimate}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
