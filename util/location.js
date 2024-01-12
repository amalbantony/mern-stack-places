const axios = require("axios");

const HttpError = require("../modal/http-error");

const API_KEY = "AIzaSyDTyJ4e-K0ZhYt0W7mtrxyA6y3RSF_pSRo";

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&inputtype=textquery&fields=geometry&key=${API_KEY}`
  );

  const data = response.data;

  console.log("Data GeoCode Api", data);

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
