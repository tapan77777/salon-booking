'use client';
import { Calendar, Clock, MapPin, Phone, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createBooking, getServices } from '../../lib/firebase/firestore';

const salonInfo = {
  name: 'Glow Salon & Spa',
  tagline: 'Your Beauty Destination in Rourkela',
  phone: '+91 98765 43210',
  address: 'Civil Township, Rourkela, Odisha',
  offer: '🎉 First Time Customers Get 30% OFF!'
};

export default function SalonHomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    timeSlot: ''
  });

  // Load services from Firebase
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      timeSlot: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingConfirm = async () => {
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.date || !formData.timeSlot) {
      alert('⚠️ Please fill all required fields!');
      return;
    }

    // Validate phone number
    if (formData.phone.length < 10) {
      alert('⚠️ Please enter a valid phone number!');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        customerEmail: formData.email.trim() || '',
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        date: formData.date,
        timeSlot: formData.timeSlot,
      };
      
      await createBooking(bookingData);
      
      alert('🎉 Booking confirmed successfully! We will see you soon!');
      closeModal();
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Error creating booking. Please try again or call us.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
     <header className="bg-white shadow-sm sticky top-0 z-40">
  <div className="max-w-6xl mx-auto px-4 py-4">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          {salonInfo.name}
        </h1>
        <p className="text-sm text-gray-600">{salonInfo.tagline}</p>
      </div>
      <div className="flex gap-3">
        <a
          href={`tel:${salonInfo.phone}`}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href="/login"
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Admin Login
        </a>
      </div>
    </div>
  </div>
</header>

      {/* Offer Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold text-lg">{salonInfo.offer}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-800">{salonInfo.address}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Working Hours</p>
                <p className="font-semibold text-gray-800">9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold text-gray-800">4.8 ⭐ (250+ reviews)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Services</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ₹{service.price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} mins</span>
                    </div>
                    <button
                      onClick={() => handleBookNow(service)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
                <p className="text-sm text-gray-600">{selectedService.name}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-purple-600 mt-1">
                  ✨ First-time customers get 30% discount automatically!
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Time *
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose time slot</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="9:30 AM">9:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="2:30 PM">2:30 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="3:30 PM">3:30 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="4:30 PM">4:30 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="5:30 PM">5:30 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="6:30 PM">6:30 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="7:30 PM">7:30 PM</option>
                </select>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Service Price:</span>
                  <span className="font-semibold">₹{selectedService.price}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">First-time Discount (30%):</span>
                  <span className="text-green-600 font-semibold">
                    -₹{Math.round(selectedService.price * 0.3)}
                  </span>
                </div>
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Estimated Total:</span>
                    <span className="font-bold text-purple-600 text-lg">
                      ₹{Math.round(selectedService.price * 0.7)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Actual discount will be applied if youre a first-time customer
                  </p>
                </div>
              </div>

              <button
                onClick={handleBookingConfirm}
                disabled={submitting}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">{salonInfo.name}</h3>
          <p className="text-gray-400 mb-4">{salonInfo.address}</p>
          <p className="text-gray-400">Call us: {salonInfo.phone}</p>
          <p className="text-gray-500 text-sm mt-4">© 2025 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}