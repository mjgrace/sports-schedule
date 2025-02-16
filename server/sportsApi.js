const LeagueRoot = require("./models/football/LeagueRoot");
const League = require("./models/football/League");
const Country = require("./models/football/Country");
const Season = require("./models/football/Season");
const Timezone = require("./models/football/Timezone");
const Venue = require("./models/football/Venue");
const Team = require("./models/football/Team");

module.exports = {
  LeagueRoot,
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
      await saveSeasonPayload(league._id, leagueData.seasons);
    });
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

const saveLeaguePayload = async (leagueData) => {
  // Save the leagues data
  leagueData = leagueData.isArray ? leagueData : [leagueData];
  const leagues = leagueData.map((league) => ({
    name: league.name,
    type: league.type,
    logo: league.logo,
  }));
  const bulkOps = leagueData.map((league) => ({
    updateOne: {
      filter: { name: league.name },
      update: {
        $set: { name: league.name, type: league.type, logo: league.logo },
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

const saveSeasonPayload = async (leagueId, seasonData) => {
  // Save the seasons data
  seasonData = seasonData.isArray ? seasonData[0] : seasonData;
  console.log("Season Data: " + JSON.stringify(seasonData));
  const seasons = seasonData.map((season) => ({
    league: leagueId,
    year: season.year,
    start: season.start,
    end: season.end,
    current: season.current,
  }));
  console.log("Seasons: " + JSON.stringify(seasons));
  const bulkOps = seasons.map((season) => ({
    updateOne: {
      filter: { league: season.league, year: season.year },
      update: {
        $set: {
          league: season.league,
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
    const teamUrl =
      process.env.API_SPORTS_URL +
      "/teams" +
      (teamId ? "?id=" + encodeURIComponent(teamId) : "");
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
    saveTeamPayload(response.data);
    return JSON.stringify(response.data);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

const saveTeamPayload = async (payload) => {
  try {
    console.log("Team Payload:" + JSON.stringify(payload));
    const team = new Team({
      id: payload.response[0].team.id,
      name: payload.response[0].team.name,
      code: payload.response[0].team.code,
      country: payload.response[0].team.country,
      founded: payload.response[0].team.founded,
      national: payload.response[0].team.national,
      logo: payload.response[0].team.logo,
    });
    const venue = new Venue({
      id: payload.response[0].venue.id,
      name: payload.response[0].venue.name,
      address: payload.response[0].venue.address,
      city: payload.response[0].venue.city,
      capacity: payload.response[0].venue.capacity,
      surface: payload.response[0].venue.surface,
      image: payload.response[0].venue.image,
    });
    await Team.insertMany(team, { ordered: false });
    console.log("Teams saved successfully!");
    await Venue.insertMany(venue, { ordered: false });
    console.log("Venues saved successfully!");
    return JSON.stringify(response.data);
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

module.exports = router;
