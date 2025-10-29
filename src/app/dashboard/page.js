'use client';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBookings, getTodayStats, updateBookingStatus } from '../../../lib/firebase/firestore';


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayBookings: 0,
    todayRevenue: 0,
    todayCompleted: 0,
    todayNewCustomers: 0,
  });
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

// Temporary test - remove after confirming it works
useEffect(() => {
  console.log('🔥 Firebase Config Check:');
  console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Loaded' : '❌ Missing');
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing');
}, []);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [statsData, bookingsData] = await Promise.all([
        getTodayStats(),
        getBookings(today),
      ]);
      
      setStats({
        todayBookings: statsData.totalBookings,
        todayRevenue: statsData.totalRevenue,
        todayCompleted: statsData.completedBookings,
        todayNewCustomers: statsData.newCustomers,
      });
      
      setTodayBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await updateBookingStatus(bookingId, newStatus);
      alert('✅ Status updated successfully!');
      await loadData(); // Reload fresh data
    } catch (error) {
      alert('❌ Error updating status');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600">Welcome back! Heres whats happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Todays Date</p>
              <p className="font-semibold text-gray-800">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Today's Bookings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                Today
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.todayBookings}
            </h3>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Live
              </span>
              <span className="text-gray-500">Real-time data</span>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                Today
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              ₹{stats.todayRevenue.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Earnings
              </span>
              <span className="text-gray-500">From completed</span>
            </div>
          </div>

          {/* Completed Services */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                Today
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.todayCompleted}
            </h3>
            <p className="text-sm text-gray-600">Completed</p>
            <div className="mt-3 text-sm text-gray-500">
              {stats.todayBookings - stats.todayCompleted} pending
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded">
                Today
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {stats.todayNewCustomers}
            </h3>
            <p className="text-sm text-gray-600">New Customers</p>
            <div className="mt-3 text-sm text-gray-500">
              First time visitors
            </div>
          </div>
        </div>

        {/* Today's Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Todays Bookings</h3>
                <p className="text-sm text-gray-600">Manage and track all appointments</p>
              </div>
              <button
                onClick={loadData}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          
          {todayBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg font-semibold">No bookings for today yet</p>
              <p className="text-sm text-gray-400 mt-1">Bookings will appear here when customers book</p>
              <Link
                href="/"
                className="inline-block mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View Customer Page →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                      Customer
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                      Service
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                      Time
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                      Price
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {todayBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                          {booking.isFirstTime && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded mt-1 inline-block">
                              🎉 First Time
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 font-medium">{booking.serviceName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4" />
                          {booking.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">₹{booking.finalPrice}</p>
                          {booking.discountApplied > 0 && (
                            <p className="text-xs text-green-600">
                              💰 Saved ₹{booking.discountApplied}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'in-progress')}
                            disabled={updating}
                            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            Start
                          </button>
                        )}
                        {booking.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            disabled={updating}
                            className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                          >
                            Complete
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Done
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        {todayBookings.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-purple-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">
                  {todayBookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div>
                <p className="text-purple-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">
                  {todayBookings.filter(b => b.status === 'in-progress').length}
                </p>
              </div>
              <div>
                <p className="text-purple-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">
                  {todayBookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <div>
                <p className="text-purple-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.todayRevenue}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}