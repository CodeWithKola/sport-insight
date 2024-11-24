const express = require("express");
//Import controller functions for handling stats-related requests
const {
  getHomeStats,
  getAwayStats,
  getH2HStats,
} = require("../controllers/statsController");

const router = express.Router();

//Define route to get statistics for home team based on the game code
//Endpoint: /:gameCode/home
router.get("/:gameCode/home", getHomeStats);

//Define route to get statistics for away team based on the game code
//Endpoint: /:gameCode/away
router.get("/:gameCode/away", getAwayStats);

//Define route to get head-to-head (H2H) statistics based on the game code
//Endpoint: /:gameCode/h2h
router.get("/:gameCode/h2h", getH2HStats);

module.exports = router;
