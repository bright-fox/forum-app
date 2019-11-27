import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user";
import Refreshtoken from "../models/refreshtoken";
import Community from "../models/community";
import Post from "../models/post";
import CommunityMember from "../models/communityMember";

let idToken;
const user = { username: "testperson", password: "password" };
const community = { name: "testlovers", description: "We love to test REST APIs" };

const createCommunity = async () => {
  const res = await request(app)
    .post("/communities")
    .set("Authorization", "bearer " + idToken)
    .send(community);

  return res.body.community;
};

beforeAll(async done => {
  await User.deleteMany({}).exec();
  await Refreshtoken.deleteMany({}).exec();
  await Community.deleteMany({}).exec();
  await request(app)
    .post("/register")
    .send({ ...user, email: "test@person.com", biography: "" });
  done();
});

afterAll(async () => {
  await User.deleteMany({}).exec();
  mongoose.disconnect();
});

describe("Community Routes", () => {
  beforeEach(async done => {
    const res = await request(app)
      .post("/login")
      .send(user);
    idToken = res.body.idToken;
    done();
  });

  afterEach(async () => {
    await Refreshtoken.deleteMany({}).exec();
    await Community.deleteMany({}).exec();
  });

  describe("GET all communities", () => {
    test("it should get all communities", async done => {
      await createCommunity();

      const res = await request(app).get("/communities/page/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("communities");
      expect(res.body).toHaveProperty("currentPage");
      expect(res.body).toHaveProperty("maxPage");
      done();
    });

    test("fail to get communities due to wrong type of page", async done => {
      const res = await request(app).get("/communities/page/wrongpage");
      expect(res.statusCode).toEqual(400);
      done();
    });

    test("fail to get communities due to no pages and also check custom sanitizer", async done => {
      const res = await request(app).get("/communities/page/-1");
      expect(res.statusCode).toEqual(404);
      done();
    });
  });

  describe("POST community", () => {
    test("it should create community", async done => {
      const res = await request(app)
        .post("/communities")
        .set("Authorization", "bearer " + idToken)
        .send(community);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success");
      expect(res.body).toHaveProperty("community");
      done();
    });

    test("fail to create community due to no input", async done => {
      const res = await request(app)
        .post("/communities")
        .set("Authorization", "bearer " + idToken);
      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("GET specific community", () => {
    test("it should get community", async done => {
      const createdCommunity = await createCommunity();
      const res = await request(app).get("/communities/" + createdCommunity._id);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("community");
      done();
    });

    test("fail to get community due to wrong id", async done => {
      const res = await request(app).get("/communities/aaaaaaaaaaaaaaaaaaaaaaaa");
      expect(res.statusCode).toEqual(404);
      done();
    });
  });

  describe("PUT update specific community", () => {
    test("it should update community", async done => {
      const createdCommunity = await createCommunity();
      const res = await request(app)
        .put("/communities/" + createdCommunity._id)
        .set("Authorization", "bearer " + idToken)
        .send({ name: "update", description: "updated Description" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success");
      done();
    });

    test("fail to update community due to wrong input", async done => {
      const createdCommunity = await createCommunity();
      const res = await request(app)
        .put("/communities/" + createdCommunity._id)
        .set("Authorization", "bearer " + idToken)
        .send({ name: "wrong update", description: "updated Description" });
      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("DELETE specific community", () => {
    test("it should delete community", async done => {
      const createdCommunity = await createCommunity();
      const res = await request(app)
        .delete("/communities/" + createdCommunity._id)
        .set("Authorization", "bearer " + idToken);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success");
      expect(res.body).toHaveProperty("docId");
      done();
    });
  });

  describe("GET all posts of a community", () => {
    beforeEach(async () => {
      await Post.deleteMany({}).exec();
    });

    afterEach(async () => {
      await Post.deleteMany({}).exec();
    });

    test("it should get all posts for a specific community", async done => {
      const createdCommunity = await createCommunity();
      await request(app)
        .post("/posts")
        .set("Authorization", "bearer " + idToken)
        .send({ title: "testpost", content: "Lorem ipsum", community: createdCommunity._id });

      const res = await request(app).get(`/communities/${createdCommunity._id}/posts/page/1`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("posts");
      expect(res.body).toHaveProperty("currentPage");
      expect(res.body).toHaveProperty("maxPage");
      done();
    });

    test("fail to get any posts due to wrong page input", async done => {
      const createdCommunity = await createCommunity();
      const res = await request(app).get(`/communities/${createdCommunity._id}/posts/page/wronginput`);
      expect(res.statusCode).toEqual(400);
      done();
    });

    test("fail to get posts due to no posts published", async done => {
      const createdCommunity = await createCommunity();
      const res = await request(app).get(`/communities/${createdCommunity._id}/posts/page/1`);
      expect(res.statusCode).toEqual(404);
      done();
    });
  });

  describe("Community Member Routes", () => {
    beforeEach(async () => {
      await CommunityMember.deleteMany({}).exec();
    });

    afterEach(async () => {
      await CommunityMember.deleteMany({}).exec();
    });

    describe("/POST become member of community", () => {
      test("it should create communitymember", async done => {
        const createdCommunity = await createCommunity();
        const res = await request(app)
          .post(`/communities/${createdCommunity._id}/member`)
          .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("success");
        done();
      });

      test("fail to become member of community due to no existence", async done => {
        const res = await request(app)
          .post("/communities/aaaaaaaaaaaaaaaaaaaaaaaa/member")
          .set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(500);
        done();
      });
    });

    describe("/DELETE remove member of community", () => {
      test("it should delete a community member", async done => {
        const createdCommunity = await createCommunity();
        await request(app)
          .post(`/communities/${createdCommunity._id}/member`)
          .set("Authorization", "bearer " + idToken);
        const member = await CommunityMember.findOne({ community: createdCommunity._id })
          .lean()
          .exec();

        const res = await request(app)
          .delete(`/communities/${createdCommunity._id}/member/${member._id}`)
          .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("docId");
        done();
      });

      test("fail to delete member due to no existence", async done => {
        const createdCommunity = await createCommunity();
        const res = await request(app)
          .delete(`/communities/${createdCommunity._id}/member/aaaaaaaaaaaaaaaaaaaaaaaa`)
          .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(404);
        done();
      });
    });
  });
});
