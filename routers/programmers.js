const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var router = express.Router();
const { empty } = require("@prisma/client/runtime");
const z = require("zod");
const ValidEmail = z.string().email();
const ValidPassword = z.string().min(5);
const ValidToken = z.string();
var jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
require("dotenv").config();

async function exists(args, model) {
  const count = await prisma[model].count(args);
  return Boolean(count);
}

function createToken(userId) {
  var token = jwt.sign({ id: userId }, process.env.SECRET_TOKEN, {
    expiresIn: "1h",
  });
  return token;
}

router.get("/", async (req, res) => {
  const programmers = await prisma.programmer.findMany();
  return res.json(programmers);
});

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

module.exports = router;
