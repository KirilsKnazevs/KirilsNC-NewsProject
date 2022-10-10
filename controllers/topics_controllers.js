const { selectTopics } = require("../models/topics_models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topicsList) => {
    res.status(200).send({ topicsList });
  });
};
