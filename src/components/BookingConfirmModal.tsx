import React, { useState } from 'react';
import { 
  X, 
  Users, 
  MapPin, 
  CreditCard, 
  Ticket, 
  Check, 
  Clock, 
  ShieldCheck,
  Tag,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Ride, Booking } from '../types/ride';

interface BookingConfirmModalProps {
  ride: Ride;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  ride,
  onClose,
  onBookingSuccess,
}) => {
  const [seats, setSeats] = useState(1);
  const [pickupNote, setPickupNote] = useState('Đứng đợi trước sảnh BA4 KTX Khu B');
  const [passengerName, setPassengerName] = useState('Nguyễn Bảo Hân');
  const [passengerPhone, setPassengerPhone] = useState('0909 888 777');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'vietqr'>('momo');
  const [couponCode, setCouponCode] = useState('SINHVIENUIT');
  const [isCouponApplied, setIsCouponApplied] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSeats = ride.totalSeats - ride.bookedSeats;
  const basePrice = ride.pricePerSeat * seats;
  const discountAmount = isCouponApplied ? 5000 : 0;
  const totalPrice = Math.max(0, basePrice - discountAmount);

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(totalPrice).replace('₫', 'đ');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SINHVIENUIT' || couponCode.trim().toUpperCase() === 'DIXECHUNG') {
      setIsCouponApplied(true);
    } else {
      setIsCouponApplied(false);
      alert('Mã ưu đãi không hợp lệ. Hãy thử mã "SINHVIENUIT"');
    }
  };

  const handleConfirm = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Fire confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#E11D48', '#EF4444', '#FCA5A5', '#10B981'],
      });

      const newBooking: Booking = {
        bookingId: `BK-${Date.now().toString().slice(-6)}`,
        rideId: ride.id,
        seatsBooked: seats,
        totalPrice,
        passengerName,
        passengerPhone,
        pickupNote,
        paymentMethod,
        bookingTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed',
        qrCode: `RIDE-${ride.id}-SEAT-${seats}`,
      };

      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-red-600 to-rose-600 text-white">
          <div>
            <h2 className="text-base font-bold">Xác nhận ghép chuyến</h2>
            <p className="text-xs text-rose-100">Cùng {ride.driver.name} · {ride.departureTime}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-5 space-y-4 max-h-[70vh]">
          
          {/* Seat selection */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-red-600" />
                Số lượng ghế cần ghép
              </span>
              <span className="text-[11px] text-red-600 font-semibold">
                Còn {availableSeats} ghế
              </span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => {
                const disabled = num > availableSeats;
                return (
                  <button
                    key={num}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSeats(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      seats === num
                        ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300'
                        : disabled
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300'
                    }`}
                  >
                    {num} ghế
                  </button>
                );
              })}
            </div>
          </div>

          {/* Passenger details */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800">Thông tin người đi</div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-500 mb-1 block">Họ và tên</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 mb-1 block">Số điện thoại</label>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 mb-1 block">Ghi chú điểm đón cho tài xế</label>
              <input
                type="text"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                placeholder="VD: Đứng ở cổng BA4, mặc áo khoác đỏ..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          {/* Coupon Code */}
          <div className="bg-red-50/50 rounded-2xl p-3 border border-red-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-red-600" />
                Mã ưu đãi sinh viên
              </span>
              {isCouponApplied && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  -5.000đ
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã (SINHVIENUIT)"
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">Phương thức thanh toán</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'momo', label: 'Ví MoMo', icon: 'M' },
                { id: 'vietqr', label: 'VietQR Chuyển khoản', icon: 'QR' },
                { id: 'cash', label: 'Tiền mặt khi lên xe', icon: '💵' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-red-600 bg-red-50/60 ring-1 ring-red-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 mb-0.5">{m.icon}</div>
                  <div className="text-[10px] font-medium text-slate-600 truncate">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs border border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Đơn giá ghép ({seats} ghế)</span>
              <span>{(ride.pricePerSeat * seats).toLocaleString('vi-VN')}đ</span>
            </div>
            {isCouponApplied && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Ưu đãi sinh viên UIT</span>
                <span>-5.000đ</span>
              </div>
            )}
            <div className="h-[1px] bg-slate-200/80 my-1"></div>
            <div className="flex justify-between font-bold text-slate-900 text-sm">
              <span>Tổng thanh toán</span>
              <span className="text-red-600 font-extrabold">{formattedTotal}</span>
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-500 block">Thanh toán</span>
            <span className="text-lg font-black text-red-600">{formattedTotal}</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <>
                <Check className="h-4 w-4" strokeWidth={3} />
                <span>Xác nhận ghép xe ngay</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
