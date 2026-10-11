import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Car, 
  Bike, 
  Clock, 
  Users, 
  ChevronRight, 
  SlidersHorizontal, 
  Plus, 
  Sparkles,
  Leaf,
  Star,
  CheckCircle2
} from 'lucide-react';
import { Ride } from '../types/ride';

interface RideListScreenProps {
  rides: Ride[];
  onSelectRide: (ride: Ride) => void;
  onOpenCreateRide: () => void;
  activeTab: 'join' | 'offer';
  setActiveTab: (tab: 'join' | 'offer') => void;
}

export const RideListScreen: React.FC<RideListScreenProps> = ({
  rides,
  onSelectRide,
  onOpenCreateRide,
  activeTab,
  setActiveTab,
}) => {
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'car' | 'motorbike'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('KTX Khu B, ĐHQG TP.HCM');

  // Filter rides
  const filteredRides = rides.filter((r) => {
    if (vehicleFilter === 'car' && r.vehicleType !== 'car' && r.vehicleType !== 'car7') return false;
    if (vehicleFilter === 'motorbike' && r.vehicleType !== 'motorbike') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDest = r.destination.toLowerCase().includes(q);
      const matchPick = r.pickup.toLowerCase().includes(q);
      const matchDriver = r.driver.name.toLowerCase().includes(q);
      if (!matchDest && !matchPick && !matchDriver) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto pb-20">
      
      {/* Top Location Bar - Exact match to top of screenshot */}
      <div className="bg-white px-4 pt-3 pb-2.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Green/Red Online dot indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-bold text-red-600">Online:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[180px]">
              {currentLocation}
            </span>
          </div>
        </div>

        <button 
          onClick={onOpenCreateRide}
          className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
        >
          Tôi muốn...
        </button>
      </div>

      {/* Main Tab Switcher - Exactly matching screenshot: "Tham gia cùng" & "Đặt xe chung" */}
      <div className="bg-white px-4 pt-3 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('join')}
            className={`pb-2.5 text-sm font-bold relative transition-colors ${
              activeTab === 'join' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Tham gia cùng
            {activeTab === 'join' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('offer');
              onOpenCreateRide();
            }}
            className={`pb-2.5 text-sm font-semibold relative transition-colors ${
              activeTab === 'offer' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Đặt xe chung
            {activeTab === 'offer' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Filter Row - Matching "Hôm nay", "Ô tô", "Xe máy", time filters from background */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-100 space-y-2">
        {/* Quick search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm trường hoặc điểm đến (UIT, Bách Khoa...)"
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedDate(selectedDate === 'today' ? 'tomorrow' : 'today')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              selectedDate === 'today'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {selectedDate === 'today' ? 'Hôm nay' : 'Ngày mai'}
          </button>

          <button
            onClick={() => setVehicleFilter(vehicleFilter === 'car' ? 'all' : 'car')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap flex items-center gap-1 transition-all ${
              vehicleFilter === 'car'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Car className="h-3 w-3" />
            <span>Ô tô</span>
          </button>

          <button
            onClick={() => setVehicleFilter(vehicleFilter === 'motorbike' ? 'all' : 'motorbike')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap flex items-center gap-1 transition-all ${
              vehicleFilter === 'motorbike'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bike className="h-3 w-3" />
            <span>Xe máy</span>
          </button>

          <div className="px-2.5 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl whitespace-nowrap flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>07:00 - 08:30</span>
          </div>
        </div>
      </div>

      {/* Ride Counter & Sorting Banner - Exact match from screenshot */}
      <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-500">
        <span className="font-bold text-slate-900">
          {filteredRides.length} chuyến có tài xế
        </span>
        <span className="text-[11px] text-slate-500">
          Sắp xếp: Giờ khởi hành
        </span>
      </div>

      {/* Ride Cards List */}
      <div className="px-4 space-y-3 flex-1">
        {filteredRides.map((ride) => {
          const availableSeats = ride.totalSeats - ride.bookedSeats;
          const isScreenshotRide = ride.id === 'ride-uit-01';

          return (
            <div
              key={ride.id}
              onClick={() => onSelectRide(ride)}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md active:scale-[0.99] relative ${
                isScreenshotRide
                  ? 'border-red-500/40 ring-1 ring-red-500/20 shadow-sm'
                  : 'border-slate-100 shadow-xs'
              }`}
            >
              {/* Highlight badge for the hero ride */}
              {isScreenshotRide && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Chuyến đề xuất UIT</span>
                </div>
              )}

              {/* Destination & Pickup info */}
              <div className="mb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 leading-snug">
                    {ride.destination}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-red-600">
                      {ride.pricePerSeat.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-red-500" />
                  <span>Đón tại: {ride.pickup}</span>
                </p>
              </div>

              {/* Driver & vehicle line */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[11px] overflow-hidden">
                    <img 
                      src={ride.driver.avatar} 
                      alt="" 
                      className="h-full w-full object-cover" 
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <span>{ride.driver.name[0]}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 text-[11px] block leading-none">
                      {ride.driver.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {ride.driver.vehicle.licensePlate} · {ride.driver.rating} ★
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-[11px] font-bold text-slate-800">
                      {ride.departureTime}
                    </div>
                    <div className="text-[10px] font-semibold text-red-600">
                      Còn {availableSeats} chỗ
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredRides.length === 0 && (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Không tìm thấy chuyến xe</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Chưa có tài xế chạy tuyến này. Bạn có thể tự đăng chuyến hoặc thử tìm tuyến khác.
            </p>
            <button
              onClick={onOpenCreateRide}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Đăng chuyến đi của bạn
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button for Creating Ride */}
      <div className="fixed bottom-4 right-4 sm:hidden z-30">
        <button
          onClick={onOpenCreateRide}
          className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 flex items-center justify-center transition-all active:scale-95"
          title="Tạo chuyến xe chung"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

    </div>
  );
};
