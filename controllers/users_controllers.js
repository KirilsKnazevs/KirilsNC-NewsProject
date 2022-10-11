const { selectUsers } = require("../models/users_models");

exports.getUsers = (req, res, next) => {
  selectUsers().then((usersList) => {
    res.status(200).send({ usersList });
  });
};
