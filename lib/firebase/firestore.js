import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
    }));
  } catch (error) {
    console.error('Error getting services:', error);
    return [];
  }
};

export const addService = async (serviceData) => {
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

export const updateService = async (serviceId, serviceData) => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, serviceData);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// ============ BOOKINGS ============
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    
    // Check if first-time customer
    const customer = await getCustomerByPhone(bookingData.customerPhone);
    const isFirstTime = !customer;
    
    let discountApplied = 0;
    if (isFirstTime) {
      discountApplied = Math.round(bookingData.servicePrice * 0.3);
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
    
    // Create customer if first time
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

export const getBookings = async (date) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    let q;
    
    if (date) {
      q = query(bookingsRef, where('date', '==', date), orderBy('timeSlot'));
    } else {
      q = query(bookingsRef, orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updates = { status };
    
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
    console.error('Error updating booking:', error);
    throw error;
  }
};

// ============ CUSTOMERS ============
export const getCustomerByPhone = async (phone) => {
  try {
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('phone', '==', phone));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting customer:', error);
    return null;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const customersRef = collection(db, 'customers');
    const docRef = await addDoc(customersRef, {
      ...customerData,
      totalVisits: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      isActive: true,
      firstVisitDate: serverTimestamp(),
      lastVisitDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId, customerData) => {
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
    const q = query(customersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting customers:', error);
    return [];
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
    return {
      totalBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      newCustomers: 0,
    };
  }
};