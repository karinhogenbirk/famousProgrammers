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
