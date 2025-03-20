const router = require("express").Router();
let Season = require("../models/football/Season.js");
let League = require("../models/football/League.js");

router.route("/").get((req, res) => {
  // Create a query object for filtering
  let seasonQuery = {};
  if (req.query.leagueId) seasonQuery.leagueId = req.query.leagueId;
  if (req.query.year) seasonQuery.year = req.query.year;
  if (req.query.current) seasonQuery.current = req.query.current;

  let leagueQuery = {};
  if (req.query.countryName) leagueQuery.countryName = req.query.countryName;

  Season.find(seasonQuery)
    .then((seasons) =>
      Promise.all(
        seasons.map((season) =>
          League.findById(season.league).then((league) => {
            season.league = league;
            return season;
          })
        )
      )
    )
    .then((seasons) => {
      seasons = seasons.filter((season) => {
        console.log("League: " + JSON.stringify(season.league));
        console.log("Country Name: " + leagueQuery.countryName);
        return (
          season.league !== null &&
          season.league.countryName === leagueQuery.countryName
        );
      });
      console.log(JSON.stringify(seasons));
      seasons.sort((a, b) => a.league.name.localeCompare(b.league.name));
      res.json(seasons);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/years").get((req, res) => {
  Season.distinct("year")
    .then((seasons) => res.json(seasons))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
