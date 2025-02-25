import React, { useEffect, useState } from "react";
import "./Team.css";

function Team() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/teams")
      .then((response) => response.json())
      .then((data) => setTeams(data || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      {teams.length > 0 ? (
        teams.map((team) => (
          <p>
            {/* <img alt={team.name} src={team.logo} /> */}
            {team.name}
          </p>
        ))
      ) : (
        <p>No teams found.</p>
      )}
    </div>
  );
}

export default Team;
