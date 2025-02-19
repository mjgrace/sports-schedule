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
      <h1>Teams</h1>
      <ul>
        {teams.length > 0 ? (
          teams.map((team) => <li key={team.id}>{team.name}</li>)
        ) : (
          <p>No teams found.</p>
        )}
      </ul>
    </div>
  );
}

export default Team;
