import React, { useState } from 'react';
import { X, Car, Bike, Users, Clock, MapPin, DollarSign, Plus, Check } from 'lucide-react';
import { Ride } from '../types/ride';

interface CreateRideModalProps {
  onClose: () => void;
  onRideCreated: (newRide: Ride) => void;
}

export const CreateRideModal: React.FC<CreateRideModalProps> = ({
  onClose,
  onRideCreated,
}) => {
  const [role, setRole] = useState<'driver' | 'rider'>('driver');
  const [vehicleType, setVehicleType] = useState<'car' | 'motorbike' | 'car7'>('car');
  const [pickup, setPickup] = useState('KTX Khu B, ĐHQG TP.HCM');
  const [destination, setDestination] = useState('Đại học Công nghệ Thông tin UIT');
  const [departureTime, setDepartureTime] = useState('07:30');
  const [totalSeats, setTotalSeats] = useState(4);
  const [availableSeats, setAvailableSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(15000);
  const [driverName, setDriverName] = useState('Nguyễn Văn Tuấn');
  const [licensePlate, setLicensePlate] = useState('51H-992.34');
  const [notes, setNotes] = useState('Xe sạch sẽ, cốp rộng, chạy an toàn.');

  const campusPresets = [
    'KTX Khu B, ĐHQG TP.HCM',
    'KTX Khu A, ĐHQG TP.HCM',
    'Đại học Công nghệ Thông tin UIT',
    'ĐH Bách Khoa TP.HCM (Cơ sở 2)',
    'ĐH Khoa học Tự nhiên (Cơ sở 2)',
    'ĐH Sư phạm Kỹ thuật HCMUTE',
    'Trạm Metro Bến xe Miền Đông Mới',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRide: Ride = {
      id: `ride-custom-${Date.now()}`,
      destination,
      destinationSub: 'Khuôn viên trường',
      pickup,
      pickupSub: 'Điểm hẹn đón sinh viên',
      departureTime,
      distanceKm: 8.5,
      durationMinutes: 25,
      vehicleType,
      driver: {
        id: `driver-${Date.now()}`,
        name: driverName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        totalTrips: 12,
        phone: '0938 777 666',
        vehicle: {
          type: vehicleType,
          model: vehicleType === 'car' ? 'Toyota Vios' : vehicleType === 'motorbike' ? 'Honda AirBlade' : 'Mitsubishi Xpander',
          licensePlate,
          color: 'Đỏ',
        },
      },
      totalSeats,
      bookedSeats: totalSeats - availableSeats,
      pricePerSeat,
      co2SavedKg: 1.5,
      costSavedPercent: 60,
      stops: [
        { id: 's1', name: pickup, detail: 'Điểm đón', time: departureTime, isPickup: true },
        { id: 's2', name: destination, detail: 'Điểm đến', time: '07:55', isDropoff: true },
      ],
      notes,
    };

    onRideCreated(newRide);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white">
          <div>
            <h2 className="text-base font-bold">Tạo chuyến đi chung</h2>
            <p className="text-xs text-rose-100">Chia sẻ ghế trống, tiết kiệm chi phí xăng xe</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 max-h-[70vh]">
          
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'driver' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Tôi có xe (Tài xế)
            </button>
            <button
              type="button"
              onClick={() => setRole('rider')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'rider' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Tôi cần tìm xe
            </button>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Phương tiện di chuyển</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'car', label: 'Ô tô 4 chỗ', icon: Car },
                { type: 'motorbike', label: 'Xe máy', icon: Bike },
                { type: 'car7', label: 'Ô tô 7 chỗ', icon: Car },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.type}
                    type="button"
                    onClick={() => {
                      setVehicleType(v.type as any);
                      if (v.type === 'motorbike') {
                        setTotalSeats(2);
                        setAvailableSeats(1);
                        setPricePerSeat(10000);
                      } else if (v.type === 'car7') {
                        setTotalSeats(7);
                        setAvailableSeats(5);
                        setPricePerSeat(25000);
                      } else {
                        setTotalSeats(4);
                        setAvailableSeats(3);
                        setPricePerSeat(15000);
                      }
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      vehicleType === v.type
                        ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px]">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pickup location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-red-600" />
              Điểm đón
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
            />
          </div>

          {/* Destination location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-red-600" />
              Điểm đến
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-400">Gợi ý địa điểm ĐHQG:</span>
            <div className="flex flex-wrap gap-1.5">
              {campusPresets.slice(0, 4).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDestination(p)}
                  className="text-[10px] bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Departure time & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-red-600" />
                Giờ khởi hành
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-red-600" />
                Giá chia sẻ / ghế
              </label>
              <input
                type="number"
                step="1000"
                value={pricePerSeat}
                onChange={(e) => setPricePerSeat(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
          </div>

          {/* Seats & Driver Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 mb-1 block">Tên tài xế</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 mb-1 block">Biển số xe</label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-mono uppercase"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-800 mb-1 block">Ghi chú chuyến đi</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Có cốp rộng, bật điều hòa, đúng giờ..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            <span>Đăng chuyến xe chung</span>
          </button>
        </form>

      </div>
    </div>
  );
};
