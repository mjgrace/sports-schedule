const router = require("express").Router();
let Country = require("../models/football/Country.js");

router.route("/").get((req, res) => {
  // Create a query object for filtering
  let query = {};
  if (req.query.name) query.name = req.query.name;
  Country.find(query)
    .then((countries) => {
      countries.sort((a, b) => a.name.localeCompare(b.name));
      res.json(countries);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
