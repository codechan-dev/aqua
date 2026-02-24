
import React from 'react';
import { ViewState, User } from '../types';

interface HeaderProps {
  setView: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setView('HOME')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-[12px] flex items-center justify-center mr-3 transition-transform group-hover:scale-110 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 tracking-tight block leading-tight">AquaFlow</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hidden sm:block">Chennai Delivery</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            <button onClick={() => setView('HOME')} className="px-4 py-2 rounded-[12px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">Home</button>
            <button onClick={() => setView('SEARCH')} className="px-4 py-2 rounded-[12px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">Track</button>
            {currentUser && (
              <button onClick={() => setView('CLIENT_DASHBOARD')} className="px-4 py-2 rounded-[12px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">My Profile</button>
            )}
            {currentUser?.role === 'admin' && (
              <button onClick={() => setView('ADMIN_PANEL')} className="px-4 py-2 rounded-[12px] text-blue-700 bg-blue-50 font-bold transition-all ml-2">Admin Hub</button>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {!currentUser && (
              <button 
                onClick={() => setView('LOGIN')}
                className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-all mr-4 uppercase tracking-[0.2em] hidden lg:block"
              >
                Admin Portal
              </button>
            )}
            
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block px-2">
                  <p className="text-sm font-bold text-slate-900 leading-none">{currentUser.name}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-slate-100 text-slate-500 p-2 rounded-[12px] hover:text-red-600 transition-all hover:bg-red-50"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('LOGIN')}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-[12px] font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95 flex items-center space-x-2 text-sm sm:text-base"
              >
                <span>Login</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
