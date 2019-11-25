process.env.NODE_ENV = "test";
process.env.PORT = 3001;
process.env.MONGODB_URI = "mongodb://localhost:27017/testforum";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../";
import User from "../models/user";

let should = chai.should();
chai.use(chaiHttp);

describe("Index Routes", () => {
  beforeEach(done => {
    User.deleteMany({}, err => {
      done();
    });
  });
  describe("Register User", () => {
    it("it should register a user", done => {
      const user = { username: "testperson", email: "person@test.com", password: "password", biography: "" };
      chai
        .request(server)
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          done();
        });
    });
  });
});
