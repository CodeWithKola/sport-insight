const express = require("express");
const { getRegions } = require("../controllers/regionsController");

const router = express.Router();

router.get("/", getRegions);

module.exports = router;
