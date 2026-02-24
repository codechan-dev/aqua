
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

    // Schema Validation
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hardened Sanitization for all submitted data
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
    alert('Order Placed Successfully!\n\nNote: Payment will be collecting at place of delivery.');
    onSubmit(newOrder);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-[12px] border border-slate-200 shadow-md my-6 sm:my-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Finalize Delivery</h2>
        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          Delivery of <span className="text-blue-600 font-bold">{quantity}x {product.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-[12px] border border-red-100 flex items-center text-sm">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Receiver Name *</label>
            <input 
              type="text" 
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Pincode * (Chennai Only)</label>
            <input 
              type="number" 
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
              placeholder="600xxx"
              value={formData.pincode}
              onChange={e => setFormData({...formData, pincode: e.target.value.slice(0, 6)})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Area / Locality *</label>
          <input 
            type="text" 
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
            placeholder="e.g. Adyar, T. Nagar"
            value={formData.area}
            onChange={e => setFormData({...formData, area: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Street Address *</label>
          <textarea 
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-24 resize-none disabled:opacity-50"
            placeholder="Apt #, Landmark, Street"
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mobile Number *</label>
          <input 
            type="tel" 
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
            placeholder="10-digit number"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-[12px] border border-blue-100">
          <input 
            type="checkbox" 
            id="emptyCan"
            disabled={isSubmitting}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
            checked={formData.emptyCanProvided}
            onChange={e => setFormData({...formData, emptyCanProvided: e.target.checked})}
          />
          <label htmlFor="emptyCan" className="text-sm font-medium text-slate-700 cursor-pointer">
            I will provide an empty can for exchange *
          </label>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <button 
            type="button" 
            disabled={isSubmitting}
            onClick={onCancel}
            className="flex-1 px-6 py-4 border border-slate-200 rounded-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Go Back
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-[12px] font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95 disabled:opacity-80 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Order</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
