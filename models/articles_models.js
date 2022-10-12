const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(articles.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return result.rows[0];
    });
};

exports.updateArticleById = (article_id, votes) => {
  if (votes && typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING*;`,
        [votes, article_id]
      )
      .then(({ rows: [article] }) => {
        if (article === undefined) {
          return Promise.reject({ status: 404, msg: "Id not found" });
        }
        return article;
      });
  }
};
