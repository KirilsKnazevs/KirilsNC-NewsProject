const request = require("supertest");
const app = require("../../KirilsNC-NewsProject/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { expect } = require("@jest/globals");
const toBeSortedBy = require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("1. 03-GET /api/topics", () => {
  test("status:200, responds with an array of test topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topicsList).toBeInstanceOf(Array);
        expect(body.topicsList).toHaveLength(3);
        body.topicsList.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
        expect(body).toEqual({
          topicsList: [
            {
              description: "The man, the Mitch, the legend",
              slug: "mitch",
            },
            {
              description: "Not dogs",
              slug: "cats",
            },
            {
              description: "what books are made of",
              slug: "paper",
            },
          ],
        });
      });
  });
});

describe("2. 04-GET /api/articles/:article_id", () => {
  test("status:200, responds with a test article object by it's id", () => {
    const ARTICLE_ID = 2;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: ARTICLE_ID,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: `2020-10-16T05:03:00.000Z`,
            votes: 0,
          })
        );
      });
  });
  test("status 400, responds with an error message when passed an invalid id", () => {
    const ARTICLE_ID = "Pizza";
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
  test("status 404, responds with an error message when passed a valid id but it's object is empty in the database", () => {
    const ARTICLE_ID = 1337;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found");
      });
  });
});

describe("3. 05-GET /api/users", () => {
  test("status:200, responds with an array of a test users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.usersList).toBeInstanceOf(Array);
        expect(body.usersList).toHaveLength(4);
        body.usersList.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
        expect(body.usersList).toEqual([
          {
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            name: "jonny",
            username: "butter_bridge",
          },
          {
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            name: "sam",
            username: "icellusedkars",
          },
          {
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul",
            username: "rogersop",
          },
          {
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            name: "do_nothing",
            username: "lurker",
          },
        ]);
      });
  });
});

describe("4. 06-PATCH /api/articles/:article_id", () => {
  test("status 200, responds with the updated article", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .patch(`/api/articles/${ARTICLE_ID}`)
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 50,
        });
      });
  });
  test("status 400, responds with an error message when passed invalid id", () => {
    const ARTICLE_ID = "Pizza";
    return request(app)
      .patch(`/api/articles/${ARTICLE_ID}`)
      .send({ inc_votes: -50 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
  test("status 400, responds with an error message when passed invalid input", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .patch(`/api/articles/${ARTICLE_ID}`)
      .send({ inc_votes: "Pizza" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status 400, responds with an error message when passed empty object", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .patch(`/api/articles/${ARTICLE_ID}`)
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("status 404, responds with an error message when passed a valid id but it's object is empty in the database", () => {
    const ARTICLE_ID = 1337;
    return request(app)
      .patch(`/api/articles/${ARTICLE_ID}`)
      .send({ inc_votes: -50 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found");
      });
  });
});

describe("5. 07-GET_comment_count /api/articles/:article_id", () => {
  test("status:200, responds with a test article object by it's id with comment_count column", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: ARTICLE_ID,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: "11",
          })
        );
      });
  });
});

describe("6. 08-GET_articles /api/articles", () => {
  test("status:200, responds with an array of test articles objects", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesList).toBeInstanceOf(Array);
        expect(body.articlesList).toHaveLength(12);
        body.articlesList.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("status:200, responds with an array of test articles objects filtered by 'cats' topic", () => {
    return request(app)
      .get(`/api/articles?topic=cats`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesList).toBeInstanceOf(Array);
        expect(body.articlesList).toHaveLength(1);
        body.articlesList.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
  test("status:200, responds with an array of test articles objects filtered by 'mitch' topics", () => {
    return request(app)
      .get(`/api/articles?topic=mitch`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesList).toBeInstanceOf(Array);
        expect(body.articlesList).toHaveLength(11);
        body.articlesList.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("status:400, responds with an error message when filtered by invalid topic", () => {
    return request(app)
      .get(`/api/articles?topic=pizza`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid topic value");
      });
  });
});

describe("7. 09-GET /api/articles/:article_id/comments Returns all comments from given article_id", () => {
  test("status:200, responds with an array of test comments for given article_id objects", () => {
    return request(app)
      .get(`/api/articles/9/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.commentsList).toBeInstanceOf(Array);
        expect(body.commentsList).toHaveLength(2);
        body.commentsList.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("status:200, responds with a message if given article has no comments", () => {
    return request(app)
      .get(`/api/articles/2/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("This article has no comments");
      });
  });
  test("status 400, responds with an error message when passed an invalid id", () => {
    return request(app)
      .get(`/api/articles/pizza/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});

describe("8. 10-POST /api/articles/:article_id/comments Returns posted comment on given article_id", () => {
  test("status:201, responds with new comments for given test article_id objects", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love pizza",
    };
    return request(app)
      .post(`/api/articles/2/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBeInstanceOf(Array);
        expect(body.comment).toHaveLength(1);
        body.comment.forEach((testcomment) => {
          expect(testcomment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              body: "I love pizza",
              article_id: 2,
              author: "butter_bridge",
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("status:404, responds with an error message when passed invalid username", () => {
    const newComment = {
      username: "PizzaLover",
      body: "I love pizza",
    };
    return request(app)
      .post(`/api/articles/2/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("status:404, responds with an error message when passed valid id that doesn't exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love pizza",
    };
    return request(app)
      .post(`/api/articles/1337/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("status:400, responds with an error message when passed invalid input in body", () => {
    const newComment = {
      username: "butter_bridge",
      body: 1234,
    };
    return request(app)
      .post(`/api/articles/2/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:400, responds with an error message when passed an empty object", () => {
    const newComment = {};
    return request(app)
      .post(`/api/articles/2/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("status:400, responds with an error message when passed an invalid id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love pizza",
    };
    return request(app)
      .post(`/api/articles/pizza/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});

describe("9. 11-GET /api/articles(queries) Returns an array of test articles objects with sort_by and order queries", () => {
  test("status:200, responds with an array of aricles objects sorted by query value: title", () => {
    return request(app)
      .get(`/api/articles?sort_by=title`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesList).toBeInstanceOf(Array);
        expect(body.articlesList).toHaveLength(12);
        expect(body.articlesList).toBeSortedBy("title", {
          coerce: true,
        });
      });
  });
  test("status:200, respond with an array of articles objects ordered by order value: default=created_at", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesList).toBeSortedBy("created_at", {
          coerce: true,
        });
      });
  });
  test("status:400, responds with an error message when sort by query is invalid", () => {
    return request(app)
      .get(`/api/articles?sort_by=pizza`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by value");
      });
  });
  test("status:200, respond with an array of articles objects ordered by order value: comment_count asc", () => {
    return request(app)
      .get(`/api/articles?sort_by=comment_count&order=asc`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articlesList).toBeSortedBy("comment_count", {
          ascending: true,
          coerce: true,
        });
      });
  });
  test("status:400, respond with an error message when order query is invalid", () => {
    return request(app)
      .get(`/api/articles?sort_by=comment_count&order=pizza`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order value");
      });
  });
});
