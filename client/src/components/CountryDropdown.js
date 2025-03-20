import React, { useEffect, useState } from "react";
import { useCountry } from "../contexts/CountryContext";
import "../styles/CountryDropdown.css";

const CountryDropdown = () => {
  const [countryOptions, setCountryOptions] = useState([]);
  const { country, setCountry } = useCountry();

  useEffect(() => {
    fetch("http://localhost:5000/countries")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountryOptions(data); // Ensure it's an array
        } else {
          console.error("Invalid data received:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const updateCountry = (country) => {
    setCountry(country);
  };

  return (
    <span>
      <span>
        <label id="countryDropdownLabel" htmlFor="countryDropdown">
          Country
        </label>
        <select
          id="countryDropdown"
          value={country}
          onChange={(event) => updateCountry(event.target.value)}
        >
          <option value="">Choose an option</option>
          {countryOptions.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </span>
    </span>
  );
};

export default CountryDropdown;
