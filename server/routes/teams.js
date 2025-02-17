const router = require("express").Router();
let Team = require("../models/football/Team.js");

router.route("/").get((req, res) => {
  Team.find()
    .then((teams) => res.json(teams))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
