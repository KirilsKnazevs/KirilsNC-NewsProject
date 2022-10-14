const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortByValues = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderValues = ["asc", "desc"];
  const validTopicValues = ["mitch", "cats", undefined];
  if (!validSortByValues.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by value" });
  }
  if (!validOrderValues.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }
  if (!validTopicValues.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid topic value" });
  }

  let baseSQLStart = `SELECT articles.*, COUNT(articles.article_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
`;

  let baseSQLMiddle = ` `;
  if (topic !== undefined) {
    baseSQLMiddle += `WHERE topic = '${topic}'`;
  }

  let baseSQLEnd = `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;

  let fullSQL = baseSQLStart + baseSQLMiddle + baseSQLEnd;

  return db.query(fullSQL).then((result) => {
    const articles = result.rows;
    return articles;
  });
};

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
