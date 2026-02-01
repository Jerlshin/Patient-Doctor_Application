import Axios from "axios";
import { useEffect, useState } from "react";
import { ListDoctors } from "../components/ListDoctors";
import { API_BASE_URL } from "../config/constant";
import { Search, Filter, X, MapPin, Award } from "lucide-react";
import { LoadingSpinner, SkeletonLoader } from "../components/ui/LoadingSpinner";

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Axios.get(`${API_BASE_URL}/doctors`)
      .then((res) => {
        if (res.status === 200) {
          setDoctors(res.data);
          setFilteredDoctors(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching doctors:', err);
        toast.error('Failed to load doctors');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Get unique specialties and cities
  const specialties = ['all', ...new Set(doctors.map(d => d.profession).filter(Boolean))];
  const cities = ['all', ...new Set(doctors.map(d => d.city).filter(Boolean))];

  useEffect(() => {
    let filtered = doctors;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doctor.profession && doctor.profession.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doctor.city && doctor.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doctor.qualification && doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor => doctor.profession === selectedSpecialty);
    }

    // Apply city filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(doctor => doctor.city === selectedCity);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, selectedCity, doctors]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
    setSelectedCity('all');
  };

  const hasActiveFilters = searchTerm || selectedSpecialty !== 'all' || selectedCity !== 'all';

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="page-header">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award size={16} />
            <span>Find Expert Care</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find a Specialist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our network of highly qualified doctors and specialists to find the right care for you
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialty, city, or qualification..."
                className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors mb-4"
            >
              <Filter size={18} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Filters */}
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
              
              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty === 'all' ? 'All Specialties' : specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    <span>Clear Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              {isLoading ? (
                'Loading doctors...'
              ) : (
                <>
                  Found <span className="font-bold text-blue-600">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
                  {hasActiveFilters && ' matching your criteria'}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-6">
                <SkeletonLoader height="h-48" className="mb-4 rounded-xl" />
                <SkeletonLoader height="h-6" width="w-3/4" className="mb-2" />
                <SkeletonLoader height="h-4" width="w-1/2" className="mb-4" />
                <SkeletonLoader height="h-4" count={2} className="mb-4" />
                <SkeletonLoader height="h-12" className="rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <ListDoctors key={doctor._id || index} obj={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {hasActiveFilters 
                ? "Try adjusting your search criteria or filters to find more results."
                : "No doctors are currently available. Please check back later."
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              >
                <X size={18} />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}