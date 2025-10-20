'use client';
import { Calendar, Clock, MapPin, Phone, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

// Mock data - Replace with Firebase later
const mockServices = [
  {
    id: '1',
    name: 'Premium Haircut',
    price: 300,
    duration: 30,
    category: 'Hair',
    description: 'Stylish haircut by expert stylists',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
    isActive: true
  },
  {
    id: '2',
    name: 'Hair Coloring',
    price: 1500,
    duration: 90,
    category: 'Hair',
    description: 'Professional hair coloring with premium products',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    isActive: true
  },
  {
    id: '3',
    name: 'Facial Treatment',
    price: 800,
    duration: 45,
    category: 'Skin',
    description: 'Deep cleansing facial for glowing skin',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    isActive: true
  },
  {
    id: '4',
    name: 'Beard Styling',
    price: 200,
    duration: 20,
    category: 'Grooming',
    description: 'Professional beard trim and styling',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
    isActive: true
  },
  {
    id: '5',
    name: 'Spa Massage',
    price: 1200,
    duration: 60,
    category: 'Spa',
    description: 'Relaxing full body massage',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    isActive: true
  },
  {
    id: '6',
    name: 'Manicure & Pedicure',
    price: 600,
    duration: 45,
    category: 'Nails',
    description: 'Complete hand and feet care',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    isActive: true
  }
];

const salonInfo = {
  name: 'Glow Salon & Spa',
  tagline: 'Your Beauty Destination in Rourkela',
  phone: '+91 98765 43210',
  address: 'Civil Township, Rourkela, Odisha',
  offer: '🎉 First Time Customers Get 30% OFF!'
};

export default function SalonHomePage() {
  const [services, setServices] = useState(mockServices);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

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
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call Now
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
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
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
                <p className="text-sm text-gray-600">{selectedService?.name}</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
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
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-purple-600 mt-1">
                  ✨ First-time customers get 30% discount automatically!
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Time *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">Choose time slot</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                </select>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Service Price:</span>
                  <span className="font-semibold">₹{selectedService?.price}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">First-time Discount (30%):</span>
                  <span className="text-green-600 font-semibold">
                    -₹{Math.round(selectedService?.price * 0.3)}
                  </span>
                </div>
                <div className="border-t border-purple-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-purple-600 text-lg">
                      ₹{Math.round(selectedService?.price * 0.7)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                Confirm Booking
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