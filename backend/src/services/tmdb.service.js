const axios = require("axios");

const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({

    baseURL: BASE_URL,

    params: {

        api_key: process.env.TMDB_API_KEY,

        language: "fr-FR"

    }

});

module.exports = api;