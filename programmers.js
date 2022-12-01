// api & app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(logger);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const z = require("zod");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

const {
  createRandomProgrammerQuestion,
  createRandomProjectQuestion,
} = require("./utils/questions");
const { empty } = require("@prisma/client/runtime");

app.listen(PORT, () => {
  console.log("It works!");
});

app.get("/programmers", async (req, res) => {
  const programmers = await prisma.programmer.findMany();
  return res.json(programmers);
});

app.get("/questions/programmers/random", async (req, res) => {
  const programmers = await prisma.programmer.findMany();
  res.json(createRandomProgrammerQuestion(programmers));
});

app.get("/questions/projects/random", async (req, res) => {
  const programmers = await prisma.programmer.findMany();
  res.json(createRandomProjectQuestion(programmers));
});

async function giveTimeOutPenalty(programmerOrProject) {
  const result = await prisma.programmer.updateMany({
    where: {
      OR: [
        {
          name: {
            equals: programmerOrProject,
          },
        },
        {
          knownFor: {
            equals: programmerOrProject,
          },
        },
      ],
    },
    data: {
      vote: { decrement: 1 },
    },
  });
  return result;
}

async function rightAnswer(name) {
  const rightAnswer = await prisma.programmer.updateMany({
    where: {
      name: {
        equals: name,
      },
    },
    data: {
      vote: { increment: 2 },
    },
  });
  return rightAnswer;
}

async function wrongAnswer(name) {
  const wrongAnswer = await prisma.programmer.updateMany({
    where: {
      name: {
        equals: name,
      },
    },
    data: {
      vote: { decrement: 2 },
    },
  });
  return wrongAnswer;
}

app.post("/questions/programmers/answer", async (req, res) => {
  const programmer = await prisma.programmer.findMany({
    where: {
      name: {
        equals: req.body.name,
      },
    },
  });

  if (req.body.option === "empty") {
    res.json({ message: "Time out!" });
    giveTimeOutPenalty(req.body.name);
  } else if (programmer[0].knownFor === req.body.option) {
    res.json({ message: "Correct!" });
    rightAnswer(req.body.name);
  } else {
    res.json({ message: "Wrong!" });
    wrongAnswer(req.body.name);
  }
});

app.post("/questions/projects/answer", async (req, res) => {
  const programmer = await prisma.programmer.findMany({
    where: {
      knownFor: {
        equals: req.body.project,
      },
    },
  });

  if (req.body.option === "empty") {
    giveTimeOutPenalty(req.body.project);
    res.json({ message: "Time out!" });
  } else if (programmer[0].name === req.body.option) {
    rightAnswer(req.body.option);
    res.json({ message: "Correct!" });
  } else {
    wrongAnswer(programmer[0].name);
    res.json({ message: "Wrong!" });
  }
});

app.get("/questions/results", async (req, res) => {
  const highScores = await prisma.programmer.findMany({
    where: {
      vote: {
        not: 0,
      },
    },
    orderBy: {
      vote: "desc",
    },
  });

  let sortedHighscores = highScores.slice(0, 5);

  return res.json(sortedHighscores);
});

async function exists(args, model) {
  const count = await prisma[model].count(args);
  return Boolean(count);
}

//zod validation
const ValidEmail = z.string().email();
const ValidPassword = z.string().min(5);
const ValidToken = z.string();
const ValidProgrammer = z.string().min(2);
const ValidProject = z.string().min(5);

app.post("/programmers/signup", async (req, res) => {
  try {
    const parsedEmail = ValidEmail.parse(req.body.email);
    const parsedPassword = ValidPassword.parse(req.body.password);
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    console.log(parsedEmail, parsedPassword);
    const userExists = await exists(
      {
        where: {
          email: req.body.email,
        },
      },
      "user"
    );
    console.log(userExists);
    if (userExists === true) {
      return res.status(400).json({ message: "This user already exists" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: req.body.email,
          password: hash,
        },
      });
      return res.status(201).json({ message: "Your account is created" });
    }
  } catch (error) {
    console.log(error.name, error.issues);
    if (error.name === "ZodError") {
      return res.status(400).json({
        message:
          "Please fill in a valid e-mail address and password (min. 5 characters)",
        errors: error.issues,
      });
    }
  }
});

