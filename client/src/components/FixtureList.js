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
    if (season != "" && date != "" && year != "") {
      fetch(
        `http://localhost:5000/fixtures?leagueId=${season}&season=${year}&date=${
          date.toISOString().split("T")[0]
        }`
      )
        .then((response) => response.json())
        // .then((data) => setFixtures(data || []))
        .then((fixtureData) => setFixtures(JSON.parse(fixtureData) || ""))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [date, season]);

  useEffect(() => {
    setFixtures([]);
  }, [year, country]);

  return (
    <div id="fixtureList">
      {fixtures.length > 0 ? (
        fixtures.map((fixture) => (
          <div key={fixture.id} className="fixture">
            <div>{fixture.teams.home.name}</div>
            <div>{fixture.teams.away.name}</div>
          </div>
        ))
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
};

export default FixtureList;
