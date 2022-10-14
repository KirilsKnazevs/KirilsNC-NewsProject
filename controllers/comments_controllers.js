const db = require("../db/connection");
const {
  selectCommentsByArticleId,
  insertCommentsByArticleId,
  removeCommentById,
} = require("../models/comments_models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((commentsList) => {
      res.status(200).send({ commentsList });
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  insertCommentsByArticleId(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((delComment) => {
      res.status(204).send({ delComment });
    })
    .catch(next);
};
