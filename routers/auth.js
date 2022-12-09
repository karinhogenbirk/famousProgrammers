const express = require("express");

const z = require("zod");
var router = express.Router();
const ValidProgrammer = z.string().min(1);
const ValidProject = z.string().min(5);
const { empty } = require("@prisma/client/runtime");
const prisma = require("../prisma/client");

async function exists(args, model) {
  const count = await prisma[model].count(args);
  return Boolean(count);
}

async function firstNameCheck(firstName, res) {
  const programmerFirstName = await prisma.programmer.findMany({
    where: {
      name: {
        startsWith: firstName,
        mode: "insensitive",
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
        mode: "insensitive",
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
      mode: "insensitive",
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

function programmerNotFound(name, res) {
  return res.status(404).json({ message: `Programmer ${name} not found` });
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

router.get("/me", authenticate, async (req, res) => {
  return res.status(200).json({ user: req.user.email });
});

router.post("/find", authenticate, async (req, res) => {
  if (!req.body.firstname && !req.body.surname) {
    return res
      .status(400)
      .json({ message: "Please fill in a first name or last name" });
  }
  try {
    if (req.body.surname === "" || req.body.surname === undefined) {
      firstNameCheck(req.body.firstname, res);
    } else if (req.body.firstname === "" || req.body.firstname === undefined) {
      lastNameCheck(req.body.surname, res);
    } else {
      const fullName = req.body.firstname + " " + req.body.surname;
      fullNameCheck(fullName, res);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Oops, something went wrong" });
  }
});

router.post("/create", authenticate, async (req, res) => {
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

router.patch("/update", authenticate, async (req, res) => {
  if (!req.body.firstname && !req.body.surname) {
    return res
      .status(400)
      .json({ message: "Please fill in a first name and last name" });
  }
  try {
    const parsedFirstName = ValidProgrammer.parse(req.body.firstname);
    const parsedLastName = ValidProgrammer.parse(req.body.surname);
    const parsedProject = ValidProject.parse(req.body.project);
    const fullName = req.body.firstname + " " + req.body.surname;
    const projectExists = await exists(
      {
        where: {
          knownFor: req.body.project,
        },
      },
      "programmer"
    );

    if (projectExists === true) {
      return res.status(400).json({
        message: "Project already exists in database. No changes made",
      });
    }

    const programmer = await prisma.programmer.updateMany({
      where: {
        name: fullName,
      },
      data: {
        knownFor: req.body.project,
      },
    });

    return res.status(201).json({
      message: "Programmer updated! New data: ",
      programmer: fullName + ": " + req.body.project,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Bad request - must have enough characters",
        errors: error.issues,
      });
    }
    return res.status(500).json({ message: "Oops, something went wrong" });
  }
});

router.delete("/delete", authenticate, async (req, res) => {
  if (!req.body.firstname && !req.body.surname) {
    return res
      .status(400)
      .json({ message: "Please fill in a first name and last name" });
  }
  try {
    const parsedFirstName = ValidProgrammer.parse(req.body.firstname);
    const parsedLastName = ValidProgrammer.parse(req.body.surname);
    const fullName = req.body.firstname + " " + req.body.surname;
    const programmerToDelete = await prisma.programmer.deleteMany({
      where: {
        name: fullName,
      },
    });

    if (programmerToDelete.count === 0) {
      programmerNotFound(fullName, res);
    } else {
      return res
        .status(201)
        .json({ message: "Programmer deleted: ", programmer: fullName });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Bad request - must have enough characters",
        errors: error.issues,
      });
    }
    return res.status(500).json({ message: "Oops, something went wrong" });
  }
});

module.exports = router;
