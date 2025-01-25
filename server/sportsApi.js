// const { LeagueRoot, League, Country, Season, Coverage } = require("./models/football");
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to handle API requests
router.get('/test', async (req, res) => {
    var config = {
      method: 'get',
      url: process.env.API_SPORTS_URL + '/leagues',
      headers: {
        'x-rapidapi-host': process.env.API_SPORTS_HOST,
        'x-rapidapi-key': process.env.API_SPORTS_API_KEY
      }
    };
    
    axios(config)
    .then(function (response) {
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });    
  });
  
  module.exports = router;