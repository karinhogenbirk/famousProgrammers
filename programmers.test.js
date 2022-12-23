const app = require("./programmers");
const request = require("supertest");
const prisma = require("./prisma/client");
var jwt = require("jsonwebtoken");
const { PrismaClientValidationError } = require("@prisma/client/runtime");

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

describe.only("GET /questions/totalresults", () => {
  test("Should show resultlist of all programmers", async () => {
    const path = "/questions/totalresults";
    const response = await testApp.get(path);
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
      email: "karinhogenbirktest123@gmail.com",
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
      message: "Login succesful",
    });

    await clearUser(newUser.email);
  });
});

function createToken(userId) {
  var token = jwt.sign({ id: userId }, process.env.SECRET_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

describe("GET /auth/me", () => {
  test("Should return user when authenticated", async () => {
    const newUser = await prisma.user.createMany({
      data: {
        email: "alfredhogenbirk@gmail.com",
        password: "password",
      },
    });
    console.log(newUser);
    const newUserId = newUser.id;
    const path = "/auth/me";
    const response = await testApp
      .get(path)
      .set("Authorization", `Bearer ${createToken(newUserId)}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: expect.any(String) });

    await clearUser(newUser.email);
  });

  test("Should return bad request with no bearer", async () => {
    const newUser = await prisma.user.createMany({
      data: {
        email: "karinhogenbirkemail@gmail.com",
        password: "password",
      },
    });

    const newUserId = newUser.id;
    const path = "/auth/me";
    const response = await testApp
      .get(path)
      .set("Authorization", createToken(newUserId));

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
  const path = "/auth/create";
  test("Should be able to create new programmer", async () => {
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

  test("Should return bad request if programmer already exists", async () => {
    const newProgrammer = {
      name: "Evan Williams",
      project: "Testing project",
      vote: 0,
    };
    const response = await testApp
      .post(path)
      .send(newProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "This programmer already exists in the database. To update, go to the update page."
    );
  });

  test("Returns ZodError if not enough characters", async () => {
    const newProgrammer = {
      firstname: " ",
      surname: "i",
      project: "Testing project",
      vote: 0,
    };
    const response = await testApp
      .post(path)
      .send(newProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Bad request - must have enough characters"
    );
  });

  test("Should escape html", async () => {
    const newProgrammer = {
      name: "<h1>Karin</h1>",
      project: "<button>Click me</button>",
      vote: 0,
    };
    const response = await testApp
      .post(path)
      .send(newProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.body.programmer).toBe("&lt;h1&gt;Karin&lt;/h1&gt;");

    await clearProgrammer(newProgrammer);
  });
});

describe("POST /auth/find", () => {
  const path = "/auth/find";
  test("Should be able to find a new programmer with full name", async () => {
    const findProgrammer = { firstname: "karin", surname: "hogenbirk" };

    const response = await testApp
      .post(path)
      .send(findProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Programmers found:");
  });

  test("Should be able to find a new programmer with only firstname", async () => {
    const findProgrammer = { firstname: "karin" };

    const response = await testApp
      .post(path)
      .send(findProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Programmers found:");
  });

  test("Should be able to find a new programmer with only lastname", async () => {
    const findProgrammer = { surname: "hogenbirk" };

    const response = await testApp
      .post(path)
      .send(findProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Programmers found:");
  });

  test("Should return not found if programmer not in database", async () => {
    const findProgrammer = { surname: "jantje" };

    const response = await testApp
      .post(path)
      .send(findProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(404);
  });
});

async function resetProgrammer(programmerName) {
  const resetProgrammer = await prisma.programmer.updateMany({
    where: {
      name: programmerName,
    },
    data: {
      knownFor: "Creating the famous programmers' API",
    },
  });
  console.log(resetProgrammer);
}

describe("PATCH /auth/update", () => {
  const path = "/auth/update";
  test("Should be able to update programmer", async () => {
    const updateProgrammer = {
      firstname: "Karin",
      surname: "Hogenbirk",
      project: "Testen",
    };
    const response = await testApp
      .patch(path)
      .send(updateProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(201);

    await resetProgrammer(
      updateProgrammer.firstname + " " + updateProgrammer.surname
    );
  });

  test("Can't update programmer if project already exists", async () => {
    const updateProgrammer = {
      firstname: "John",
      surname: "Scholes",
      project: "Direct functions",
    };

    const response = await testApp
      .patch(path)
      .send(updateProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Project already exists in database. No changes made"
    );
  });
});

async function addProgrammer(firstname, surname) {
  const addProgrammer = await prisma.programmer.create({
    data: {
      name: firstname + " " + surname,
      knownFor: "Lex",
      vote: 0,
    },
  });
}

describe("DELETE /auth/delete", () => {
  const path = "/auth/delete";
  test("Should be able to delete programmer from database", async () => {
    const deleteProgrammer = {
      firstname: "Michael",
      surname: "Lesk",
    };
    const response = await testApp
      .delete(path)
      .send(deleteProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(201);

    await addProgrammer(deleteProgrammer.firstname, deleteProgrammer.surname);
  });

  test("Can't delete if programmer doesn't exist", async () => {
    const deleteProgrammer = {
      firstname: "Hola",
      surname: "Hola",
    };
    const response = await testApp
      .delete(path)
      .send(deleteProgrammer)
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);

    expect(response.status).toBe(404);
  });
});
