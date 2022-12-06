const app = require("./programmers");
const request = require("supertest");

const testApp = request(app);

describe("GET /programmers", () => {
  test("Should show list of programmers", async () => {
    const path = "/programmers";
    const response = await testApp.get("/programmers");

    console.log(response.body);
  });
});

describe("GET /questions", () => {
  test("Should generate random question about programmer", async () => {
    const path = "/questions/programmers/random";
    const response = await testApp.get("/questions/programmers/random");

    console.log(response.body);
  });

  test("Should generate random question about project", async () => {
    const path = "/questions/projects/random";
    const response = await testApp.get("/questions/projects/random");

    console.log(response.body);
  });
});

describe("GET /questions/results", () => {
  test("Should show list of top 5 programmers", async () => {
    const path = "/questions/results";
    const response = await testApp.get("/questions/results");

    console.log(response.body);
  });
});

describe("GET /auth/me", () => {
  test("Should check if authenticated or not", async () => {
    const path = "/auth/me";
    const response = await testApp.get("/auth/me");

    console.log(response.body);
  });
});
