const router = require("express").Router();
let Team = require("../models/football/Team.js");
let Venue = require("../models/football/Venue.js");
let League = require("../models/football/League.js");
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
  await getTeams(req, res);

  if (req.query.season) {
    query.year = query.season;
    delete query.season;
  }
  Team.find(query)
    .then((teams) => {
      teams.sort((a, b) => a.name.localeCompare(b.name));
      res.json(teams);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

const getTeams = async (req, res) => {
  try {
    const teamId = req.query.teamId;
    const leagueId = req.query.leagueId;
    const season = req.query.season;
    teamUrl = process.env.API_SPORTS_URL + "/teams";
    const teamParams = new URLSearchParams();
    if (teamId) teamParams.append("id", teamId);
    if (leagueId) teamParams.append("league", leagueId);
    if (season) teamParams.append("season", season);
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
    console.log("getTeams response: " + response.data.response);

    await Promise.all(
      response.data.response.map(async (team) => {
        return saveTeam(leagueId, season, team);
      })
    );

    return JSON.stringify(response.data.response);
  } catch (error) {
    console.log(error);
    return "Error fetching data";
  }
};

const saveTeam = async (leagueId, season, teamData) => {
  try {
    const league = await League.findOne({ id: leagueId });
    teamData.league = league._id;
    teamData.leagueId = leagueId;
    teamData.year = season;
    saveTeamPayload(teamData);
  } catch (error) {
    console.error("Error saving team:", error);
  }
};

const saveTeamPayload = async (teamData) => {
  try {
    const team = new Team({
      teamId: teamData.team.id,
      id: teamData.team.id,
      league: teamData.team.league,
      leagueId: teamData.team.leagueId,
      year: teamData.team.year,
      name: teamData.team.name,
      code: teamData.team.code,
      country: teamData.team.country,
      founded: teamData.team.founded,
      national: teamData.team.national,
      logo: teamData.team.logo,
    });
    await Team.updateOne(
      {
        teamId: teamData.team.id,
        leagueId: teamData.leagueId,
        year: teamData.year,
      },
      {
        $set: {
          id: teamData.team.id,
          teamId: teamData.team.id,
          league: teamData.league,
          leagueId: teamData.leagueId,
          year: teamData.year,
          name: teamData.team.name,
          code: teamData.team.code,
          country: teamData.team.country,
          founded: teamData.team.founded,
          national: teamData.team.national,
          logo: teamData.team.logo,
        },
      },
      { upsert: true }
    );
    console.log("Teams saved successfully!");
    const venue = new Venue({
      id: teamData.venue.id,
      name: teamData.venue.name,
      address: teamData.venue.address,
      city: teamData.venue.city,
      capacity: teamData.venue.capacity,
      surface: teamData.venue.surface,
      image: teamData.venue.image,
    });
    await Venue.updateOne(
      { id: teamData.venue.id },
      {
        $set: {
          name: teamData.venue.name,
          address: teamData.venue.address,
          city: teamData.venue.city,
          capacity: teamData.venue.capacity,
          surface: teamData.venue.surface,
          image: teamData.venue.image,
        },
      },
      { upsert: true }
    );
    return JSON.stringify(teamData);
  } catch (error) {
    console.error("Error saving payload:", error);
  }
};

module.exports = router;
