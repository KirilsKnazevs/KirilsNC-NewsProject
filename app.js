const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics_controllers");
const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("./controllers/articles_controllers");
const {
  getCommentsByArticleId,
  postCommentsByArticleId,
  deleteCommentById,
} = require("./controllers/comments_controllers");
const { getUsers } = require("./controllers/users_controllers");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/error_controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
