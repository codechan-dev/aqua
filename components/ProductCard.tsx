
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOrder }) => {
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="luxury-card group flex flex-col h-full bg-white border border-black/5">
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse" />
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            setImgLoaded(true);
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/waterfallback/800/800';
          }}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <p className="text-white text-[10px] uppercase tracking-[0.2em] font-bold">Premium Selection</p>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="display text-2xl font-bold text-black leading-tight tracking-tight uppercase">{product.name}</h3>
          <span className="display text-xl font-light text-black/40">0{product.id.replace('p', '')}</span>
        </div>
        
        <p className="serif text-lg text-black/60 mb-8 flex-grow leading-relaxed italic">{product.description}</p>
        
        <div className="flex items-end justify-between pt-6 border-t border-black/5">
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-1">Investment</span>
             <span className="display text-3xl font-bold text-black">₹{product.price}</span>
          </div>
          
          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-4 border-b border-black/10 pb-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-black/40 hover:text-black transition-colors text-lg"
              >
                —
              </button>
              <span className="display font-bold text-sm w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-black/40 hover:text-black transition-colors text-lg"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={() => onOrder(product, quantity)}
              className="display text-[11px] font-bold uppercase tracking-[0.3em] text-black hover:text-blue-600 transition-colors flex items-center space-x-2"
            >
              <span>Initiate Order</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
