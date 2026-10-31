import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Phone, Mail, MapPin, Car, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cRes, vRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/vehicles'),
      ]);
      setCustomers(cRes.data);
      setVehicles(vRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerVehicles = (userId) => {
    return vehicles.filter(v => v.user?.id === userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-400" />
          <span>Customer Directory</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered vehicle owners, primary contact numbers, and linked garage fleets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => {
          const userVehicles = getCustomerVehicles(c.id);

          return (
            <div key={c.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-base">
                    {c.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{c.fullName}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-semibold">
                      Customer #{c.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.address || 'Hyderabad, TS'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Registered Garage Vehicles ({userVehicles.length})
                  </span>
                  {userVehicles.length === 0 ? (
                    <span className="text-[11px] text-slate-500 italic">No vehicles registered yet</span>
                  ) : (
                    <div className="space-y-1.5">
                      {userVehicles.map((v) => (
                        <div key={v.id} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] flex justify-between items-center">
                          <span className="font-semibold text-slate-200">
                            {v.manufacturer} {v.model}
                          </span>
                          <span className="font-mono text-cyan-400 text-[10px] font-bold">
                            {v.registrationNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>Joined Platform</span>
                <span>Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
