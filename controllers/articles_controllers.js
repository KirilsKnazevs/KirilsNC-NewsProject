const db = require("../db/connection");
const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles_models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const votes = req.body.inc_votes;
  updateArticleById(article_id, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
