const router = require("express").Router();
let Team = require("../models/football/Team.js");

router.route("/").get((req, res) => {
  // Create a query object for filtering
  let query = {};
  if (req.query.leagueId) query.leagueId = req.query.leagueId;
  if (req.query.year) query.year = req.query.year;
  Team.find(query)
    .then((teams) => {
      teams.sort((a, b) => a.name.localeCompare(b.name));
      res.json(teams);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
