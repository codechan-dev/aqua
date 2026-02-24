
import React, { useState } from 'react';
import { OrderData, OrderStatus, Product } from '../types';
import { PRODUCTS } from '../constants';

interface AdminPanelProps {
  orders: OrderData[];
  products: Product[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ orders, products, onUpdateStatus, onLogout }) => {
  const [filter, setFilter] = useState<string>('All');

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PLACED).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    revenue: orders.reduce((acc, curr) => {
      const p = products.find(prod => prod.id === curr.productId);
      return acc + (p ? p.price * curr.quantity : 0);
    }, 0)
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-slate-900 text-white p-4 sm:p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-[8px] flex items-center justify-center font-bold">A</div>
            <h1 className="text-lg font-bold tracking-tight">Admin Hub</h1>
          </div>
          <button onClick={onLogout} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Sign Out</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full p-4 sm:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            { label: 'Orders', value: stats.total, color: 'blue' },
            { label: 'Pending', value: stats.pending, color: 'amber' },
            { label: 'Completed', value: stats.delivered, color: 'green' },
            { label: 'Revenue', value: `₹${stats.revenue}`, color: 'blue' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-5 sm:p-6 rounded-[12px] border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[12px] shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Delivery Dashboard</h2>
            <div className="flex flex-wrap bg-slate-100 p-1 rounded-[12px] gap-1">
              {['All', ...Object.values(OrderStatus)].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold transition-all ${filter === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Order</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">No orders to display.</td>
                  </tr>
                ) : (
                  filteredOrders.reverse().map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block text-xs">{o.id}</span>
                        <span className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">{o.name}</p>
                        <p className="text-[11px] text-slate-400">{o.phone} • {o.area}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-700">{o.quantity}x {products.find(p => p.id === o.productId)?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase ${
                          o.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' : 
                          o.status === OrderStatus.OUT_FOR_DELIVERY ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.status}
                          onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-slate-50 border border-slate-200 rounded-[8px] text-[10px] font-bold px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-600"
                        >
                          {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
