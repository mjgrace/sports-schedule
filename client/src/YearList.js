import React, { useEffect, useState } from "react";
import "./YearList.css";

function YearList() {
  const [selected, setSelected] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/seasons/years")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOptions(data); // Ensure it's an array
        } else {
          console.error("Invalid data received:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      {options.length > 0 ? (
        <span>
          <label htmlFor="yearList">Year:</label>
          <select
            id="yearList"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Choose an option</option>
            {options.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </span>
      ) : (
        <p>No years found.</p>
      )}
    </div>
  );
}

export default YearList;
