// lib/hooks/useStats.ts
import { useEffect, useState } from 'react';
import { getTodayStats } from '../firebase/firestore';

export const useTodayStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    newCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getTodayStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
};