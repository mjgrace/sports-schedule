const router = require("express").Router();
let Season = require("../models/football/Season.js");
let League = require("../models/football/League.js");

router.route("/").get((req, res) => {
  // Create a query object for filtering
  let query = {};
  if (req.query.leagueId) query.leagueId = req.query.leagueId;
  if (req.query.year) query.year = req.query.year;
  if (req.query.current) query.current = req.query.current;
  Season.find(query)
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
    .then((seasons) => res.json(seasons))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
