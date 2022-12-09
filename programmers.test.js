const app = require("./programmers");
const request = require("supertest");
const prisma = require("./prisma/client");

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

describe("GET /auth/me", () => {
  test("Should check if authenticated or not", async () => {
    const path = "/auth/me";
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

// let auth = {};

// async function before(response) {
//   const hashedPassword = await bcrypt.hash("secret", 1);
//   await prisma.user.create( {
// user: "test", password: "secret"
//   })
//     `INSERT INTO users (username, password)
//         VALUES ('test', $1)`,
//     [hashedPassword];
//   const response = await request(app)
//     .post("/auth/me")
//     .send({
//       username: "test",
//       password: "secret"
//     });

//   // we'll need the token for future requests
//   auth.token = response.body.token;

//   // we'll need the user_id for future requests
//   auth.curr_user_id = "test"
// };

// describe("POST /auth", () => {
//   test("Should require authentication", async function (done) {
//     const path = "/auth/me";
//     const response = await testApp.get(path);

//     before(response)

//   });
// });
