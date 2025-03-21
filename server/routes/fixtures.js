const router = require("express").Router();
const axios = require("axios");
const { setupCache } = require("axios-cache-interceptor");

const axiosInstance = setupCache(axios.create(), {
  ttl: 1000 * 60 * 5, // Cache for 5 minutes
  interpretHeader: true, // Respect HTTP headers
});

router.route("/").get(async (req, res) => {
  // Create a query object for filtering
  let query = {};
  if (req.query.leagueId) query.leagueId = req.query.leagueId;
  if (req.query.season) query.season = req.query.season;
  if (req.query.date) query.date = req.query.date;
  await getFixtures(req, res).then((data) => res.json(data));
});

const getFixtures = async (req, res) => {
  try {
    const leagueId = req.query.leagueId;
    const season = req.query.season;
    const date = req.query.date;
    fixtureUrl = process.env.API_SPORTS_URL + "/fixtures";
    const fixtureParams = new URLSearchParams();
    if (leagueId) fixtureParams.append("league", leagueId);
    if (season) fixtureParams.append("season", season);
    if (date) fixtureParams.append("date", date);
    fixtureUrl += "?" + fixtureParams.toString();
    console.log("fixtureUrl: " + fixtureUrl);

    const response = await axiosInstance.get(fixtureUrl, {
      headers: {
        "x-rapidapi-host": process.env.API_SPORTS_HOST,
        "x-rapidapi-key": process.env.API_SPORTS_API_KEY,
      },
      cache: {
        ttl: 1000 * 15, // Update for one minute
      },
    });
    console.log("getFixtures response: " + response.data.response);

    return JSON.stringify(response.data.response);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

module.exports = router;
