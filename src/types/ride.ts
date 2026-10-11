export interface Stop {
  id: string;
  name: string;
  detail: string;
  time: string;
  isPickup?: boolean;
  isDropoff?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  phone: string;
  vehicle: {
    type: 'car' | 'motorbike' | 'car7';
    model: string;
    licensePlate: string;
    color: string;
  };
}

export interface Ride {
  id: string;
  destination: string;
  destinationSub: string;
  pickup: string;
  pickupSub: string;
  departureTime: string;
  distanceKm: number;
  durationMinutes: number;
  driver: Driver;
  totalSeats: number;
  bookedSeats: number;
  pricePerSeat: number; // in VND, e.g. 15000
  co2SavedKg: number;
  costSavedPercent: number;
  stops: Stop[];
  notes?: string;
  isPopular?: boolean;
  recurringDays?: string[];
  vehicleType: 'car' | 'motorbike' | 'car7';
}

export interface Booking {
  bookingId: string;
  rideId: string;
  seatsBooked: number;
  totalPrice: number;
  passengerName: string;
  passengerPhone: string;
  pickupNote: string;
  paymentMethod: 'cash' | 'momo' | 'vnpay' | 'vietqr';
  bookingTime: string;
  status: 'confirmed' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
  qrCode: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  timestamp: string;
}
