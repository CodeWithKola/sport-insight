const express = require("express");
const {
  getHomeStats,
  getAwayStats,
  getH2HStats,
} = require("../controllers/statsController");

const router = express.Router();

router.get("/:gameCode/home", getHomeStats);
router.get("/:gameCode/away", getAwayStats);
router.get("/:gameCode/h2h", getH2HStats);

module.exports = router;
