
import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
  setView: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-[8px] flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AquaFlow</span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium water delivery in Chennai. Purified, mineral enriched, and reliable supply for your home and office.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => setView('HOME')} className="hover:text-blue-500 transition-colors">Start Order</button></li>
              <li><button onClick={() => setView('ABOUT')} className="hover:text-blue-500 transition-colors">About AquaFlow</button></li>
              <li><button onClick={() => setView('TERMS')} className="hover:text-blue-500 transition-colors">Terms of Service</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Delivery Areas</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Chennai, TN, India
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-[12px] text-center">
          <p>© {new Date().getFullYear()} AquaFlow Chennai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
