const League = require("./models/football/League");
const Country = require("./models/football/Country");
const Season = require("./models/football/Season");
const Timezone = require("./models/football/Timezone");
const Venue = require("./models/football/Venue");
const Team = require("./models/football/Team");

module.exports = {
  League,
  Country,
  Season,
  Timezone,
  Venue,
  Team,
};

const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
const { setupCache } = require("axios-cache-interceptor");

const router = express.Router();

const axiosInstance = setupCache(axios.create(), {
  ttl: 1000 * 60 * 5, // Cache for 5 minutes
  interpretHeader: true, // Respect HTTP headers
});

// Route to retrieve leagues
router.get("/leagues", async (req, res) => {
  getLeagues(req, res);
});

// Test Route to get data points
router.get("/test", async (req, res) => {
  result = "";
  try {
    timezones = await getTimezones(req, res);
    result += "Timezones: " + timezones;
    countries = await getCountries(req, res);
    result += "Countries: " + countries;
    leagues = await getLeagues(req, res);
    result += "\nLeagues: " + leagues;
    // team = await getTeam(req, res);
    // result += "\nTeam: " + team;
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});

const getTimezones = async (req, res) => {
  try {
    const response = await axiosInstance.get(
      process.env.API_SPORTS_URL + "/timezone",
      {
        headers: {
          "x-rapidapi-host": process.env.API_SPORTS_HOST,
          "x-rapidapi-key": process.env.API_SPORTS_API_KEY,
        },
        cache: {
          update: false, // Don't update cache if expired
        },
      }
    );
    timezones = saveTimezonePayload(response.data.response);
    return JSON.stringify(response.data);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

const saveTimezonePayload = async (timezoneData) => {
  // Save the timezone data
  const timezones = timezoneData.map((zone) => ({ timezone: zone }));
  const bulkOps = timezoneData.map((zone) => ({
    updateOne: {
      filter: { timezone: zone },
      update: { $set: { timezone: zone } },
      upsert: true,
    },
  }));
  await Timezone.bulkWrite(bulkOps)
    .then(() => console.log("Timezones saved successfully"))
    .catch((err) => console.error("Error saving timezones:", err));
  return timezones;
};

const getCountries = async (req, res) => {
  try {
    const response = await axiosInstance.get(
      process.env.API_SPORTS_URL + "/countries",
      {
        headers: {
          "x-rapidapi-host": process.env.API_SPORTS_HOST,
          "x-rapidapi-key": process.env.API_SPORTS_API_KEY,
        },
        cache: {
          ttl: 1000 * 60 * 60 * 24, // Update once per day
        },
      }
    );
    countries = saveCountryPayload(response.data.response);
    return JSON.stringify(response.data);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

const saveCountryPayload = async (countryData) => {
  // Save the country data
  countryData = countryData.isArray ? countryData : [countryData];
  const countries = countryData.map((country) => ({
    name: country.name,
    code: country.code,
    flag: country.flag,
  }));
  const bulkOps = countryData.map((country) => ({
    updateOne: {
      filter: { name: country.name },
      update: {
        $set: { name: country.name, code: country.code, flag: country.flag },
      },
      upsert: true,
    },
  }));
  await Country.bulkWrite(bulkOps)
    .then(() => {
      // console.log("Countries saved successfully");
    })
    .catch((err) => console.error("Error saving countries:", err));
  return countries;
};

const getLeagues = async (req, res) => {
  try {
    const response = await axiosInstance.get(
      process.env.API_SPORTS_URL + "/leagues",
      {
        headers: {
          "x-rapidapi-host": process.env.API_SPORTS_HOST,
          "x-rapidapi-key": process.env.API_SPORTS_API_KEY,
        },
        cache: {
          ttl: 1000 * 60 * 60, // Update once per hour
        },
      }
    );
    saveLeagueRootPayload(response.data.response);
    return JSON.stringify(response.data);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

const saveLeagueRootPayload = async (leagueRootData) => {
  try {
    leagueRootData.forEach(async (leagueData) => {
      // Step 1: Save the country data
      await saveCountryPayload(leagueData.country);
      // // Step 2: Save the league data
      await saveLeaguePayload(leagueData.league);
      const league = await League.findOne({ name: leagueData.league.name });
      // Step 3: Save the season data
      await saveSeasonPayload(league, leagueData.seasons);
    });
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

const saveLeaguePayload = async (leagueData) => {
  // Save the leagues data
  leagueData = leagueData.isArray ? leagueData : [leagueData];
  const leagues = leagueData.map((league) => ({
    id: league.id,
    name: league.name,
    type: league.type,
    logo: league.logo,
  }));
  const bulkOps = leagueData.map((league) => ({
    updateOne: {
      filter: { id: league.id },
      update: {
        $set: {
          id: league.id,
          name: league.name,
          type: league.type,
          logo: league.logo,
        },
      },
      upsert: true,
    },
  }));
  await League.bulkWrite(bulkOps)
    .then(() => {
      // console.log("Leagues saved successfully");
    })
    .catch((err) => console.error("Error saving leagues:", err));
  return leagues;
};

const saveSeasonPayload = async (league, seasonData) => {
  // Save the seasons data
  seasonData = seasonData.isArray ? seasonData[0] : seasonData;
  const seasons = seasonData.map((season) => ({
    league: league._id,
    leagueId: league.id,
    year: season.year,
    start: season.start,
    end: season.end,
    current: season.current,
  }));
  const bulkOps = seasons.map((season) => ({
    updateOne: {
      filter: { league: season.league, year: season.year },
      update: {
        $set: {
          league: season.league,
          leagueId: season.leagueId,
          year: season.year,
          start: season.start,
          end: season.end,
          current: season.current,
        },
      },
      upsert: true,
    },
  }));
  await Season.bulkWrite(bulkOps)
    .then(() => {
      // console.log("Season saved successfully");
    })
    .catch((err) => console.error("Error saving season:", err));
  return seasons;
};

const getTeam = async (req, res) => {
  try {
    const teamId = req.query.teamId;
    const leagueId = req.query.leagueId;
    teamUrl = process.env.API_SPORTS_URL + "/teams";
    const teamParams = new URLSearchParams();
    if (teamId) teamParams.append("id", teamId);
    if (leagueId) teamParams.append("league", leagueId);
    teamUrl += "?" + teamParams.toString();
    console.log("teamUrl: " + teamUrl);

    const response = await axiosInstance.get(teamUrl, {
      headers: {
        "x-rapidapi-host": process.env.API_SPORTS_HOST,
        "x-rapidapi-key": process.env.API_SPORTS_API_KEY,
      },
      cache: {
        ttl: 1000 * 60 * 60 * 24, // Update once per day
      },
    });
    response.data.response.forEach(async (team) => {
      await saveTeamPayload(team);
    });
    return JSON.stringify(response.data);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

const saveTeamPayload = async (teamData) => {
  try {
    console.log("Team Payload:" + JSON.stringify(teamData));
    const team = new Team({
      id: teamData.team.id,
      name: teamData.team.name,
      code: teamData.team.code,
      country: teamData.team.country,
      founded: teamData.team.founded,
      national: teamData.team.national,
      logo: teamData.team.logo,
    });
    const venue = new Venue({
      id: teamData.venue.id,
      name: teamData.venue.name,
      address: teamData.venue.address,
      city: teamData.venue.city,
      capacity: teamData.venue.capacity,
      surface: teamData.venue.surface,
      image: teamData.venue.image,
    });
    await Team.updateOne(team, { ordered: false, upsert: true });
    console.log("Teams saved successfully!");
    await Venue.updateOne(venue, { ordered: false, upsert: true });
    console.log("Venues saved successfully!");
    return JSON.stringify(response.data);
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

module.exports = router;
