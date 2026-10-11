import React, { useState, useEffect } from 'react';
import { 
  X, 
  Navigation, 
  MapPin, 
  Clock, 
  Compass, 
  Car, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { Ride } from '../types/ride';

interface RouteMapModalProps {
  ride: Ride;
  onClose: () => void;
  onJoinRide: () => void;
}

export const RouteMapModal: React.FC<RouteMapModalProps> = ({
  ride,
  onClose,
  onJoinRide,
}) => {
  const [carProgress, setCarProgress] = useState(25);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [isPlaying, setIsPlaying] = useState(true);

  // Animate car moving along route
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCarProgress((prev) => (prev >= 90 ? 15 : prev + 1));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg h-[92vh] max-h-[750px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Top Header */}
        <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Navigation className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Lộ trình chi tiết
              </h2>
              <p className="text-[11px] text-slate-500">
                {ride.distanceKm} km · Khoảng {ride.durationMinutes} phút
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Map Style toggle */}
            <button
              onClick={() => setMapStyle(mapStyle === 'streets' ? 'satellite' : 'streets')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 text-xs transition-colors"
              title="Đổi kiểu bản đồ"
            >
              <Layers className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Visual Map Area */}
        <div className={`relative flex-1 overflow-hidden ${mapStyle === 'satellite' ? 'bg-slate-900' : 'bg-slate-100'}`}>
          {/* Stylized Vector Map Graphic */}
          <svg className="w-full h-full" viewBox="0 0 400 350" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#DC2626" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Background grid / campus layout */}
            {mapStyle === 'streets' ? (
              <>
                {/* Park / Campus Lake (Hồ Đá ĐHQG) */}
                <path d="M 220 80 Q 280 60 300 120 T 240 180 Z" fill="#BAE6FD" opacity="0.6" />
                <text x="235" y="125" fill="#0284C7" fontSize="10" fontWeight="bold">Hồ Đá ĐHQG</text>

                {/* Campus Greenery Zones */}
                <rect x="30" y="20" width="130" height="90" rx="16" fill="#DCFCE7" opacity="0.5" />
                <text x="45" y="60" fill="#15803D" fontSize="9" fontWeight="medium">Khu KTX Khu B</text>

                <rect x="230" y="210" width="140" height="100" rx="16" fill="#DCFCE7" opacity="0.5" />
                <text x="245" y="260" fill="#15803D" fontSize="9" fontWeight="medium">Khu ĐH CNTT (UIT)</text>

                {/* Secondary roads */}
                <path d="M 0 100 L 400 120" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
                <path d="M 120 0 L 140 350" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
                <path d="M 0 240 L 400 220" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                <path d="M 270 0 L 290 350" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
                
                {/* Metro Line 1 Suối Tiên */}
                <path d="M 20 310 L 380 290" stroke="#059669" strokeWidth="3" strokeDasharray="6,4" />
                <text x="30" y="325" fill="#047857" fontSize="8" fontWeight="bold">Tuyến Metro Số 1 (Bến Thành - Suối Tiên)</text>
              </>
            ) : (
              <>
                {/* Satellite textured lines */}
                <rect width="400" height="350" fill="#0F172A" />
                <path d="M 220 80 Q 280 60 300 120 T 240 180 Z" fill="#0369A1" opacity="0.4" />
                <path d="M 0 100 L 400 120" stroke="#334155" strokeWidth="6" />
                <path d="M 120 0 L 140 350" stroke="#334155" strokeWidth="6" />
                <path d="M 0 240 L 400 220" stroke="#334155" strokeWidth="8" />
              </>
            )}

            {/* Primary Main Route Track (Red Ribbon) */}
            {/* Route from KTX Khu B (x: 80, y: 70) through campus waypoints to UIT (x: 310, y: 270) */}
            <path
              id="mainPath"
              d="M 80 70 L 130 95 Q 160 110 180 150 L 205 195 Q 230 230 260 245 L 310 270"
              fill="none"
              stroke="#FCA5A5"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <path
              d="M 80 70 L 130 95 Q 160 110 180 150 L 205 195 Q 230 230 260 245 L 310 270"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow)"
            />

            {/* Waypoint 1: Pickup Point */}
            <g transform="translate(80, 70)">
              <circle r="14" fill="#DC2626" fillOpacity="0.2" className="animate-ping" />
              <circle r="9" fill="#DC2626" />
              <circle r="4" fill="#FFFFFF" />
            </g>

            {/* Waypoint 2: Intermediate stop (Ngã tư Quốc Phòng) */}
            <g transform="translate(180, 150)">
              <circle r="6" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.5" />
            </g>

            {/* Waypoint 3: Intermediate stop (Suối Tiên) */}
            <g transform="translate(260, 245)">
              <circle r="6" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.5" />
            </g>

            {/* Waypoint 4: Destination Dropoff (UIT) */}
            <g transform="translate(310, 270)">
              <circle r="16" fill="#DC2626" fillOpacity="0.25" />
              <circle r="10" fill="#DC2626" />
              <circle r="5" fill="#FFFFFF" />
            </g>
          </svg>

          {/* Animated moving vehicle indicator overlay */}
          <div 
            className="absolute z-10 flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 text-white shadow-xl ring-2 ring-red-500 transition-all duration-300 pointer-events-none"
            style={{
              left: `${20 + carProgress * 0.7}%`,
              top: `${20 + carProgress * 0.65}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Car className="h-4 w-4 text-red-400" />
          </div>

          {/* Floating Map Badges */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Giao thông thông thoáng</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/60 flex items-center gap-1 text-[11px] font-medium text-slate-700">
            <Clock className="h-3.5 w-3.5 text-red-600" />
            <span>Đến khoảng 08:05</span>
          </div>
        </div>

        {/* Turn-by-Turn Waypoints list */}
        <div className="p-4 bg-white border-t border-slate-100 max-h-56 overflow-y-auto space-y-3">
          <h3 className="text-xs font-bold text-slate-900 tracking-wider">
            CÁC TRẠM DỪNG TRÊN TUYẾN ĐƯỜNG
          </h3>

          <div className="space-y-2.5">
            {ride.stops.map((stop, idx) => (
              <div key={stop.id} className="flex items-start gap-2.5 text-xs">
                <div className="flex flex-col items-center mt-0.5">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    stop.isPickup 
                      ? 'bg-red-600 text-white' 
                      : stop.isDropoff 
                      ? 'bg-red-700 text-white' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {idx + 1}
                  </div>
                  {idx < ride.stops.length - 1 && (
                    <div className="w-[1.5px] h-5 bg-slate-200 my-0.5"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate">
                      {stop.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 ml-2">
                      {stop.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {stop.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Đóng bản đồ
          </button>
          <button
            onClick={() => {
              onClose();
              onJoinRide();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Tham gia chuyến</span>
          </button>
        </div>

      </div>
    </div>
  );
};
