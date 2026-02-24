
import React from 'react';
import { OrderData, ViewState, Product } from '../types';
import { PRODUCTS } from '../constants';

interface ClientDashboardProps {
  orders: OrderData[];
  products: Product[];
  onTrackOrder: (order: OrderData) => void;
  setView: (view: ViewState) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ orders, products, onTrackOrder, setView }) => {
  return (
    <div className="max-w-5xl mx-auto py-10 sm:py-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Customer Center</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Order History</h2>
        </div>
        <button 
          onClick={() => setView('HOME')}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-[12px] font-bold text-sm shadow-sm hover:bg-blue-700 transition-all"
        >
          Book Delivery
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[12px] p-16 text-center border border-slate-200">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">💧</div>
           <p className="text-lg font-bold text-slate-800">You haven't placed any orders yet.</p>
           <button onClick={() => setView('HOME')} className="text-blue-600 font-bold mt-3 hover:underline">Start your first order</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {orders.map(order => {
            const product = products.find(p => p.id === order.productId);
            return (
              <div key={order.id} className="bg-white rounded-[12px] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.id}</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">{product?.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-[6px] text-[9px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cans</span>
                      <span className="text-lg font-bold text-slate-900">{order.quantity}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Paid</span>
                      <span className="text-lg font-bold text-blue-600">₹{(product?.price || 0) * order.quantity}</span>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => onTrackOrder(order)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-[12px] font-bold text-xs hover:bg-slate-200 transition-all"
                  >
                    Track
                  </button>
                  <button 
                    onClick={() => {
                      onTrackOrder(order);
                      setView('BILL');
                    }}
                    className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-[12px] font-bold text-xs hover:bg-blue-100 transition-all"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
