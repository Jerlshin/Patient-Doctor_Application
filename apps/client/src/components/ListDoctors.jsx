import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Award, Calendar, Star, CheckCircle } from 'lucide-react';

export function ListDoctors(props) {
  const { obj } = props;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 shadow-card hover:shadow-card-hover transition-all duration-300">
      
      {/* Doctor Image */}
      <div className="h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 relative">
        {obj.image ? (
          <img
            src={obj.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt={obj.name || 'Doctor'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={80} className="text-blue-200" />
          </div>
        )}
        
        {/* Verified Badge */}
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
          <CheckCircle size={14} />
          <span>Verified</span>
        </div>

        {/* Rating Badge */}
        {obj.rating && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span>{obj.rating}</span>
          </div>
        )}
      </div>

      {/* Doctor Info */}
      <div className="p-6">
        
        {/* Name and Specialty */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {obj.name || 'Dr. Unknown'}
          </h3>
          <p className="text-blue-600 font-semibold text-sm">
            {obj.profession || 'General Physician'}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <Award size={16} className="mt-0.5 text-blue-500 shrink-0" />
            <span className="line-clamp-2">{obj.qualification || 'Medical Degree'}</span>
          </div>
          
          <div className="flex items-start gap-2.5 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 text-blue-500 shrink-0" />
            <span className="line-clamp-1">
              {obj.address && obj.city 
                ? `${obj.address}, ${obj.city}`
                : obj.city || obj.address || 'Location not specified'
              }
            </span>
          </div>

          {/* Experience */}
          {obj.experience && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              </div>
              <span>{obj.experience} years of experience</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/message/${obj._id}`}
          className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="flex items-center justify-center gap-2">
            <Calendar size={18} />
            Book Appointment
          </span>
        </Link>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}