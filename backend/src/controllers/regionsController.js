const axios = require("axios");
require("dotenv").config();

exports.getRegions = async (req, res) => {
  const apiUrl = `${process.env.SPORT_API_URL}/football/regions`;
  const token = process.env.SPORT_API_KEY;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      //No response was received
      return res.status(500).json({
        message: "No response received while fetching data",
        error: error.message,
      });
    } else {
      //Critical issue, Something went wrong
      return res.status(500).json({
        message: "A critical error ocuured",
        error: error.message,
      });
    }
  }
};
