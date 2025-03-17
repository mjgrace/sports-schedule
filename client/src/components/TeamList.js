import React, { useEffect, useState } from "react";
import { useYear } from "../contexts/YearContext";
import { useSeason } from "../contexts/SeasonContext";
import "../styles/TeamList.css";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const { year, setYear } = useYear();
  const { season, setSeason } = useSeason();

  useEffect(() => {
    fetch(`http://localhost:5000/teams?leagueId=${season}&season=${year}`)
      .then((response) => response.json())
      .then((data) => setTeams(data || []))
      .catch((error) => console.error("Error fetching data:", error));
  }, [year, season]);

  return (
    <div id="teamList">
      {teams.length > 0 ? (
        teams.map((team) => (
          <div key={team.id} className="team">
            {team.name}
          </div>
        ))
      ) : (
        <p>No teams found.</p>
      )}
    </div>
  );
};

export default TeamList;
