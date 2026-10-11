import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Leaf, 
  ArrowRight, 
  Map, 
  Star,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { Ride } from '../types/ride';

interface RideDetailSheetProps {
  ride: Ride;
  onBack: () => void;
  onViewRoute: () => void;
  onJoinRide: () => void;
  onShare?: () => void;
}

export const RideDetailSheet: React.FC<RideDetailSheetProps> = ({
  ride,
  onBack,
  onViewRoute,
  onJoinRide,
  onShare,
}) => {
  const availableSeats = ride.totalSeats - ride.bookedSeats;

  // Format currency
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(ride.pricePerSeat).replace('₫', 'đ');

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto pb-24">
      {/* Red Gradient Top Header - Exactly matching user screenshot styling with Red Color Theme */}
      <div className="relative bg-gradient-to-br from-red-700 via-rose-600 to-red-500 pt-5 pb-9 px-4 text-white shadow-md">
        {/* Soft background glow accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white blur-2xl"></div>
          <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-rose-900 blur-xl"></div>
        </div>

        {/* Top Navigation Row */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeft className="h-5 w-5 text-slate-800" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 active:scale-95 transition-all"
                title="Chia sẻ chuyến đi"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={onViewRoute}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-950/80 hover:bg-red-950 text-white text-xs font-semibold backdrop-blur-md border border-red-300/20 shadow-sm active:scale-95 transition-all"
            >
              <Map className="h-3.5 w-3.5" />
              <span>Xem lộ trình</span>
            </button>
          </div>
        </div>

        {/* Destination Title & Subtitle */}
        <div className="relative z-10 px-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm leading-snug">
            {ride.destination}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-rose-100 mt-1 flex items-center gap-1">
            <span>Điểm đến</span>
            {ride.destinationSub && (
              <span className="text-rose-200/80 font-normal">· {ride.destinationSub}</span>
            )}
          </p>
        </div>
      </div>

      {/* Main Content Sheet with rounded top */}
      <div className="relative -mt-4 z-20 rounded-t-[28px] bg-slate-50 px-4 pt-5 pb-6 space-y-3.5 flex-1 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
        
        {/* Card 1: Driver & Trip Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 space-y-3.5">
          {/* Driver row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="h-11 w-11 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 font-bold overflow-hidden shadow-sm">
                <img 
                  src={ride.driver.avatar} 
                  alt={ride.driver.name} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to initial
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-sm font-bold text-red-600">
                  {ride.driver.name.slice(0, 2)}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-red-600 text-white rounded-full p-0.5 ring-2 ring-white">
                <ShieldCheck className="h-2.5 w-2.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 truncate">
                  {ride.driver.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <span>{ride.driver.vehicle.model || 'Ô tô 4 chỗ'}</span>
                <span>·</span>
                <span className="font-mono text-slate-600">{ride.driver.vehicle.licensePlate}</span>
                <span>·</span>
                <span className="inline-flex items-center text-amber-500 font-semibold">
                  {ride.driver.rating} <Star className="h-3 w-3 fill-amber-400 text-amber-400 ml-0.5" />
                </span>
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100"></div>

          {/* Departure & ETA row */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 mt-0.5">
              <Clock className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Khởi hành: {ride.departureTime}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {ride.distanceKm} km · ~{ride.durationMinutes} phút
              </div>
            </div>
          </div>

          {/* Passenger count row */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
              <Users className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>{ride.bookedSeats}/{ride.totalSeats} người tham gia</span>
                <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                  {availableSeats > 0 ? `Còn ${availableSeats} chỗ trống` : 'Hết chỗ'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {availableSeats > 0 ? `Còn ${availableSeats} ghế trống` : 'Đã đủ thành viên'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Lộ trình chi tiết (Detailed Route) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-slate-900">
              Lộ trình chi tiết
            </h3>
            <button
              onClick={onViewRoute}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Bản đồ
            </button>
          </div>

          <div className="relative pl-6 space-y-4">
            {/* Vertical connector line */}
            <div className="absolute left-[7px] top-2 bottom-3 w-[2px] bg-gradient-to-b from-red-600 via-rose-300 to-red-600"></div>

            {/* Pickup Stop */}
            <div className="relative">
              {/* Pickup Red Dot */}
              <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-red-600 ring-4 ring-red-100"></div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Điểm đón
                </span>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {ride.pickup}
                </p>
                {ride.pickupSub && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ride.pickupSub}
                  </p>
                )}
              </div>
            </div>

            {/* Intermediate stops if available */}
            {ride.stops && ride.stops.length > 2 && (
              <div className="py-0.5 pl-0.5">
                <div className="text-[11px] text-slate-400 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-100 inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  Qua {ride.stops.length - 2} trạm dừng phụ (ĐHQG & Suối Tiên)
                </div>
              </div>
            )}

            {/* Destination Stop */}
            <div className="relative">
              {/* Destination Red Ring/Pin Dot */}
              <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-red-600 ring-4 ring-red-100 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Điểm đến
                </span>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {ride.destination}
                </p>
                {ride.destinationSub && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ride.destinationSub}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Eco & Cost Savings - Rose/Red tinted green impact */}
        <div className="rounded-2xl p-3.5 bg-rose-50/80 border border-rose-200/70 text-slate-800 flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Leaf className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-xs leading-relaxed text-rose-950 font-medium">
            Ghép chuyến này giúp giảm <strong className="font-bold text-red-700">~{ride.co2SavedKg} kg CO₂</strong> và tiết kiệm <strong className="font-bold text-red-700">{ride.costSavedPercent}%</strong> chi phí di chuyển.
          </div>
        </div>

        {/* Notes from driver */}
        {ride.notes && (
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block mb-1">Lời nhắn từ tài xế:</span>
            <p className="italic leading-relaxed">"{ride.notes}"</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar - Exact match from user screenshot with Red Theme */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div>
          <span className="text-[11px] font-medium text-slate-500 block">
            Chi phí chia sẻ
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-red-600 tracking-tight">
            {formattedPrice}
          </div>
        </div>

        <button
          onClick={onJoinRide}
          disabled={availableSeats <= 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 ${
            availableSeats > 0
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{availableSeats > 0 ? 'Tham gia ngay' : 'Đã hết chỗ'}</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
