const express = require("express");

//Import the controller function to handle regions data
const { getRegions } = require("../controllers/regionsController");

const router = express.Router();

//Define route to get a list of regions
//Endpoint: /
//When a GET request is made to this route, it calls the getRegions controller
router.get("/", getRegions);

module.exports = router;
