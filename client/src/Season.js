import React, { useEffect, useState } from "react";
import "./Season.css";

function Season() {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/seasons?year=2024&current=true")
      .then((response) => response.json())
      .then((data) => setSeasons(data || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
}

export default Season;
