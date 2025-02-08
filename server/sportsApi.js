const LeagueRoot = require("./models/football/LeagueRoot");
const League = require("./models/football/League");
const Country = require("./models/football/Country");
const Season = require("./models/football/Season");
const Coverage = require("./models/football/Coverage");
const Timezone = require("./models/football/Timezone");
const Venue = require("./models/football/Venue");
const Team = require("./models/football/Team");

module.exports = {
  LeagueRoot,
  League,
  Country,
  Season,
  Coverage,
  Timezone,
  Venue,
  Team
};

const mongoose = require("mongoose");
const express = require('express');
const axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');

const router = express.Router();

const axiosInstance = setupCache(axios.create(), {
  ttl: 1000 * 60 * 5, // Cache for 5 minutes
  interpretHeader: true, // Respect HTTP headers
});

// Route to retrieve leagues
router.get('/leagues', async (req, res) => {    
  getLeagues(req, res);
});

// Test Route to get data points
router.get('/test', async (req, res) => {    
  result = '';
  try {
    timezones = await getTimezones(req, res);
    result += "Timezones: " + timezones;
    countries = await getCountries(req, res);
    result += "Countries: " + countries;
    // leagues = await getLeagues(req, res);
    // result += "\nLeagues: " + leagues;
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
    const response = await axiosInstance.get(process.env.API_SPORTS_URL + '/timezone', {
      headers: {
        'x-rapidapi-host': process.env.API_SPORTS_HOST,
        'x-rapidapi-key': process.env.API_SPORTS_API_KEY
      },
      cache: {
        update: false, // Don't update cache if expired
      },
    });
    timezones = saveTimezonePayload(response.data);
    return(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
    return("Error fetching data");
  }
}

const saveTimezonePayload = async (payload) => {
  // Save the timezone data
  const timezones = payload.response.map(zone => ({ timezone: zone }));
  const bulkOps = payload.response.map(zone => ({
    updateOne: {
      filter: { timezone: zone },
      update: { $set: { timezone: zone } },
      upsert: true
    }
  }));
  await Timezone.bulkWrite(bulkOps)
    .then(() => 
      console.log('Timezones saved successfully'))
    .catch(err => 
      console.error('Error saving timezones:', err)
    );
  return timezones;
}

const getCountries = async (req, res) => {
  try {
    const response = await axiosInstance.get(process.env.API_SPORTS_URL + '/countries', {
      headers: {
        'x-rapidapi-host': process.env.API_SPORTS_HOST,
        'x-rapidapi-key': process.env.API_SPORTS_API_KEY
      },
      cache: {
        ttl: 1000 * 60 * 60 * 24, // Update once per day
      },
    });
    countries = saveCountryPayload(response.data);
    return(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
    return("Error fetching data");
  }
}

const saveCountryPayload = async (payload) => {
  // Save the country data
  const countries = payload.response.map(country => ({ name: country.name, code: country.code, flag: country.flag }));
  const bulkOps = payload.response.map(country => ({
    updateOne: {
      filter: { name: country.name },
      update: { $set: { name: country.name, code: country.code, flag: country.flag } },
      upsert: true
    }
  }));
  await Country.bulkWrite(bulkOps)
    .then(() => 
      console.log('Countries saved successfully'))
    .catch(err => 
      console.error('Error saving countries:', err)
    );
  return countries;
}

const getLeagues = async (req, res) => {
  try {
    const response = await axiosInstance.get(process.env.API_SPORTS_URL + '/leagues', {
      headers: {
        'x-rapidapi-host': process.env.API_SPORTS_HOST,
        'x-rapidapi-key': process.env.API_SPORTS_API_KEY
      },
      cache: {
        ttl: 1000 * 60 * 60, // Update once per hour
      },

    });
    saveLeagueRootPayload(response.data);
    return(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
    return("Error fetching data");
  }
}

const saveLeagueRootPayload = async (payload) => {
  try {
    // Step 1: Save the coverage data
    const coverage = new Coverage(payload.response[0].seasons[0].coverage);
    await coverage.save();

    // Step 2: Save the season data with coverage reference
    const seasons = await Promise.all(
      payload.response[0].seasons.map(async (seasonData) => {
        const season = new Season({
          ...seasonData,
          coverage: coverage._id,
        });
        await season.save();
        return season._id;
      })
    );

    // Step 3: Save the country data
    const country = new Country(payload.response[0].country);
    await country.save();

    // Step 4: Save the league data
    const league = new League(payload.response[0].league);
    await league.save();

    // Step 5: Save the root object (LeagueRoot)
    const leagueRoot = new LeagueRoot({
      get: payload.get,
      parameters: payload.parameters,
      errors: payload.errors,
      results: payload.results,
      paging: payload.paging,
      response: [
        {
          league: league._id,
          country: country._id,
          seasons: seasons,
        },
      ],
    });
    await leagueRoot.save();

    console.log("Payload saved successfully!");
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

const getTeam = async (req, res) => {
  try {
      const teamId = req.query.teamId;
      const teamUrl = process.env.API_SPORTS_URL + "/teams" + (teamId ? ("?id=" + encodeURIComponent(teamId)) : '')
      console.log("teamUrl: " + teamUrl);

      const response = await axiosInstance.get(teamUrl, {
      headers: {
        'x-rapidapi-host': process.env.API_SPORTS_HOST,
        'x-rapidapi-key': process.env.API_SPORTS_API_KEY
      },
      cache: {
        ttl: 1000 * 60 * 60 * 24, // Update once per day
      },

    });
    saveTeamPayload(response.data);
    return(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
    return("Error fetching data");
  }
}

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
      logo: payload.response[0].team.logo    
    });
    const venue = new Venue({
      id: payload.response[0].venue.id,
      name: payload.response[0].venue.name,
      address: payload.response[0].venue.address,
      city: payload.response[0].venue.city,
      capacity: payload.response[0].venue.capacity,
      surface: payload.response[0].venue.surface,
      image: payload.response[0].venue.image
    });
    await Team.insertMany(team, { ordered: false });
    console.log('Teams saved successfully!');
    await Venue.insertMany(venue, { ordered: false });
    console.log('Venues saved successfully!');
    return(JSON.stringify(response.data));
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

module.exports = router;