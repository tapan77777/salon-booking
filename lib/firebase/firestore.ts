// lib/firebase/firestore.ts
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './config';

// ============ SERVICES ============

export const getServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where('isActive', '==', true), orderBy('category'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};

export const getServiceById = async (serviceId: string) => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    const snapshot = await getDoc(serviceRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting service:', error);
    throw error;
  }
};

export const addService = async (serviceData: any) => {
  try {
    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: serverTimestamp(),
      isActive: true,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const updateService = async (serviceId: string, serviceData: any) => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, serviceData);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, { isActive: false });
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// ============ CUSTOMERS ============

export const getCustomerByPhone = async (phone: string) => {
  try {
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('phone', '==', phone));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        firstVisitDate: doc.data().firstVisitDate?.toDate(),
        lastVisitDate: doc.data().lastVisitDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
};

export const addCustomer = async (customerData: any) => {
  try {
    const customersRef = collection(db, 'customers');
    const docRef = await addDoc(customersRef, {
      ...customerData,
      totalVisits: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      isActive: true,
      firstVisitDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId: string, customerData: any) => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, customerData);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, orderBy('lastVisitDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      firstVisitDate: doc.data().firstVisitDate?.toDate(),
      lastVisitDate: doc.data().lastVisitDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
};

// ============ BOOKINGS ============

export const createBooking = async (bookingData: any) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    
    // Check if customer is first-time
    const customer = await getCustomerByPhone(bookingData.customerPhone);
    const isFirstTime = !customer;
    
    // Calculate discount
    let discountApplied = 0;
    if (isFirstTime) {
      discountApplied = Math.round(bookingData.servicePrice * 0.3); // 30% off
    }
    
    const finalPrice = bookingData.servicePrice - discountApplied;
    
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      isFirstTime,
      discountApplied,
      finalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
    });
    
    // Create or update customer
    if (isFirstTime) {
      await addCustomer({
        name: bookingData.customerName,
        phone: bookingData.customerPhone,
        email: bookingData.customerEmail || '',
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookings = async (filters?: any) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    let q = query(bookingsRef, orderBy('createdAt', 'desc'));
    
    if (filters?.date) {
      q = query(bookingsRef, where('date', '==', filters.date), orderBy('timeSlot'));
    }
    
    if (filters?.status) {
      q = query(bookingsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updates: any = { status };
    
    if (status === 'completed') {
      updates.completedAt = serverTimestamp();
      
      // Update customer stats
      const booking = await getDoc(bookingRef);
      if (booking.exists()) {
        const bookingData = booking.data();
        const customer = await getCustomerByPhone(bookingData.customerPhone);
        
        if (customer) {
          await updateCustomer(customer.id, {
            totalVisits: customer.totalVisits + 1,
            totalSpent: customer.totalSpent + bookingData.finalPrice,
            loyaltyPoints: customer.loyaltyPoints + Math.floor(bookingData.finalPrice / 10),
            lastVisitDate: serverTimestamp(),
          });
        }
      }
    }
    
    await updateDoc(bookingRef, updates);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const getBookingsByPhone = async (phone: string) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('customerPhone', '==', phone),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting bookings by phone:', error);
    throw error;
  }
};

// ============ OFFERS ============

export const getActiveOffers = async () => {
  try {
    const offersRef = collection(db, 'offers');
    const now = Timestamp.now();
    const q = query(
      offersRef,
      where('isActive', '==', true),
      where('validTill', '>=', now)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      validFrom: doc.data().validFrom?.toDate(),
      validTill: doc.data().validTill?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    }));
  } catch (error) {
    console.error('Error getting offers:', error);
    throw error;
  }
};

export const addOffer = async (offerData: any) => {
  try {
    const offersRef = collection(db, 'offers');
    const docRef = await addDoc(offersRef, {
      ...offerData,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding offer:', error);
    throw error;
  }
};

// ============ ANALYTICS ============

export const getTodayStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('date', '==', today));
    const snapshot = await getDocs(q);
    
    const bookings = snapshot.docs.map(doc => doc.data());
    
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.finalPrice || 0), 0);
    const newCustomers = bookings.filter(b => b.isFirstTime).length;
    
    return {
      totalBookings,
      completedBookings,
      totalRevenue,
      newCustomers,
    };
  } catch (error) {
    console.error('Error getting today stats:', error);
    throw error;
  }
};

export const getMonthlyRevenue = async (year: number, month: number) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const snapshot = await getDocs(query(bookingsRef, where('status', '==', 'completed')));
    
    const bookings = snapshot.docs.map(doc => doc.data());
    
    const monthlyData = bookings
      .filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate.getFullYear() === year && bookingDate.getMonth() === month;
      })
      .reduce((sum, b) => sum + (b.finalPrice || 0), 0);
    
    return monthlyData;
  } catch (error) {
    console.error('Error getting monthly revenue:', error);
    throw error;
  }
};