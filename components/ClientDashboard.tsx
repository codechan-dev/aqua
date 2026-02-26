
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
    <div className="max-w-5xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div>
          <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Customer Dashboard</div>
          <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-4 leading-none">
            Order <br/>
            <span className="serif italic font-light lowercase tracking-normal text-black/40">History.</span>
          </h2>
        </div>
        <button 
          onClick={() => setView('HOME')}
          className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black border-b-2 border-black pb-2 hover:text-blue-600 hover:border-blue-600 transition-all"
        >
          New Request
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="py-32 text-center border border-black/5 bg-stone-50">
           <p className="serif text-2xl italic text-black/40 mb-8">Your history is currently empty.</p>
           <button onClick={() => setView('HOME')} className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black underline underline-offset-8 hover:text-blue-600 transition-colors">Begin your journey</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {orders.map(order => {
            const product = products.find(p => p.id === order.productId);
            return (
              <div key={order.id} className="p-10 border border-black/5 bg-white hover:shadow-2xl hover:shadow-black/5 transition-all group">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">{order.id}</span>
                    <h3 className="display text-lg font-bold uppercase tracking-[0.1em] mt-2">{product?.name}</h3>
                  </div>
                  <span className={`display text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 border ${
                    order.status === 'Delivered' ? 'border-black/10 text-black/40' : 'border-blue-600/20 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-12 pb-8 border-b border-black/5">
                   <div>
                      <span className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Quantity</span>
                      <p className="display text-2xl font-bold mt-2">{order.quantity}</p>
                   </div>
                   <div className="text-right">
                      <span className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">Total</span>
                      <p className="display text-2xl font-bold mt-2">₹{(product?.price || 0) * order.quantity}</p>
                   </div>
                </div>

                <div className="flex space-x-8">
                  <button 
                    onClick={() => onTrackOrder(order)}
                    className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black border-b-2 border-black pb-2 hover:text-blue-600 hover:border-blue-600 transition-all"
                  >
                    Track
                  </button>
                  <button 
                    onClick={() => {
                      onTrackOrder(order);
                      setView('BILL');
                    }}
                    className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors"
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
