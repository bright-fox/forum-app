import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import User from "../models/user";
import Post from "../models/post";
import Refreshtoken from "../models/refreshtoken";
import Community from "../models/community";
import Comment from "../models/comment";

let idToken;
// let refreshToken;
let postId;
let userId;

beforeAll(async done => {
  await resetCollections();
  const res = await request(app)
    .post("/register")
    .send({ username: "testperson", password: "password", email: "test@person.com", biography: "", gender: "male" });
  idToken = res.body.idToken;
  // refreshToken = res.body.refreshToken;
  userId = res.body.user._id;

  const community = new Community({
    name: "testlovers",
    description: "We love to test REST APIs",
    creator: userId
  });
  const createdCommunity = await community.save();

  const post = new Post({
    title: "testpost",
    content: "test content",
    author: userId,
    community: createdCommunity._id
  });
  const createdPost = await post.save();
  postId = createdPost._id;
  done();
});

afterAll(async () => {
  await resetCollections();
  await mongoose.disconnect();
});

describe("Comment Routes", () => {
  afterEach(async () => {
    await Comment.deleteMany({}).exec();
  });

  describe("GET comments from post", () => {
    test("it should get all comments", async done => {
      const firstComment = await createComment(postId, userId, "First comment");
      const secondComment = await createComment(postId, userId, "Second comment", firstComment._id);
      const res = await request(app).get(`/posts/${postId}/comments/page/1`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("comments");
      expect(res.body).toHaveProperty("currentPage");
      expect(res.body).toHaveProperty("maxPage");
      done();
    });

    test("fail to get comments due to wrong page", async done => {
      const res = await request(app).get(`/posts/${postId}/comments/page/wrongpage`);
      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("POST create comment", () => {
    test("it should create comment", async done => {
      const res = await request(app)
        .post(`/posts/${postId}/comments`)
        .set("Authorization", "bearer " + idToken)
        .send({ content: "test comment" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("comment");
      done();
    });

    test("fail to create comment due to no content", async done => {
      const res = await request(app)
        .post(`/posts/${postId}/comments`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(400);
      done();
    });

    test("it should save comment to comment", async done => {
      const firstComment = await createComment(postId, userId, "First comment");

      const res = await request(app)
        .post(`/posts/${postId}/comments`)
        .set("Authorization", "bearer " + idToken)
        .send({ content: "test comment", replyTo: firstComment._id });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("comment");
      done();
    });
  });

  describe("PUT update comment", () => {
    test("it should update the comment", async done => {
      const firstComment = await createComment(postId, userId, "First comment");

      const res = await request(app)
        .put(`/posts/${postId}/comments/${firstComment._id}`)
        .set("Authorization", "bearer " + idToken)
        .send({ content: "updated comment" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("comment");
      done();
    });

    test("fail to update comment due to no input", async done => {
      const firstComment = await createComment(postId, userId, "First comment");

      const res = await request(app)
        .put(`/posts/${postId}/comments/${firstComment._id}`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("DELETE comment", () => {
    test("it should delete the comment", async done => {
      const firstComment = await createComment(postId, userId, "test comment");

      const res = await request(app)
        .delete(`/posts/${postId}/comments/${firstComment._id}`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("docId");
      done();
    });
  });
});

async function resetCollections() {
  await User.deleteMany({}).exec();
  await Refreshtoken.deleteMany({}).exec();
  await Community.deleteMany({}).exec();
  await Post.deleteMany({}).exec();
  await Comment.deleteMany({}).exec();
};

async function createComment(post, author, content, replyTo) {
  const comment = { post, author, content };
  if (replyTo) comment.replyTo = replyTo;
  return await new Comment(comment).save();
};
