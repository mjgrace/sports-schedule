import React, { useEffect, useState } from "react";
import { useYear } from "../contexts/YearContext";
import "../styles/Season.css";

const Season = () => {
  const [seasons, setSeasons] = useState([]);
  const { year, setYear } = useYear();

  useEffect(() => {
    fetch(`http://localhost:5000/seasons?year=${year}&current=true`)
      .then((response) => response.json())
      .then((data) => setSeasons(data || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, [year]);

  return (
    <div>
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <p>
            {/* <img alt={team.name} src={team.logo} /> */}
            {season.league.name} - {season.year}
          </p>
        ))
      ) : (
        <p>No seasons found.</p>
      )}
    </div>
  );
};

export default Season;
