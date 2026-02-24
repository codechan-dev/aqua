
import React from 'react';
import { OrderData, OrderStatus, Product, ViewState } from '../types';
import { PRODUCTS } from '../constants';

interface TrackingViewProps {
  order: OrderData;
  products: Product[];
  onClose: () => void;
  setView: (view: ViewState) => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ order, products, onClose, setView }) => {
  const product = products.find(p => p.id === order.productId);
  
  const statuses = [
    { label: OrderStatus.PLACED, icon: '📋', desc: 'Received' },
    { label: OrderStatus.CONFIRMED, icon: '👍', desc: 'Confirmed' },
    { label: OrderStatus.OUT_FOR_DELIVERY, icon: '🚚', desc: 'En route' },
    { label: OrderStatus.DELIVERED, icon: '📦', desc: 'Delivered' }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.label === order.status);

  return (
    <div className="max-w-4xl mx-auto my-6 sm:my-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[12px] shadow-md overflow-hidden border border-slate-200">
        <div className="bg-blue-600 p-6 sm:p-10 text-white relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                 <span className={`w-2 h-2 rounded-full ${order.status === OrderStatus.DELIVERED ? 'bg-blue-300' : 'bg-green-400 animate-pulse'}`}></span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                    {order.status === OrderStatus.DELIVERED ? 'Completed' : 'Tracking Status'}
                 </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">{order.id}</h2>
              <p className="text-blue-100 mt-1 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={() => setView('BILL')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-[12px] border border-white/20 transition-all flex items-center space-x-2 text-sm font-bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>View Invoice</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="relative mb-12 sm:mb-16 px-2 sm:px-4">
             <div className="absolute top-5 left-0 w-full h-1 bg-slate-100"></div>
             <div 
               className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-1000 ease-out shadow-sm"
               style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
             ></div>

             <div className="relative flex justify-between">
               {statuses.map((s, idx) => (
                 <div key={s.label} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-sm transition-all duration-700 z-10 border-4 ${
                      idx <= currentStatusIndex 
                        ? 'bg-blue-600 border-white text-white' 
                        : 'bg-white border-slate-100 text-slate-300'
                    }`}>
                      {idx < currentStatusIndex ? '✓' : s.icon}
                    </div>
                    <div className="text-center mt-3">
                      <p className={`text-[10px] font-bold uppercase tracking-tight ${idx <= currentStatusIndex ? 'text-slate-800' : 'text-slate-300'}`}>
                        {s.label}
                      </p>
                      <p className="text-[9px] text-slate-400 hidden sm:block">{s.desc}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Summary</h4>
              <div className="bg-slate-50 rounded-[12px] p-4 flex items-center space-x-4 border border-slate-100">
                 <div className="w-16 h-16 bg-white rounded-[12px] p-2 border border-slate-200 flex items-center justify-center">
                    <img src={product?.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                 </div>
                 <div>
                    <h5 className="text-base font-bold text-slate-800">{product?.name}</h5>
                    <p className="text-slate-500 text-xs font-medium">Qty: {order.quantity} x ₹{product?.price}</p>
                    <p className="text-blue-600 font-bold text-sm">Total: ₹{(product?.price || 0) * order.quantity}</p>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Address</h4>
              <div className="bg-slate-50 rounded-[12px] p-5 border border-slate-100">
                 <p className="text-slate-800 font-bold text-sm mb-1">{order.name}</p>
                 <p className="text-slate-500 text-xs leading-relaxed">
                   {order.address}, {order.area}<br/>
                   Chennai - {order.pincode}<br/>
                   <span className="text-blue-600 font-bold">Call: +91 {order.phone}</span>
                 </p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 bg-slate-900 text-white py-4 rounded-[12px] font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
          >
             Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
