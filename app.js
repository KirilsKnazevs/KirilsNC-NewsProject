const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics_controllers");
const { getArticleById } = require("./controllers/articles_controllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/error_controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
