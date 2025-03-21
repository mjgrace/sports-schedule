import React, { useEffect, usePrevious, useState } from "react";
import { useDate } from "../contexts/DateContext";
import { useYear } from "../contexts/YearContext";
import { useSeason } from "../contexts/SeasonContext";
import { useCountry } from "../contexts/CountryContext";
import "../styles/FixtureList.css";

const FixtureList = () => {
  const [fixtures, setFixtures] = useState([]);
  const { date, setDate } = useDate();
  const { year, setYear } = useYear();
  const { season, setSeason } = useSeason();
  const { country, setCountry } = useCountry();

  useEffect(() => {
    if (season != "" && year != "") {
      fetch(
        `http://localhost:5000/fixtures?leagueId=${season}&season=${year}&date=${date}`
      )
        .then((response) => response.json())
        .then((data) => setTeams(data || []))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [season]);

  useEffect(() => {
    setTeams([]);
  }, [year, country]);

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
