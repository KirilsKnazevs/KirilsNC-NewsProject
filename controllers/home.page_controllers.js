const db = require("../db/connection");

exports.getHomePage = (req, res, next) => {
  res.status(200).send({ message: "Welcome" });
};
