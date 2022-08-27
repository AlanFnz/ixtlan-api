/////////////////////////////////////////////////////
// FIXME: we need to properly arrange these tests ///
///////// once we have a stable dev database with ///
///////// a superadmin user for tests             ///
/////////////////////////////////////////////////////
import app from "../../app";
import supertest from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import { firstUserBody } from "../users/users.test"; // FIXME: replace this with superadmin creds on env variables

const featureBody = {
  name: 'Test feature',
  version: "1.0.0",
  minimumAppVersion: "1.0.0",
  enabledIOS: true,
  enabledAndroid: true,
  enabledWeb: true,
}
let featureId = "";
let accessToken = "";
let refreshToken = "";

describe("features endpoints", function () {
  let request: supertest.SuperAgentTest;
  before(function () {
    request = supertest.agent(app);
  });

  after(function (done) {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it("should allow a GET from /features with an access token", async function () {
    // get tokens
    const authRes = await request.post("/auth").send(firstUserBody);
    accessToken = authRes.body.accessToken;
    refreshToken = authRes.body.refreshToken;
    /////////////

    const res = await request
      .get("/features")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("array");

    if (res.body.length > 0 && res.body[0]._id) featureId = res.body[0]._id;
  });

  it("should allow a POST from /features with an access token", async function () {
    const res = await request
      .post("/features")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send(featureBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an("object");
    expect(res.body._id).to.be.a("string");
    expect(res.body.name).to.be.a("string");
    expect(res.body.version).to.be.a("string");
    expect(res.body.minimmumAppVersion).to.be.a("string");
    expect(res.body.enabledIOS).to.be.a("boolean");
    expect(res.body.enabledAndroid).to.be.a("boolean");
    expect(res.body.enabledWeb).to.be.a("boolean");
  });

  if (featureId) {
    it("should allow a GET from /features/:featureId with an access token", async function () {
      const res = await request
        .post(`/features/${featureId}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      expect(res.status).to.equal(200);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an("object");
      expect(res.body._id).to.be.a("string");
      expect(res.body._id).to.be.equal(featureId);
      expect(res.body.name).to.be.a("string");
      expect(res.body.version).to.be.a("string");
      expect(res.body.minimmumAppVersion).to.be.a("string");
      expect(res.body.enabledIOS).to.be.a("boolean");
      expect(res.body.enabledAndroid).to.be.a("boolean");
      expect(res.body.enabledWeb).to.be.a("boolean");
    });
  }
});
