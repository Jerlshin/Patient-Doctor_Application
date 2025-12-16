import Axios from "axios";
import { useEffect, useState } from "react";
import { ListDoctors } from "./ListDoctors";

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    Axios.get("http://localhost:4000/doctors")
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
    <div>
      <div className="filter">
        <label className="center">
          Filter by profession or location:
          <input
            type="text"
            value={filterOption}
            onChange={handleFilterChange}
            placeholder="Enter profession or location"
          />
        </label>
      </div>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {filteredDoctors.map((doctor, index) => (
          <ListDoctors key={index} obj={doctor} />
        ))}
      </div>
    </div>
  );
}
