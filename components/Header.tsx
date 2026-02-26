
import React from 'react';
import { ViewState, User } from '../types';

interface HeaderProps {
  setView: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
  isTransparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout, isTransparent }) => {
  const textColor = isTransparent ? 'text-white' : 'text-black';
  const mutedColor = isTransparent ? 'text-white/60' : 'text-black/60';
  const borderColor = isTransparent ? 'border-white/10' : 'border-black/5';
  const bgColor = isTransparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md';

  return (
    <header className={`${isTransparent ? 'absolute' : 'sticky'} top-0 left-0 right-0 z-50 ${bgColor} border-b ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-12">
        <div className="flex justify-between items-center h-16 sm:h-24">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setView('HOME')}
          >
            <div className="flex flex-col">
              <span className={`display text-xl sm:text-2xl font-bold ${textColor} tracking-tighter uppercase leading-none`}>AquaFlow</span>
              <span className={`display text-[8px] sm:text-[9px] font-bold ${isTransparent ? 'text-white/40' : 'text-black/40'} uppercase tracking-[0.4em] mt-1 sm:mt-2`}>Chennai • Purity</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-12">
            <button onClick={() => setView('HOME')} className={`display text-[11px] font-bold uppercase tracking-[0.2em] ${mutedColor} hover:${textColor} transition-colors`}>Home</button>
            <button onClick={() => setView('SEARCH')} className={`display text-[11px] font-bold uppercase tracking-[0.2em] ${mutedColor} hover:${textColor} transition-colors`}>Track</button>
            {currentUser && (
              <button onClick={() => setView('CLIENT_DASHBOARD')} className={`display text-[11px] font-bold uppercase tracking-[0.2em] ${mutedColor} hover:${textColor} transition-colors`}>Profile</button>
            )}
            {currentUser?.role === 'admin' && (
              <button onClick={() => setView('ADMIN_PANEL')} className="display text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Admin Hub</button>
            )}
          </nav>

          <div className="flex items-center space-x-8">
            {currentUser ? (
              <div className="flex items-center space-x-6">
                <span className={`display text-[11px] font-bold uppercase tracking-[0.1em] ${isTransparent ? 'text-white/40' : 'text-black/40'} hidden sm:block`}>{currentUser.name}</span>
                <button 
                  onClick={onLogout}
                  className={`${isTransparent ? 'text-white/40' : 'text-black/40'} hover:text-red-600 transition-colors`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('LOGIN')}
                className={`display text-[11px] font-bold uppercase tracking-[0.2em] ${textColor} border-b ${isTransparent ? 'border-white/20' : 'border-black/20'} pb-1 ${isTransparent ? 'hover:border-white' : 'hover:border-black'} transition-all`}
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
