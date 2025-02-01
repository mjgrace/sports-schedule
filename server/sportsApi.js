const LeagueRoot = require("./models/football/LeagueRoot");
const League = require("./models/football/League");
const Country = require("./models/football/Country");
const Season = require("./models/football/Season");
const Coverage = require("./models/football/Coverage");

module.exports = {
  LeagueRoot,
  League,
  Country,
  Season,
  Coverage,
};

const mongoose = require("mongoose");
const express = require('express');
const axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');
const connectDB = require('./config/db');

const router = express.Router();

const axiosInstance = setupCache(axios.create(), {
  ttl: 1000 * 60 * 5, // Cache for 5 minutes
  interpretHeader: true, // Respect HTTP headers
});

// Route to handle API requests
router.get('/test', async (req, res) => {    
    try {
      const response = await axiosInstance.get(process.env.API_SPORTS_URL + '/leagues', {
        headers: {
          'x-rapidapi-host': process.env.API_SPORTS_HOST,
          'x-rapidapi-key': process.env.API_SPORTS_API_KEY
        }
      });
      saveLeagueRootPayload(response.data);
      res.send(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching data");
    }
});

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
  } finally {
    // mongoose.connection.close();
  }
};

module.exports = router;