import React, { useEffect, useState } from "react";
import { useYear } from "../contexts/YearContext";
import "../styles/YearList.css";

const YearList = () => {
  const [yearOptions, setYearOptions] = useState([]);
  const { year, setYear } = useYear();

  useEffect(() => {
    fetch("http://localhost:5000/seasons/years")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setYearOptions(data); // Ensure it's an array
        } else {
          console.error("Invalid data received:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <span>
        <label htmlFor="yearList">Year:</label>
        <select
          id="yearList"
          value={year}
          onChange={(event) => setYear(event.target.value)}
        >
          <option value="">Choose an option</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
};

export default YearList;
