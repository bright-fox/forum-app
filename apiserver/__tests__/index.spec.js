import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user";
import Refreshtoken from "../models/refreshtoken";

afterAll(async () => {
  await User.deleteMany({}).exec();
  await Refreshtoken.deleteMany({}).exec();
  mongoose.disconnect();
});

describe("Index Endpoints", () => {
  const user = { username: "testperson", email: "test@person.com", password: "password", biography: "" };

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    await Refreshtoken.deleteMany({}).exec();
  });
  describe("Register Route", () => {
    test("register a user", async done => {
      const res = await request(app)
        .post("/register")
        .send(user);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success");
      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("idToken");
      expect(res.body).toHaveProperty("refreshToken");
      done();
    });

    test("fail to register due to wrong input", async done => {
      const res = await request(app)
        .post("/register")
        .send({ username: "testperson", email: "testing.com" });
      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("Login Route", () => {
    test("login a user", async done => {
      const newUser = new User(user);
      await newUser.save();

      const res = await request(app)
        .post("/login")
        .send({ username: "testperson", password: "password" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("idToken");
      expect(res.body).toHaveProperty("refreshToken");
      done();
    });

    test("fail to login due to no input", async done => {
      const res = await request(app).post("/login");
      expect(res.statusCode).toEqual(400);
      done();
    });

    test("fail to login due to wrong username", async done => {
      const res = await request(app)
        .post("/login")
        .send({ username: "noperson", password: "password" });
      expect(res.statusCode).toEqual(404);
      done();
    });

    test("fail to login due to wrong password", async done => {
      const newUser = new User(user);
      await newUser.save();
      const res = await request(app)
        .post("/login")
        .send({ username: "testperson", password: "wrongpassword" });
      expect(res.statusCode).toEqual(403);
      done();
    });
  });

  describe("Token route", () => {
    let refreshToken;

    beforeEach(async done => {
      const res = await request(app)
        .post("/register")
        .send(user);
      refreshToken = res.body.refreshToken;
      done();
    });

    test("get id token", async done => {
      const res = await request(app)
        .post("/token")
        .send({ refreshToken });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("idToken");
      done();
    });

    test("fail to get token due to no input", async done => {
      const res = await request(app).post("/token");
      expect(res.statusCode).toEqual(400);
      done();
    });

    test("fail to get token due to wrong input", async done => {
      const res = await request(app)
        .post("/token")
        .send({ refreshToken: "wrongtoken" });
      expect(res.statusCode).toEqual(400);
      done();
    });
  });

  describe("Logout Route", () => {
    let refreshToken;

    beforeEach(async done => {
      const res = await request(app)
        .post("/register")
        .send(user);
      refreshToken = res.body.refreshToken;
      done();
    });

    test("it should logout the user", async done => {
      const res = await request(app)
        .post("/logout")
        .send({ refreshToken });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success");
      done();
    });
  });
});
