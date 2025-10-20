// lib/hooks/useBookings.ts
import { useEffect, useState } from 'react';
import { getBookings } from '../firebase/firestore';

export const useBookings = (filters) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings(filters);
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await getBookings(filters);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch };
};
