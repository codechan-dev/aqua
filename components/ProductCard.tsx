
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOrder }) => {
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-[12px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-video sm:h-56 bg-slate-50 flex items-center justify-center overflow-hidden">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-blue-50 animate-pulse flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            if (!imgError) {
              setImgError(true);
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548919973-5cdf5916ad52?auto=format&fit=crop&q=80&w=600';
            }
          }}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-[12px] text-[10px] font-bold uppercase tracking-wider shadow-sm">
          In Stock
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{product.name}</h3>
        <p className="text-slate-500 text-xs mb-4 flex-grow line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
             <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
          </div>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-[12px] border border-slate-200">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-[8px] text-slate-800 font-bold shadow-sm active:scale-90 hover:bg-blue-50 transition-all"
            >
              -
            </button>
            <span className="w-8 text-center text-slate-800 font-bold text-sm">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-[8px] text-slate-800 font-bold shadow-sm active:scale-90 hover:bg-blue-50 transition-all"
            >
              +
            </button>
          </div>
        </div>

        <button 
          onClick={() => onOrder(product, quantity)}
          className="w-full bg-blue-600 text-white py-3 rounded-[12px] font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-sm"
        >
          <span>Order Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
