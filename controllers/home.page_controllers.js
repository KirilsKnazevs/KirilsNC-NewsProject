const db = require("../db/connection");
const endpoints = require("../endpoints.json");

exports.getHomePage = (req, res, next) => {
  res.status(200).send(endpoints);
};
