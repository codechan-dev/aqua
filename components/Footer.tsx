
import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
  setView: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-white text-black py-24 sm:py-32 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-32">
          <div>
            <h2 className="display text-5xl font-bold tracking-tighter uppercase mb-12">AquaFlow</h2>
            <p className="serif text-2xl italic text-black/60 leading-relaxed max-w-md">
              Redefining hydration through advanced technology and an unwavering commitment to purity.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-8">Navigation</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setView('HOME')} className="display text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">Home</button></li>
                <li><button onClick={() => setView('SEARCH')} className="display text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">Track Status</button></li>
                <li><button onClick={() => setView('LOGIN')} className="display text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">Portal</button></li>
              </ul>
            </div>
            <div>
              <h4 className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 mb-8">Connect</h4>
              <ul className="space-y-4">
                <li className="display text-[11px] font-bold uppercase tracking-[0.2em]">Chennai, India</li>
                <li className="display text-[11px] font-bold uppercase tracking-[0.2em]">+91 98765 43210</li>
                <li className="display text-[11px] font-bold uppercase tracking-[0.2em] italic text-black/40">hello@aquaflow.com</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="relative pt-24 border-t border-black/5 overflow-hidden">
          <h1 className="display text-[clamp(80px,18vw,280px)] font-bold tracking-tighter uppercase leading-none text-black select-none text-center whitespace-nowrap">
            AquaFlow
          </h1>
          <div className="flex justify-between items-center mt-12">
            <p className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">© {new Date().getFullYear()} AquaFlow Chennai</p>
            <div className="flex space-x-8">
               <span className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 cursor-pointer hover:text-black transition-colors">Privacy</span>
               <span className="display text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 cursor-pointer hover:text-black transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
