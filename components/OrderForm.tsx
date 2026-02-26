
import React, { useState } from 'react';
import { Product, OrderData, OrderStatus } from '../types';
import { CHENNAI_PINCODE_PREFIX } from '../constants';
import { sanitizeInput, validateSchema } from '../utils/security';

interface OrderFormProps {
  product: Product;
  quantity: number;
  userId: string;
  onSubmit: (data: OrderData) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, quantity, userId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    pincode: '',
    area: '',
    address: '',
    phone: '',
    emptyCanProvided: false
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateSchema(formData, {
      name: { type: 'string', required: true, max: 50 },
      pincode: { type: 'string', required: true, max: 6 },
      area: { type: 'string', required: true, max: 50 },
      address: { type: 'string', required: true, max: 200 },
      phone: { type: 'string', required: true, max: 10 }
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('Pincode must be exactly 6 digits.');
      return;
    }

    if (!formData.pincode.startsWith(CHENNAI_PINCODE_PREFIX)) {
      setError('Sorry, we currently only deliver within Chennai.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    if (!formData.emptyCanProvided) {
      setError('Please confirm the empty can availability.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder: OrderData = {
      id: orderId,
      userId: userId,
      name: sanitizeInput(formData.name, 50),
      pincode: sanitizeInput(formData.pincode, 6),
      area: sanitizeInput(formData.area, 50),
      address: sanitizeInput(formData.address, 200),
      phone: sanitizeInput(formData.phone, 10),
      emptyCanProvided: formData.emptyCanProvided,
      quantity,
      productId: product.id,
      status: OrderStatus.PLACED,
      createdAt: new Date().toISOString()
    };

    setIsSubmitting(false);
    onSubmit(newOrder);
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <div className="display text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-8">Step 02 / Finalize</div>
          <h2 className="display text-5xl font-bold text-black tracking-tighter uppercase mb-12 leading-none">
            Delivery <br/>
            <span className="serif italic font-light lowercase tracking-normal text-black/40">Details.</span>
          </h2>
          <div className="p-8 bg-stone-100 border border-black/5">
             <div className="flex justify-between items-start mb-6">
                <h3 className="display text-sm font-bold uppercase tracking-[0.2em]">{product.name}</h3>
                <span className="display text-sm font-bold">₹{product.price * quantity}</span>
             </div>
             <div className="flex justify-between items-center text-[11px] text-black/40 uppercase tracking-[0.1em]">
                <span>Quantity</span>
                <span>{quantity} Units</span>
             </div>
          </div>
          <div className="mt-12">
             <button 
               onClick={onCancel}
               className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black/40 hover:text-black transition-colors"
             >
               ← Return to Selections
             </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="serif italic text-red-600 text-lg border-l-2 border-red-600 pl-4 py-2">
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="border-b border-black/10 pb-2">
              <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Full Name</label>
              <input 
                type="text" 
                required
                disabled={isSubmitting}
                className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10"
                placeholder="Enter your name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="border-b border-black/10 pb-2">
                <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Pincode</label>
                <input 
                  type="number" 
                  required
                  disabled={isSubmitting}
                  className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10"
                  placeholder="600xxx"
                  value={formData.pincode}
                  onChange={e => setFormData({...formData, pincode: e.target.value.slice(0, 6)})}
                />
              </div>
              <div className="border-b border-black/10 pb-2">
                <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Area</label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10"
                  placeholder="e.g. Adyar"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                />
              </div>
            </div>

            <div className="border-b border-black/10 pb-2">
              <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Address</label>
              <textarea 
                required
                disabled={isSubmitting}
                className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10 h-24 resize-none"
                placeholder="Street, Apartment, Landmark"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="border-b border-black/10 pb-2">
              <label className="display text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">Phone Number</label>
              <input 
                type="tel" 
                required
                disabled={isSubmitting}
                className="display w-full bg-transparent text-lg font-medium outline-none placeholder:text-black/10"
                placeholder="10-digit mobile"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
              />
            </div>

            <div className="flex items-start space-x-4 pt-4">
              <input 
                type="checkbox" 
                id="emptyCan"
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 accent-black"
                checked={formData.emptyCanProvided}
                onChange={e => setFormData({...formData, emptyCanProvided: e.target.checked})}
              />
              <label htmlFor="emptyCan" className="serif italic text-black/60 text-sm cursor-pointer">
                I confirm that an empty can will be provided for exchange at the time of delivery.
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="display w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] hover:bg-black/80 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
