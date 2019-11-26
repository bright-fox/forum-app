import request from "supertest";
import User from "../models/user";

import app from "../app";

describe("Index Endpoints", () => {
  beforeEach(async done => {
    await User.deleteMany({}).exec();
    done();
  });
  test("Register Route", async done => {
    const user = { username: "testperson", email: "test@person.de", password: "password", biography: "" };
    const res = await request(app)
      .post("/register")
      .send(user);
    expect(res.statusCode).toEqual(200);
    done();
  });
});
