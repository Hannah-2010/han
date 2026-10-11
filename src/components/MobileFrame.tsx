import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto w-full max-w-[420px] rounded-[48px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800 shadow-red-950/20">
      {/* Outer Phone Bezel */}
      <div className="relative flex flex-col h-[844px] max-h-[92vh] w-full overflow-hidden rounded-[40px] bg-white text-slate-900 select-none">
        
        {/* Dynamic Island / Notch + Status Bar */}
        <div className="relative z-50 flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold">
          <span className="text-[13px] tracking-tight">07:28</span>

          {/* Pill camera island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 h-4 w-24 rounded-full bg-slate-950 flex items-center justify-end pr-2">
            <div className="h-2 w-2 rounded-full bg-red-900/60 ring-1 ring-red-500/30"></div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryMedium className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative flex-1 overflow-hidden flex flex-col">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="relative z-50 flex justify-center py-2 bg-transparent pointer-events-none">
          <div className="h-1 w-32 rounded-full bg-slate-900/40"></div>
        </div>
      </div>
    </div>
  );
};
