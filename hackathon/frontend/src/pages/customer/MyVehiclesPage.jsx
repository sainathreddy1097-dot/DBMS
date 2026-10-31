import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Car, Plus, Trash2, Edit2, Calendar, Gauge, Fuel, ShieldCheck, X } from 'lucide-react';

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    manufacturer: '',
    model: '',
    manufacturingYear: 2022,
    fuelType: 'PETROL',
    currentMileage: 25000,
    vehicleCategory: 'SEDAN',
    lastServiceDate: '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', formData);
      setShowModal(false);
      setFormData({
        registrationNumber: '',
        manufacturer: '',
        model: '',
        manufacturingYear: 2023,
        fuelType: 'PETROL',
        currentMileage: 10000,
        vehicleCategory: 'SEDAN',
        lastServiceDate: '',
      });
      loadVehicles();
    } catch (err) {
      alert('Failed to register vehicle: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      loadVehicles();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-400" />
            <span>Vehicle Garage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register and manage your fleet profiles for precision diagnostics and service bookings.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-bold border border-cyan-500/30">
                  {v.vehicleCategory}
                </span>
                <button
                  onClick={() => handleDelete(v.id)}
                  title="Remove vehicle"
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white">
                {v.manufacturer} {v.model}
              </h3>
              <div className="font-mono text-sm font-semibold text-cyan-300 mt-0.5">{v.registrationNumber}</div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Model Year
                  </span>
                  <span className="font-semibold text-slate-200">{v.manufacturingYear}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> Fuel Type
                  </span>
                  <span className="font-semibold text-slate-200">{v.fuelType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> Current Odometer
                  </span>
                  <span className="font-mono font-semibold text-cyan-300">{v.currentMileage?.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Last Service</span>
                  <span className="font-semibold text-slate-200">{v.lastServiceDate || 'Not Recorded'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Telemetry Active
              </span>
              <span className="text-[10px] text-slate-500">ID #{v.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>Register Vehicle to Garage</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Registration Number (License Plate)</label>
                <input
                  type="text"
                  required
                  placeholder="TS09EA1234"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="Hyundai / Honda / Tata"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Creta SX / City / Nexon"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Year of Manufacture</label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max="2026"
                    value={formData.manufacturingYear}
                    onChange={(e) => setFormData({ ...formData, manufacturingYear: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Current Mileage (km)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.currentMileage}
                    onChange={(e) => setFormData({ ...formData, currentMileage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.vehicleCategory}
                    onChange={(e) => setFormData({ ...formData, vehicleCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="BIKE">Two-Wheeler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Last Service Date (Optional)</label>
                <input
                  type="date"
                  value={formData.lastServiceDate}
                  onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition mt-2 shadow-lg shadow-cyan-500/20"
              >
                Register Vehicle Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
