const db = require("../db/connection");
const {
  selectArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/articles_models");

exports.getArticles = (req, res, next) => {
  const {
    query: { sort_by, order, topic },
  } = req;
  selectArticles(sort_by, order, topic)
    .then((articlesList) => {
      res.status(200).send({ articlesList });
    })
    .catch(next);
};

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
