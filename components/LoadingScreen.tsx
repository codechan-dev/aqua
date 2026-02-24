
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tighter overflow-hidden border-r-2 border-blue-600 whitespace-nowrap animate-typing">
          AquaFlow.
        </h1>
      </div>
      <style>{`
        .animate-typing {
          width: 0;
          animation: 
            typing 1.2s steps(10, end) forwards,
            blink-caret 0.75s step-end infinite;
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #2563eb }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
