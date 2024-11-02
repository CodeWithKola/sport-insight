const axios = require("axios");
require("dotenv").config();

exports.getGames = async (req, res) => {
  const apiUrl = `${process.env.SPORT_API_URL}/football/games`;
  const token = process.env.SPORT_API_KEY;

  // Extract query params
  const { region, startDate, endDate, searchTerm, limit, page } = req.query;

  // Building query params
  const params = {};
  if (region) params.region = region;
  if (startDate && !endDate) {
    params.date = startDate; // if endDate is not provided, use startDate as date
  }
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    if (response.data.success) {
      return res.json(response.data.data);
    } else {
      return res.status(400).json({
        message: "Error fetching data",
        data: response.data,
      });
    }
  } catch (error) {
    // Handle error responses from the API
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message || "Error fetching data",
        data: error.response.data,
      });
    } else if (error.request) {
      // No response was received
      return res.status(500).json({
        message: "No response received while fetching data",
        error: error.message,
      });
    } else {
      // Critical issue, Something went wrong
      return res.status(500).json({
        message: "A critical error occurred",
        error: error.message,
      });
    }
  }
};
