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
            <div id="matchStatus">
              {fixture.fixture.status.short == "NS"
                ? new Date(fixture.fixture.timestamp * 1000).toLocaleString(
                    "en-US",
                    { timeStyle: "short" }
                  )
                : fixture.fixture.status.short == "1H" ||
                  fixture.fixture.status.short == "2H"
                ? fixture.fixture.status.elapsed +
                  "'" +
                  (fixture.fixture.status.extra
                    ? " + " + (fixture.fixture.status.extra + "'")
                    : "")
                : fixture.fixture.status.long}
            </div>
            <div id="headerHalftime">1</div>
            <div id="headerFulltime">2</div>
            {/* <span>ET</span> */}
            {/* <span>PK</span> */}
            <div id="headerTotal">T</div>
            <div id="homeLogo">
              <img class="logo" src={fixture.teams.home.logo} />
            </div>
            <div id="homeName">{fixture.teams.home.name}</div>
            <div id="homeHalftime">{fixture.score.halftime.home || 0}</div>
            <div id="homeFulltime">
              {fixture.score.fulltime.home - fixture.score.halftime.home || 0}
            </div>
            {/* <span>{fixture.score.extratime.home}</span> */}
            {/* <span>{fixture.score.penalty.home}</span> */}
            <div id="homeTotal">{fixture.goals.home || 0}</div>
            <div id="awayLogo">
              <img class="logo" src={fixture.teams.away.logo} />
            </div>
            <div id="awayName">{fixture.teams.away.name}</div>
            <div id="awayFulltime">{fixture.score.halftime.away || 0}</div>
            <div id="awayFulltime">
              {fixture.score.fulltime.away - fixture.score.halftime.away || 0}
            </div>
            {/* <span>{fixture.score.extratime.away}</span> */}
            {/* <span>{fixture.score.penalty.away}</span> */}
            <div id="awayTotal">{fixture.goals.away || 0}</div>
            <div id="matchVenue">
              {fixture.fixture.venue.name + " - " + fixture.fixture.venue.city}
            </div>
          </div>
        ))
      ) : (
        <p id="noFixtureMessage">No matches found.</p>
      )}
    </div>
  );
};

export default FixtureList;

{
  /* // <div>
          //   <div>Home Name {fixture.teams.home.name}</div>
          //   <div>Home Logo {fixture.teams.home.logo}</div>
          //   <div>Home Winner {fixture.teams.home.winner ? "Yes" : "No"}</div>
          //   <div>Away Name {fixture.teams.away.name}</div>
          //   <div>Away Logo {fixture.teams.away.logo}</div>
          //   <div>Away Winner {fixture.teams.away.winner ? "Yes" : "No"}</div>
          //   <div>Timestamp {fixture.fixture.timestamp}</div>
          //   <div>Venue Name {fixture.fixture.venue.name}</div>
          //   <div>Venue City {fixture.fixture.venue.city}</div>
          //   <div>Status {fixture.fixture.status.short}</div>
          //   <div>Elapsed {fixture.fixture.status.elapsed}</div>
          //   <div>Extra {fixture.fixture.status.extra}</div>
          //   <div>Home Goals {fixture.goals.home}</div>
          //   <div>Away Goals {fixture.goals.away}</div>
          //   <div>Home Halftime {fixture.score.halftime.home}</div>
          //   <div>Away Halftime {fixture.score.halftime.away}</div>
          //   <div>Home Fulltime {fixture.score.fulltime.home}</div>
          //   <div>Away Fulltime {fixture.score.fulltime.away}</div>
          //   <div>Home Extratime {fixture.score.extratime.home}</div>
          //   <div>Away Fulltime {fixture.score.extratime.away}</div>
          //   <div>Home Penalty {fixture.score.penalty.home}</div>
          //   <div>Away Penalty {fixture.score.penalty.away}</div>
          // </div> */
}
