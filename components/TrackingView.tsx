
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
    { label: OrderStatus.PLACED, desc: 'Request Received' },
    { label: OrderStatus.CONFIRMED, desc: 'Order Confirmed' },
    { label: OrderStatus.OUT_FOR_DELIVERY, desc: 'Out for Delivery' },
    { label: OrderStatus.DELIVERED, desc: 'Delivery Completed' }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.label === order.status);

  return (
    <div className="max-w-5xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-1">
          <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Status Tracking</div>
          <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-8 leading-none">
            Order <br/>
            <span className="serif italic font-light lowercase tracking-normal text-black/40">{order.id.split('-')[1]}</span>
          </h2>
          <p className="serif text-xl italic text-black/60 mb-12">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          
          <div className="space-y-12">
            {statuses.map((s, idx) => (
              <div key={s.label} className="flex items-start space-x-6 relative">
                {idx < statuses.length - 1 && (
                  <div className={`absolute left-[7px] top-6 w-[1px] h-12 ${idx < currentStatusIndex ? 'bg-black' : 'bg-black/10'}`}></div>
                )}
                <div className={`w-4 h-4 rounded-full mt-1.5 border-2 ${
                  idx <= currentStatusIndex ? 'bg-black border-black' : 'bg-transparent border-black/10'
                }`}></div>
                <div>
                  <h4 className={`display text-[11px] font-bold uppercase tracking-[0.2em] ${idx <= currentStatusIndex ? 'text-black' : 'text-black/20'}`}>
                    {s.label}
                  </h4>
                  <p className={`serif italic text-sm ${idx <= currentStatusIndex ? 'text-black/60' : 'text-black/10'}`}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24">
             <button 
               onClick={onClose}
               className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black border-b-2 border-black pb-2 hover:text-blue-600 hover:border-blue-600 transition-all"
             >
               Back to Dashboard
             </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.3em]">Order Summary</h4>
              <div className="p-8 bg-stone-100 border border-black/5">
                <div className="flex items-center space-x-8">
                  <div className="w-24 h-24 bg-white p-4 border border-black/5 overflow-hidden">
                    <img 
                      src={product?.image} 
                      className="w-full h-full object-contain mix-blend-multiply" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548919973-5cdf5916ad52?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="display text-sm font-bold uppercase tracking-[0.1em]">{product?.name}</h5>
                    <p className="serif italic text-black/40 text-sm mt-2">{order.quantity} Units</p>
                    <p className="display text-lg font-bold mt-4">₹{(product?.price || 0) * order.quantity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.3em]">Delivery Address</h4>
              <div className="p-8 bg-stone-100 border border-black/5">
                <p className="display text-sm font-bold uppercase tracking-[0.1em] mb-4">{order.name}</p>
                <p className="serif italic text-black/60 text-sm leading-relaxed">
                  {order.address}<br/>
                  {order.area}, Chennai - {order.pincode}<br/>
                  <span className="display text-[10px] font-bold uppercase tracking-[0.2em] mt-4 block text-black/40">Contact: +91 {order.phone}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-12 border border-black/5 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 -mr-16 -mt-16 rounded-full"></div>
             <h4 className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.3em] mb-8">Service Guarantee</h4>
             <p className="serif text-2xl italic text-black/80 leading-relaxed">
               "Our commitment to purity extends beyond the water itself. We ensure a seamless, professional delivery experience that respects your time and your home."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
