const express = require("express");
const { getGames } = require("../controllers/gamesController");

const router = express.Router();

router.get("/", getGames);

module.exports = router;
