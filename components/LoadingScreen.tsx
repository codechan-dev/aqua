
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-stone-50 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center">
        <h1 className="display text-4xl font-bold text-black tracking-tighter uppercase animate-pulse">
          AquaFlow.
        </h1>
        <p className="display text-[10px] font-bold uppercase tracking-[0.4em] mt-4 text-black/20">Chennai • Purity</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
