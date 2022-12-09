const app = require("./programmers");
const request = require("supertest");
const prisma = require("./prisma/client");
var jwt = require("jsonwebtoken");

const testApp = request(app);
afterEach(async function () {
  await prisma.$disconnect();
});

//

describe("GET /programmers", () => {
  test("Should show list of programmers", async () => {
    const path = "/programmers";
    const response = await testApp.get(path);

    console.log(response.body);
  });
});

describe("GET /questions", () => {
  test("Should generate random question about programmer", async () => {
    const path = "/questions/programmers/random";
    const response = await testApp.get(path);

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
    const response = await testApp.get(path);

    console.log(response.body);
  });
});

async function clearUser(newUser) {
  const clearUser = await prisma.user.deleteMany({
    where: {
      email: newUser,
    },
  });
  await prisma.$disconnect();
}

describe("POST /signup and login", () => {
  test("Should be able to sign up and login", async () => {
    const signupPath = "/programmers/signup";
    const newUser = {
      email: "karinhogstestingenv@hotmail.com",
      password: "mypassword",
    };

    const response = await testApp.post(signupPath).send(newUser);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Your account is created");

    const loginPath = "/programmers/login";
    const responseLogin = await testApp.post(loginPath).send(newUser);
    console.log(responseLogin.body);
    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toEqual({
      user: expect.any(String),
      token: expect.any(String),
    });

    await clearUser(newUser.email);
  });
});

var token = jwt.sign({ id: 1 }, process.env.SECRET_TOKEN, {
  expiresIn: "1h",
});

describe("GET /auth/me", (authentication) => {
  test("Should return user when authenticated", async () => {
    const path = "/auth/me";
    const response = await testApp
      .get(path)
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: expect.any(String) });
  });

  test("Should return bad request with no bearer", async () => {
    const path = "/auth/me";
    const response = await testApp.get(path).set("Authorization", token);

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Bad request - header must include Bearer"
    );
  });

  test("Should return bad request without token", async () => {
    const path = "/auth/me";
    const response = await testApp.get(path).set("Authorization", "Bearer ");
    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bad request - invalid or empty token");
  });
});

async function clearProgrammer(newProgrammer) {
  const clearUser = await prisma.programmer.deleteMany({
    where: {
      name: newProgrammer.name,
    },
  });
  await prisma.$disconnect();
}

describe("POST /auth/create", () => {
  test("Should be able to create new programmer", async () => {
    const path = "/auth/create";
    const newProgrammer = {
      name: "Alfred Hogenbirk",
      project: "Test case",
      vote: 0,
    };
    const response = await testApp
      .post(path)
      .send(newProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Programmer added! Thank you for the update."
    );

    await clearProgrammer(newProgrammer);
  });
});

describe("POST /auth/find", () => {
  test("Should be able to find a new programmer with full name", async () => {
    const path = "/auth/find";
    const findProgrammer = { firstname: "karin", surname: "hogenbirk" };

    const response = await testApp
      .post(path)
      .send(findProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Programmer found:");
  });
});
