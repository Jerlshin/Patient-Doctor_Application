import Axios from "axios";
import { useEffect, useState } from "react";
import { ListDoctors } from "./ListDoctors";
import { API_BASE_URL } from "../config/constant";
import { Search } from "lucide-react";

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/doctors`)
      .then((res) => {
        if (res.status === 200) {
          setDoctors(res.data);
          setFilteredDoctors(res.data); // Initially, filteredDoctors is same as doctors
        } else {
          Promise.reject();
        }
      })
      .catch((err) => alert(err));
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterOption(value);

    const filteredList = doctors.filter(doctor =>
      (doctor.profession && doctor.profession.toLowerCase().includes(value)) ||
      (doctor.city && doctor.city.toLowerCase().includes(value))
    );
    setFilteredDoctors(filteredList);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filter */}
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Find a Specialist</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Browse through our network of highly qualified doctors and specialists to find the right care for you.</p>

        <div className="max-w-md mx-auto relative mt-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filterOption}
            onChange={handleFilterChange}
            placeholder="Search by profession or city..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <ListDoctors key={index} obj={doctor} />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
