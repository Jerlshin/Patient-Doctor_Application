import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Award } from 'lucide-react';

export function ListDoctors(props) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        {props.obj.image ? (
          <img
            src={props.obj.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            alt={props.obj.name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
            <User size={64} />
          </div>
        )}
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          Verified
        </div>
      </div>

      <div className="p-6">
        <h5 className="text-xl font-bold text-gray-900 mb-1">{props.obj.name}</h5>
        <p className="text-blue-600 font-medium mb-4">{props.obj.profession}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Award size={16} className="mt-0.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1">{props.obj.qualification}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1">{props.obj.address}, {props.obj.city}</span>
          </div>
        </div>

        <Link
          to={`/message/${props.obj._id}`}
          className="block w-full text-center bg-gray-900 text-white py-2.5 rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
