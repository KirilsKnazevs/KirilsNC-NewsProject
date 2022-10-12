const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics_controllers");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles_controllers");
const { getUsers } = require("./controllers/users_controllers");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/error_controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/users", getUsers);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
