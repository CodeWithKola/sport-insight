const { fetchData, handleResponse } = require("../utils"); //Import utility functions for fetching data and handling responses

//Controller function to get home stats for a specific game
exports.getHomeStats = async (req, res) => {
  const { gameCode } = req.params;
  const result = await fetchData(`/football/stats/${gameCode}/home-matches`); //Fetch home stats for the game using the fetchData utility
  //Send whatever we got back to the frontend
  //handleResponse will take care of error cases for us
  handleResponse(res, result);
};

//Controller function to get away stats for a specific game
exports.getAwayStats = async (req, res) => {
  const { gameCode } = req.params;
  const result = await fetchData(`/football/stats/${gameCode}/away-matches`); //Fetch away stats for the game using the fetchData utility
  //Send whatever we got back to the frontend
  //handleResponse will take care of error cases for us
  handleResponse(res, result);
};

//Controller function to get head-to-head stats for a specific game
exports.getH2HStats = async (req, res) => {
  const { gameCode } = req.params;
  const result = await fetchData(`/football/stats/${gameCode}/head-to-head`); //Fetch head-to-head stats for the game using the fetchData utility
  //Send whatever we got back to the frontend
  //handleResponse will take care of error cases for us
  handleResponse(res, result);
};
