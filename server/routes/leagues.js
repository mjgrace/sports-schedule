const router = require("express").Router();
let League = require("../models/football/League.js");

router.route("/").get((req, res) => {
  // Create a query object for filtering
  let query = {};
  if (req.query.id) query.id = id; // Filter by ID
  League.find(query)
    .then((leagues) => res.json(leagues))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
