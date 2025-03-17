import React, { useEffect, useState } from "react";
import { useYear } from "../contexts/YearContext";
import { useSeason } from "../contexts/SeasonContext";
import "../styles/YearDropdown.css";

const YearDropdown = () => {
  const [yearOptions, setYearOptions] = useState([]);
  const { year, setYear } = useYear();
  const { season, setSeason } = useSeason();

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

  const updateYear = (year) => {
    setYear(year);
    setSeason("");
  };

  return (
    <span>
      <span>
        <label id="yearDropdownLabel" htmlFor="yearDropdown">
          Year
        </label>
        <select
          id="yearDropdown"
          value={year}
          onChange={(event) => updateYear(event.target.value)}
        >
          <option value="">Choose an option</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </span>
    </span>
  );
};

export default YearDropdown;
