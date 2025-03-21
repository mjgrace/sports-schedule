import React, { useEffect, useState } from "react";
import { useYear } from "../contexts/YearContext";
import "../styles/SeasonList.css";

const SeasonList = () => {
  const [seasons, setSeasons] = useState([]);
  const { year, setYear } = useYear();

  useEffect(() => {
    fetch(`http://localhost:5000/seasons?year=${year}`)
      .then((response) => response.json())
      .then((data) => setSeasons(data || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, [year]);

  return (
    <div id="seasonList">
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.leagueId} className="season">
            {season.league.name}
          </div>
        ))
      ) : (
        <p>No seasons found.</p>
      )}
    </div>
  );
};

export default SeasonList;
