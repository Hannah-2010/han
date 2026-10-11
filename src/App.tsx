import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  Share2, 
  Car, 
  Sparkles,
  Ticket,
  MapPin,
  Check
} from 'lucide-react';
import { INITIAL_RIDES } from './data/mockRides';
import { Ride, Booking } from './types/ride';
import { MobileFrame } from './components/MobileFrame';
import { RideDetailSheet } from './components/RideDetailSheet';
import { RideListScreen } from './components/RideListScreen';
import { RouteMapModal } from './components/RouteMapModal';
import { BookingConfirmModal } from './components/BookingConfirmModal';
import { ActiveTripTicketModal } from './components/ActiveTripTicketModal';
import { DriverChatModal } from './components/DriverChatModal';
import { CreateRideModal } from './components/CreateRideModal';

export default function App() {
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  // Default to the exact ride from the user screenshot
  const [selectedRide, setSelectedRide] = useState<Ride | null>(INITIAL_RIDES[0]);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'join' | 'offer'>('join');

  // Modals
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showActiveTicket, setShowActiveTicket] = useState(false);
  const [showDriverChat, setShowDriverChat] = useState(false);
  const [showCreateRide, setShowCreateRide] = useState(false);

  // Active user booking
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setCurrentBooking(booking);
    setShowBookingModal(false);
    setShowActiveTicket(true);

    // Update ride booked seats
    if (selectedRide) {
      setRides((prev) =>
        prev.map((r) =>
          r.id === selectedRide.id
            ? { ...r, bookedSeats: r.bookedSeats + booking.seatsBooked }
            : r
        )
      );
      setSelectedRide((prev) =>
        prev ? { ...prev, bookedSeats: prev.bookedSeats + booking.seatsBooked } : null
      );
    }

    showToast('Ghép chuyến thành công! Chúc bạn chuyến đi an toàn.');
  };

  const handleRideCreated = (newRide: Ride) => {
    setRides([newRide, ...rides]);
    setSelectedRide(newRide);
    setShowCreateRide(false);
    showToast('Đăng chuyến xe chung thành công!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ghép chuyến đi UIT',
        text: 'Cùng đi xe với mình đến ĐH Công nghệ Thông tin UIT nè!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Đã sao chép liên kết chuyến đi!');
    }
  };

  const resetToScreenshotView = () => {
    setSelectedRide(INITIAL_RIDES[0]);
    setShowRouteMap(false);
    setShowBookingModal(false);
    setShowActiveTicket(false);
    setShowDriverChat(false);
    setShowCreateRide(false);
    setViewMode('mobile');
  };

  // Render Mobile View Inside Frame
  const renderMobileContent = () => (
    <div className="relative h-full w-full flex flex-col bg-slate-50">
      {selectedRide ? (
        <RideDetailSheet
          ride={selectedRide}
          onBack={() => setSelectedRide(null)}
          onViewRoute={() => setShowRouteMap(true)}
          onJoinRide={() => setShowBookingModal(true)}
          onShare={handleShare}
        />
      ) : (
        <RideListScreen
          rides={rides}
          onSelectRide={(r) => setSelectedRide(r)}
          onOpenCreateRide={() => setShowCreateRide(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      
      {/* Top Utility & Control Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-600/30 font-black text-sm">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm tracking-tight">
                  RideShare <span className="text-red-500">Red</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/40">
                  UIT · ĐHQG TP.HCM
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & View Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Giao diện điện thoại giống ảnh chụp màn hình"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Khung Điện Thoại</span>
              </button>

              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Giao diện toàn màn hình máy tính"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Toàn Màn Hình</span>
              </button>
            </div>

            {/* Active ticket shortcut if booked */}
            {currentBooking && (
              <button
                onClick={() => setShowActiveTicket(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold transition-colors"
              >
                <Ticket className="h-3.5 w-3.5 text-red-400" />
                <span className="hidden sm:inline">Vé Của Tôi</span>
              </button>
            )}

            {/* Reset button to recreate screenshot */}
            <button
              onClick={resetToScreenshotView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
              title="Đặt lại màn hình gốc như ảnh chụp"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Màn hình mẫu</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-2 sm:p-6 lg:p-8 overflow-y-auto">
        
        {viewMode === 'mobile' ? (
          /* Phone Frame Mode - Exact replica of the mobile app shown in user screenshot */
          <div className="w-full py-2 flex flex-col items-center">
            <div className="mb-3 text-center">
              <p className="text-xs text-slate-400">
                Giao diện màn hình ghép chuyến <span className="text-red-400 font-semibold">Tông Đỏ (Red Theme)</span> theo yêu cầu của bạn
              </p>
            </div>

            <MobileFrame>
              {renderMobileContent()}
            </MobileFrame>
          </div>
        ) : (
          /* Desktop Dashboard Mode - Expansive commuter view with side-by-side feed and detail */
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Ride list feed & filters */}
            <div className="lg:col-span-5 bg-white text-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 h-[780px]">
              <RideListScreen
                rides={rides}
                onSelectRide={(r) => setSelectedRide(r)}
                onOpenCreateRide={() => setShowCreateRide(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Right Column: Selected Ride Detail or Empty State */}
            <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 h-[780px] flex flex-col">
              {selectedRide ? (
                <RideDetailSheet
                  ride={selectedRide}
                  onBack={() => setSelectedRide(null)}
                  onViewRoute={() => setShowRouteMap(true)}
                  onJoinRide={() => setShowBookingModal(true)}
                  onShare={handleShare}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
                  <div className="h-16 w-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Car className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Chọn một chuyến xe từ danh sách bên trái
                  </h3>
                  <p className="text-xs max-w-sm text-slate-400">
                    Bấm vào chuyến của Tài xế Minh Trí để xem chi tiết lộ trình KTX Khu B đi Đại học Công nghệ Thông tin UIT.
                  </p>
                  <button
                    onClick={() => setSelectedRide(INITIAL_RIDES[0])}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30"
                  >
                    Xem chuyến mẫu UIT
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-500/40 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      
      {/* 1. Interactive Route Map Modal ("Xem lộ trình") */}
      {showRouteMap && selectedRide && (
        <RouteMapModal
          ride={selectedRide}
          onClose={() => setShowRouteMap(false)}
          onJoinRide={() => {
            setShowRouteMap(false);
            setShowBookingModal(true);
          }}
        />
      )}

      {/* 2. Booking Confirmation Modal ("Tham gia ngay") */}
      {showBookingModal && selectedRide && (
        <BookingConfirmModal
          ride={selectedRide}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 3. Active Boarding Pass & Live Trip Status */}
      {showActiveTicket && selectedRide && currentBooking && (
        <ActiveTripTicketModal
          ride={selectedRide}
          booking={currentBooking}
          onClose={() => setShowActiveTicket(false)}
          onOpenChat={() => setShowDriverChat(true)}
          onOpenMap={() => setShowRouteMap(true)}
          onCancelBooking={() => {
            setCurrentBooking(null);
            setShowActiveTicket(false);
            showToast('Đã hủy chuyến đi thành công.');
          }}
        />
      )}

      {/* 4. Driver Chat Modal */}
      {showDriverChat && selectedRide && (
        <DriverChatModal
          driver={selectedRide.driver}
          onClose={() => setShowDriverChat(false)}
          onCall={() => alert(`Đang gọi tới tài xế ${selectedRide.driver.name}: ${selectedRide.driver.phone}`)}
        />
      )}

      {/* 5. Create / Offer Ride Modal ("Đặt xe chung") */}
      {showCreateRide && (
        <CreateRideModal
          onClose={() => setShowCreateRide(false)}
          onRideCreated={handleRideCreated}
        />
      )}

    </div>
  );
}
