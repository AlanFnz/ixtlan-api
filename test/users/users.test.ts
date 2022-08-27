import app from "../../app";
import supertest from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";

let firstUserIdTest = "";
export const firstUserBody = {
  email: `test@test.test`,
  password: "test1234",
  username: "test",
  birthDate: 564519600000,
};

let accessToken = "";
let refreshToken = "";

describe("users and auth endpoints", function () {
  let request: supertest.SuperAgentTest;
  before(function () {
    request = supertest.agent(app);
  });

  after(function (done) {
    // shut down express server, close mongo connection and  tell mocha we're done
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it("should allow a POST to /users", async function () {
    const res = await request.post("/users").send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    firstUserIdTest = res.body._id;
  });

  it("should allow a POST to /auth", async function () {
    const res = await request.post("/auth").send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body.accessToken).to.be.a("string");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should allow a GET from /users/:userId with an access token", async function () {
    const res = await request
      .get(`/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    expect(res.body._id).to.equal(firstUserIdTest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  describe("with a valid access token", function () {
    it("should allow a GET from /users", async function () {
      const res = await request
        .get(`/users`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      expect(res.status).to.equal(403);
    });
  });

  it("should allow a DELETE from /users/:userId being the user itself", async function () {
    const res = await request
      .delete(`/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });
});