function createToken(userId) {
  var token = jwt.sign({ id: userId }, process.env.SECRET_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

app.post("/auth/login", async (req, res) => {
  try {
    const parsedEmail = ValidEmail.parse(req.body.email);
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user === null) {
      return res.status(401).json({ message: "Password or email incorrect" });
    }
    const hash = user.password;
    const checkPassword = bcrypt.compareSync(req.body.password, hash);

    if (checkPassword === false) {
      return res.status(401).json({ message: "Password or email incorrect" });
    }
    const token = createToken(user.id);
    const parsedToken = ValidToken.parse(token);
    return res.status(200).json({ user: user.email, token: token });
  } catch (error) {
    console.log(error.name, error.issues);
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Please fill in a valid e-mail address",
        errors: error.issues,
      });
    }
    return res.status(500).json({ message: "Oh no, something went wrong!" });
  }
});

function logger(req, res, next) {
  console.log(new Date(), req.method);
  next();
}

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    console.log(authHeader);

    if (authHeader.includes("Bearer") === false) {
      return res
        .status(400)
        .json({ message: "Bad request - header must include Bearer" });
    }

    if (!token) {
      return res
        .status(400)
        .json({ message: "Bad request - invalid or empty token" });
    }
    var decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ errors: error, message: "Unauthorized - no user logged in" });
  }
}

app.get("/test", (req, res) => {
  return res.json({ message: "OK" });
});

app.get("/auth/me", authenticate, async (req, res) => {
  return res.status(200).json({ user: req.user.email });
});

function capitalizeFirstLetter(string) {
  const capitalize = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalize;
}

function programmerNotFound(name, res) {
  return res.status(404).json({ message: `Programmer ${name} not found` });
}

async function firstNameCheck(firstName, res) {
  const programmerFirstName = await prisma.programmer.findMany({
    where: {
      name: {
        startsWith: firstName,
      },
    },
  });
  if (programmerFirstName[0] === undefined) {
    programmerNotFound(firstName, res);
  } else {
    return res.status(200).json({
      message: "Programmers found:",
      programmer: programmerFirstName,
    });
  }
}

async function lastNameCheck(lastName, res) {
  const programmerLastName = await prisma.programmer.findMany({
    where: {
      name: {
        endsWith: lastName,
      },
    },
  });
  if (programmerLastName[0] === undefined) {
    programmerNotFound(lastName, res);
  } else {
    return res
      .status(200)
      .json({ message: "Programmers found:", programmer: programmerLastName });
  }
}

async function fullNameCheck(fullName, res) {
  const programmerName = await prisma.programmer.findMany({
    where: {
      name: fullName,
    },
  });
  if (programmerName[0] === undefined) {
    programmerNotFound(fullName, res);
  } else {
    return res
      .status(200)
      .json({ message: "Programmers found:", programmer: programmerName });
  }
}

app.post("/auth/find", authenticate, async (req, res) => {
  try {
    const firstName = capitalizeFirstLetter(req.body.firstname);
    const lastName = capitalizeFirstLetter(req.body.surname);
    const fullName = firstName + " " + lastName;

    if (req.body.surname === "") {
      firstNameCheck(firstName, res);
    } else if (req.body.firstname === "") {
      lastNameCheck(lastName, res);
    } else {
      fullNameCheck(fullName, res);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Oops, something went wrong" });
  }
});

app.post("/auth/create", authenticate, async (req, res) => {
  try {
    const parsedProgrammer = ValidProgrammer.parse(req.body.name);
    const parsedProject = ValidProject.parse(req.body.project);
    const programmerExists = await exists(
      {
        where: {
          name: req.body.name,
        },
      },
      "programmer"
    );

    if (programmerExists === true) {
      return res.status(400).json({
        message:
          "This programmer already exists in the database. To update, go to the update page.",
      });
    }

    const newProgrammer = await prisma.programmer.create({
      data: {
        name: req.body.name,
        knownFor: req.body.project,
        vote: 0,
      },
    });

    return res.status(201).json({
      message: "Programmer added! Thank you for the update.",
      programmer: req.body.name,
      project: req.body.project,
    });
  } catch (error) {
    console.log(error.issues, error.name);
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Bad request - must have enough characters",
        errors: error.issues,
      });
    }
    return res.status(500).json({
      message: "Oops, something went wrong!",
    });
  }
});
