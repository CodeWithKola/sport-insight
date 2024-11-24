const express = require("express");

//Import the controller function to handle games data
const { getGames } = require("../controllers/gamesController");

const router = express.Router();

//Define route to get a list of games
//Endpoint: /
//When a GET request is made to this route, it calls the getGames controller
router.get("/", getGames);

module.exports = router;
