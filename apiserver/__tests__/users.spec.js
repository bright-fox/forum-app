import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import User from "../models/user";
import Refreshtoken from "../models/refreshtoken";
import Post from "../models/post";
import Comment from "../models/comment";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";

beforeAll(async () => {
  await User.deleteMany({}).exec();
  await Refreshtoken.deleteMany({}).exec();
});

afterAll(async () => {
  mongoose.disconnect();
});

describe("User Routes", () => {
  let userId;
  let idToken;

  beforeEach(async done => {
    const res = await request(app)
      .post("/register")
      .send({ username: "testperson", password: "password", email: "test@person.com", biography: "", gender: "male" });

    userId = res.body.user._id;
    idToken = res.body.idToken;
    done();
  });

  afterEach(async () => {
    await User.deleteMany({}).exec();
    await Refreshtoken.deleteMany({}).exec();
  });

  describe("GET search user", () => {
    test("it should return empty array", async done => {
      const res = await request(app).get("/users/search?q=");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("users");
      expect(res.body.users).toEqual([]);
      done();
    });

    test("it should return array with one entry", async done => {
      const res = await request(app).get("/users/search?q=testperson");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("users");
      expect(res.body.users).toHaveLength(1);
      done();
    });
  });

  describe("GET specific user", () => {
    test("it should get public profile", async done => {
      const res = await request(app).get(`/users/${userId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("user");
      done();
    });

    test("fail to get public profile due to wrong id", async done => {
      const res = await request(app).get("/users/aaaaaaaaaaaaaaaaaaaaaaaa");
      expect(res.statusCode).toEqual(404);
      done();
    });

    test("it should get the private profile", async done => {
      const res = await request(app)
        .get(`/users/${userId}/private`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("user");
      done();
    });
  });

  describe("PUT update specific user", () => {
    test("it should update biography", async done => {
      const res = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", "bearer " + idToken)
        .send({ biography: "updated bio" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("user");

      done();
    });

    test("fail to update biography", async done => {
      const res = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(400);
      done();
    });

    test("it should update the password", async done => {
      const res = await request(app)
        .put(`/users/${userId}/password`)
        .set("Authorization", "bearer " + idToken)
        .send({ oldPassword: "password", newPassword: "newPassword" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("idToken");
      expect(res.body).toHaveProperty("refreshToken");
      done();
    });

    test("fail to update password due to no input", async done => {
      const res = await request(app)
        .put(`/users/${userId}/password`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(400);
      done();
    });

    test("fail to update password due to wrong password", async done => {
      const res = await request(app)
        .put(`/users/${userId}/password`)
        .set("Authorization", "bearer " + idToken)
        .send({ oldPassword: "wrongPassword", newPassword: "newPassword" });

      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("DELETE user", () => {
    test("it should delete user", async done => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set("Authorization", "bearer " + idToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("docId");
      done();
    });
  });

  describe("GET Posts, Comments, Communities from user", () => {
    describe("successful get requests", () => {
      beforeEach(async () => {
        const community = new Community({
          name: "testcommunity",
          creator: userId,
          description: "test description"
        });
        const createdCommunity = await community.save();

        const member = new CommunityMember({ community: createdCommunity._id, member: userId });
        await member.save();

        const post = new Post({
          title: "testpost",
          content: "test content",
          author: userId,
          community: createdCommunity._id
        });
        const createdPost = await post.save();

        const comment = new Comment({ content: "test comment", post: createdPost._id, author: userId });
        await comment.save();
      });

      afterEach(async () => {
        await Community.deleteMany({}).exec();
        await CommunityMember.deleteMany({}).exec();
        await Post.deleteMany({}).exec();
        await Comment.deleteMany({}).exec();
      });

      test("it should get the home page posts", async done => {
        const res = await request(app)
          .get(`/users/${userId}/home/page/1`)
          .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("posts");
        expect(res.body).toHaveProperty("maxPage");
        expect(res.body).toHaveProperty("currentPage");
        done();
      });

      test("it should get the posts of user", async done => {
        const res = await request(app).get(`/users/${userId}/posts/page/1`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("posts");
        expect(res.body).toHaveProperty("maxPage");
        expect(res.body).toHaveProperty("currentPage");
        done();
      });

      test("it should get the comments of user", async done => {
        const res = await request(app).get(`/users/${userId}/comments/page/1`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("comments");
        expect(res.body).toHaveProperty("maxPage");
        expect(res.body).toHaveProperty("currentPage");
        done();
      });

      test("it should get the communities where user is member", async done => {
        const res = await request(app).get(`/users/${userId}/communities/page/1`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("communities");
        expect(res.body).toHaveProperty("maxPage");
        expect(res.body).toHaveProperty("currentPage");
        done();
      });
    });

    describe("failing get requests", () => {
      test("fail to get home page due to wrong page", async done => {
        const res = await request(app)
          .get(`/users/${userId}/home/page/wrongpage`)
          .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(400);
        done();
      });

      test("fail to get posts due to wrong page", async done => {
        const res = await request(app).get(`/users/${userId}/posts/page/wrongpage`);

        expect(res.statusCode).toEqual(400);
        done();
      });

      test("fail to get comments due to wrong page", async done => {
        const res = await request(app).get(`/users/${userId}/comments/page/wrongpage`);

        expect(res.statusCode).toEqual(400);
        done();
      });

      test("fail to get communities due to wrong page", async done => {
        const res = await request(app).get(`/users/${userId}/communities/page/wrongpage`);

        expect(res.statusCode).toEqual(400);
        done();
      });
    });
  });
});
