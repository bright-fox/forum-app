import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import User from "../models/user";
import Post from "../models/post";
import Community from "../models/community";
import Refreshtoken from "../models/refreshtoken";

let idToken;
// let refreshToken;
let communityId;
let userId;

beforeAll(async done => {
  await User.deleteMany({}).exec();
  await Post.deleteMany({}).exec();
  await Refreshtoken.deleteMany({}).exec();

  const res = await request(app)
    .post("/register")
    .send({ username: "testperson", password: "password", email: "test@person.com", biography: "", gender: "male" });
  // refreshToken = res.body.refreshToken;
  idToken = res.body.idToken;
  userId = res.body.user._id;

  const community = new Community({
    name: "testcommunity",
    description: "test description",
    creator: res.body.user._id
  });
  const createdCommunity = await community.save();
  communityId = createdCommunity._id;
  done();
});

afterAll(async () => {
  await User.deleteMany({}).exec();
  await Refreshtoken.deleteMany({}).exec();
  await Community.deleteMany({}).exec();
  await mongoose.disconnect();
});

describe("Post Routes", () => {
  let postId;

  beforeEach(async done => {
    // const res = await request(app)
    //   .post("/token")
    //   .send({ refreshToken });
    // idToken = res.body.idToken;

    const post = new Post({
      title: "testpost",
      content: "test content",
      author: userId,
      community: communityId
    });
    const createdPost = await post.save();
    postId = createdPost._id;
    done();
  });

  afterEach(async () => {
    await Post.deleteMany({}).exec();
  });

  describe("GET search post", () => {
    test("it should return empty array", async done => {
      const res = await request(app).get("/posts/search?q=");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts).toEqual([]);
      done();
    });

    test("it should return array with one entry", async done => {
      const res = await request(app).get("/posts/search?q=testpost");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("posts");
      expect(res.body.posts).toHaveLength(1);
      done();
    });
  });

  describe("GET all posts", () => {
    test("it should get all posts", async done => {
      const res = await request(app).get(`/posts/page/1`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("posts");
      expect(res.body).toHaveProperty("currentPage");
      expect(res.body).toHaveProperty("maxPage");
      done();
    });

    test("fail to get post due to wrong page input", async done => {
      const res = await request(app).get(`/posts/page/wrongpage`);

      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("POST a post", () => {
    test("it should create a post", async done => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", "bearer " + idToken)
        .send({ title: "testpost 2", content: "test content", author: userId, community: communityId });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("post");
      done();
    });

    test("fail to create post due to no input", async done => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", "bearer " + idToken)
        .send({ community: communityId });

      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("GET specific post", () => {
    test("it should get post", async done => {
      const res = await request(app).get(`/posts/${postId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("post");
      done();
    });

    test("fail to get post due to no existence", async done => {
      const res = await request(app).get("/posts/aaaaaaaaaaaaaaaaaaaaaaaa");
      expect(res.statusCode).toEqual(404);
      done();
    });
  });

  describe("PUT specific post", () => {
    test("it should update post", async done => {
      const res = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", "bearer " + idToken)
        .send({ title: " updated post", content: "updated content" });

      expect(res.statusCode).toEqual(200);
      done();
    });

    test("fail to update post due to missing input", async done => {
      const res = await request(app)
        .put(`/posts/${postId}`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("DELETE specific post", () => {
    test("it should delete post", async done => {
      const res = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("docId");
      done();
    });
  });
});
