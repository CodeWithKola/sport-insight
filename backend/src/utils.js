const axios = require("axios");
require("dotenv").config(); //Load environment variables from .env file

/**
 * Fetch data from an external API with optional query parameters.
 *
 * @param {string} url - The endpoint to append to the base API URL.
 * @param {object} params - Optional query parameters for the API request.
 * @returns {object} - A structured response containing success status, data, or an error message.
 */

const fetchData = async (url, params = {}) => {
  const apiUrl = `${process.env.SPORT_API_URL}${url}`; //Construct the full API URL
  const token = process.env.SPORT_API_KEY; //Fetch the API key from environment variables

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`, //Include the API token in the request headers
      },
      params, //Add query parameters to the request
    });

    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      return {
        success: false,
        message: "Error fetching data",
        data: response.data,
      };
    }
  } catch (error) {
    //Handle errors that occur during the request
    if (error.response) {
      //The API responded with an error status
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Error fetching data",
        data: error.response.data,
      };
    } else if (error.request) {
      //No response was received from the API
      return {
        success: false,
        status: 500,
        message: "No response received while fetching data",
        error: error.message,
      };
    } else {
      //A critical error occurred while setting up the request
      return {
        success: false,
        status: 500,
        message: "A critical error occurred",
        error: error.message,
      };
    }
  }
};

/**
 * Handle the API response and send it back to the client.
 *
 * @param {object} res - The Express response object.
 * @param {object} result - The result object returned by fetchData.
 * @returns {object} - Sends a structured JSON response to the client.
 */

const handleResponse = (res, result) => {
  if (result.success) {
    //Send the successful response data to the client
    return res.json(result.data);
  } else {
    //Send an error response, status and message
    return res.status(result.status || 400).json({
      message: result.message,
      data: result.data || result.error,
    });
  }
};

module.exports = {
  fetchData,
  handleResponse,
};
