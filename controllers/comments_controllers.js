const db = require("../db/connection");
const { selectCommentsByArticleId } = require("../models/comments_models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((commentsList) => {
      res.status(200).send({ commentsList });
    })
    .catch(next);
};
