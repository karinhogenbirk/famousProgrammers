// api & app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

// const programmers = require("./programmers.json");

const {
  createRandomProgrammerQuestion,
  createRandomProjectQuestion,
} = require("./utils/questions");

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

app.post("/questions/programmers/answer", async (req, res) => {
  if (req.body.option === "empty") {
    const timeOut = await prisma.programmer.updateMany({
      where: {
        name: {
          equals: req.body.name,
        },
      },
      data: {
        vote: { decrement: 1 },
      },
    });
    console.log(timeOut);
    res.json({ message: "Time out!" });
  } else {
    const rightAnswer = await prisma.programmer.updateMany({
      where: {
        knownFor: {
          equals: req.body.option,
        },
        name: {
          equals: req.body.name,
        },
      },
      data: {
        vote: { increment: 2 },
      },
    });

    if (Object.values(rightAnswer).includes(1)) {
      res.json({ message: "Correct!" });
    } else {
      const wrongAnswer = await prisma.programmer.updateMany({
        where: {
          name: {
            equals: req.body.name,
          },
        },
        data: {
          vote: { decrement: 2 },
        },
      });
      res.json({ message: "Wrong!" });
    }
  }
});

app.post("/questions/projects/answer", async (req, res) => {
  if (req.body.option === "empty") {
    const timeOut = await prisma.programmer.updateMany({
      where: {
        knownFor: {
          equals: req.body.project,
        },
      },
      data: {
        vote: { decrement: 1 },
      },
    });
    console.log(timeOut);
    res.json({ message: "Time out!" });
  } else {
    const rightAnswer = await prisma.programmer.updateMany({
      where: {
        knownFor: {
          equals: req.body.project,
        },
        name: {
          equals: req.body.option,
        },
      },
      data: {
        vote: { increment: 2 },
      },
    });

    if (Object.values(rightAnswer).includes(1)) {
      res.json({ message: "Correct!" });
    } else {
      const wrongAnswer = await prisma.programmer.updateMany({
        where: {
          knownFor: {
            equals: req.body.project,
          },
          name: {
            not: req.body.option,
          },
        },
        data: {
          vote: { decrement: 2 },
        },
      });
      res.json({ message: "Wrong!" });
    }
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
