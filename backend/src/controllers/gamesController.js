const { fetchData, handleResponse } = require("../utils"); //Import utility functions for fetching data and handling responses

exports.getGames = async (req, res) => {
  //Pull out the filter params from the query string
  //We can filter by region, date range, or specific match code
  const { region, startDate, endDate, match } = req.query;

  //Build query params
  const params = {};

  //Add filters if they were provided in the request
  if (region) params.region = region;
  if (match) params.match_code = match;

  //If we only get startDate, treat it as a single-day filter
  if (startDate && !endDate) {
    params.date = startDate; //Use startDate as a single date if endDate is not provided
  }
  //If we get both dates, set up a date range filter
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  //Make the API call with our constructed params
  const result = await fetchData("/football/games", params);

  //Send the filtered games back to the frontend
  handleResponse(res, result);
};
