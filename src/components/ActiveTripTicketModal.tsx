import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Car, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { Ride, Booking } from '../types/ride';

interface ActiveTripTicketModalProps {
  ride: Ride;
  booking: Booking;
  onClose: () => void;
  onOpenChat: () => void;
  onOpenMap: () => void;
  onCancelBooking: () => void;
}

export const ActiveTripTicketModal: React.FC<ActiveTripTicketModalProps> = ({
  ride,
  booking,
  onClose,
  onOpenChat,
  onOpenMap,
  onCancelBooking,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(booking.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    alert(`Đang kết nối cuộc gọi đến tài xế ${ride.driver.name} qua hotline: ${ride.driver.phone}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 pb-6">
        
        {/* Ticket Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-t-[32px] sm:rounded-t-3xl relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
              Vé Ghép Chuyến
            </span>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl font-bold leading-tight">{ride.destination}</h2>
          <p className="text-xs text-rose-100 mt-0.5">Khởi hành lúc {ride.departureTime} hôm nay</p>

          {/* Status Tracker Pill */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="text-xs">
              <span className="font-bold block">Tài xế đang đến điểm đón</span>
              <span className="text-[11px] text-rose-100">Khoảng 4 phút nữa xe có mặt trước KTX</span>
            </div>
          </div>
        </div>

        {/* Ticket Body with perforated style */}
        <div className="p-5 space-y-4">
          
          {/* Driver Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src={ride.driver.avatar}
                alt={ride.driver.name}
                className="h-11 w-11 rounded-full object-cover border border-red-200"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900">{ride.driver.name}</h3>
                <p className="text-[11px] text-slate-500">{ride.driver.vehicle.model}</p>
                <p className="text-xs font-mono font-bold text-red-600">{ride.driver.vehicle.licensePlate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCall}
                className="h-9 w-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                title="Gọi điện cho tài xế"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={onOpenChat}
                className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-600/30 transition-colors"
                title="Nhắn tin với tài xế"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* QR Code Check-in Verification Box */}
          <div className="bg-gradient-to-b from-red-50/60 to-white rounded-2xl p-4 border border-red-100 text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              MÃ CHECK-IN LÊN XE
            </span>

            {/* Stylized Simulated QR Matrix */}
            <div className="mx-auto w-36 h-36 bg-white p-3 rounded-2xl border-2 border-red-500 shadow-sm flex flex-col items-center justify-center relative">
              <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-1 p-1">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isCorner = 
                    (i < 8 && (i % 6 < 2)) || 
                    (i > 27 && (i % 6 < 2)) || 
                    (i < 8 && (i % 6 > 3));
                  const isBlack = isCorner || (i * 7 + 3) % 5 > 1;
                  return (
                    <div
                      key={i}
                      className={`rounded-xs ${isBlack ? 'bg-slate-900' : 'bg-transparent'}`}
                    ></div>
                  );
                })}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-7 w-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white">
                  UIT
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-xs font-mono font-bold text-slate-800">
                Mã vé: {booking.bookingId}
              </span>
              <button
                onClick={handleCopyCode}
                className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Đưa mã QR cho tài xế quét hoặc đọc mã vé khi lên xe
            </p>
          </div>

          {/* Route & Passenger Detail */}
          <div className="bg-slate-50 rounded-2xl p-3.5 text-xs space-y-2.5 border border-slate-100">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Điểm đón: </span>
                <span className="text-slate-600">{ride.pickup}</span>
                <p className="text-[11px] text-slate-500 italic mt-0.5 font-medium">"{booking.pickupNote}"</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Điểm đến: </span>
                <span className="text-slate-600">{ride.destination}</span>
              </div>
            </div>

            <div className="h-[1px] bg-slate-200 my-1"></div>

            <div className="flex justify-between text-slate-600">
              <span>Hành khách: {booking.passengerName}</span>
              <span>{booking.seatsBooked} ghế</span>
            </div>

            <div className="flex justify-between font-bold text-slate-900">
              <span>Đã thanh toán ({booking.paymentMethod.toUpperCase()}):</span>
              <span className="text-red-600">{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Buttons row */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onOpenMap}
              className="flex-1 py-3 px-4 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              <span>Xem lộ trình trực tiếp</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn hủy chuyến đi này không?')) {
                  onCancelBooking();
                }
              }}
              className="py-3 px-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Hủy chuyến
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
