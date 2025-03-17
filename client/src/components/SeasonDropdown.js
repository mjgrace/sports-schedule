import React, { useEffect, useState } from "react";
import { useYear } from "../contexts/YearContext";
import { useSeason } from "../contexts/SeasonContext";
import "../styles/SeasonDropdown.css";

const SeasonDropdown = () => {
  const [seasonOptions, setSeasonOptions] = useState([]);
  const { season, setSeason } = useSeason();
  const { year, setYear } = useYear();

  useEffect(() => {
    fetch(`http://localhost:5000/seasons?year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSeasonOptions(data); // Ensure it's an array
        } else {
          console.error("Invalid data received:", data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [year]);

  return (
    <span>
      <label id="seasonDropdownLabel" htmlFor="seasonDropdown">
        Season
      </label>
      <select
        id="seasonDropdown"
        onChange={(event) => {
          setSeason(event.target.value);
        }}
      >
        <option value="">Choose an option</option>
        {seasonOptions.map((season) => (
          <option value={season.leagueId}>{season.league.name}</option>
        ))}
      </select>
    </span>
  );
};

export default SeasonDropdown;
