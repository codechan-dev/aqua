
import React from 'react';
import { ViewState, User } from '../types';

interface HeaderProps {
  setView: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-center h-24 sm:h-32">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setView('HOME')}
          >
            <div className="flex flex-col">
              <span className="display text-2xl font-bold text-black tracking-tighter uppercase leading-none">AquaFlow</span>
              <span className="display text-[9px] font-bold text-black/40 uppercase tracking-[0.4em] mt-1">Chennai • Purity</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <button onClick={() => setView('HOME')} className="display text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors">Home</button>
            <button onClick={() => setView('SEARCH')} className="display text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors">Track</button>
            {currentUser && (
              <button onClick={() => setView('CLIENT_DASHBOARD')} className="display text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors">Profile</button>
            )}
            {currentUser?.role === 'admin' && (
              <button onClick={() => setView('ADMIN_PANEL')} className="display text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Admin Hub</button>
            )}
          </nav>

          <div className="flex items-center space-x-8">
            {currentUser ? (
              <div className="flex items-center space-x-6">
                <span className="display text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 hidden sm:block">{currentUser.name}</span>
                <button 
                  onClick={onLogout}
                  className="text-black/40 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('LOGIN')}
                className="display text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-black/20 pb-1 hover:border-black transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
