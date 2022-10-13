const db = require("../db/connection");

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comments.*
    FROM comments
    JOIN articles ON articles.article_id = comments.article_id
    WHERE comments.article_id=$1
    ORDER BY created_at DESC;`,
      [id]
    )
    .then((result) => {
      const commentsByArtilceId = result.rows;
      if (commentsByArtilceId.length === 0) {
        return Promise.reject({
          status: 200,
          msg: "This article has no comments",
        });
      }
      return commentsByArtilceId;
    });
};
