// const axios = require("axios");
// const HttpError = require("../models/http-error");

// const API_KEY = "AIzaSyDIOyEOl_PmPZY9TgSxSVQKioK2DN9myWU";

async function getCoordsForAddress(address) {
  // const response = await axios.get(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&key=${API_KEY}`
  // );

  // const data = response.data
  // if(data){
  //   console.log(data)
  // }
  // if(!data || data.status === 'ZERO_RESULTS'){
  //     const error = new HttpError('could not find the location for specified address', 400)
  //     throw error
  // }

  // const coordinates = data.results[0].geometry.location
  // return coordinates

  return {
    lat: 40.7484405,
    lng: -73.9878584
  }
}

module.exports = getCoordsForAddress
