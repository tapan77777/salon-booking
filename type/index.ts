export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  imageUrl?: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isFirstTime: boolean;
  discountApplied: number;
  finalPrice: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  firstVisitDate: Date;
  lastVisitDate: Date;
  totalSpent: number;
  loyaltyPoints: number;
  createdAt: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  type: 'first-time' | 'loyalty' | 'festival';
  isActive: boolean;
  validFrom: Date;
  validTill: Date;
}