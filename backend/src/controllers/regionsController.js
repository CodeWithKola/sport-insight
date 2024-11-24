const { fetchData, handleResponse } = require("../utils"); //Import utility functions for fetching data and handling responses
exports.getRegions = async (req, res) => {
  const result = await fetchData("/football/regions"); //Fetch available regions
  //Send whatever we got back to the frontend
  //handleResponse will take care of error cases for us
  handleResponse(res, result);
};
