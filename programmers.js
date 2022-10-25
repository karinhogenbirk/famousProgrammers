const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5432;
const programmers = require("./programmers.json");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const programmer = await prisma.programmer.create({
    data: programmers,
  });
  console.log(programmer);
}

//   main()
//     .then(async () => {
//       await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//       console.error(e)
//       await prisma.$disconnect()
//       process.exit(1)
//     })

app.listen(PORT, () => {
  console.log("It works!");
});

app.get("/programmers", (req, res) => {
  return res.json(programmers);
});

function getRandomProject(programmers) {
  const keys = Object.values(programmers);

  const randomObject = keys[Math.floor(Math.random() * keys.length)];
  const randomProject = randomObject.knownFor;

  return randomProject;
}

function getRandomName(programmers) {
  const keys = Object.values(programmers);

  const randomObject = keys[Math.floor(Math.random() * keys.length)];
  const randomName = randomObject.name;

  return randomName;
}

//QUESTION PROGRAMMER

function createRandomProgrammerQuestion(programmers) {
  const randomName = getRandomName(programmers);
  const project = programmers.find((project) => randomName === project.name);
  const rightProject = project.knownFor;
  const projects = [
    rightProject,
    getRandomProject(programmers),
    getRandomProject(programmers),
    getRandomProject(programmers),
  ];

  const shuffledAnswers = shuffledProjects(projects);

  return {
    name: `Which project is ${randomName} known for?`,
    projects: shuffledAnswers,
  };
}

console.log(createRandomProgrammerQuestion(programmers));

function shuffledProjects(itemsQ2) {
  var currentIndex = itemsQ2.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = itemsQ2[currentIndex];
    itemsQ2[currentIndex] = itemsQ2[randomIndex];
    itemsQ2[randomIndex] = temporaryValue;
  }
  return itemsQ2;
}

app.get("/questions/random", (req, res) => {
  res.json(createRandomProgrammerQuestion(programmers));
});

//QUESTION PROJECT

function createRandomProjectQuestion(programmers) {
  const randomProject = getRandomProject(programmers);
  const programmer = programmers.find(
    (programmer) => randomProject === programmer.knownFor
  );
  const rightName = programmer.name;
  const names = [
    rightName,
    getRandomName(programmers),
    getRandomName(programmers),
    getRandomName(programmers),
  ];

  const shuffledNameAnswers = shuffledNames(names);

  return {
    project: `Which programmer is known for: ${randomProject}?`,
    names: shuffledNameAnswers,
  };
}

console.log(createRandomProjectQuestion(programmers));

function shuffledNames(itemsQ1) {
  var currentIndex = itemsQ1.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = itemsQ1[currentIndex];
    itemsQ1[currentIndex] = itemsQ1[randomIndex];
    itemsQ1[randomIndex] = temporaryValue;
  }
  return itemsQ1;
}

app.get("/questions/2", (req, res) => {
  res.json(createRandomProjectQuestion(programmers));
});

app.get("/questions/:id", (req, res) => {
  const question = questions.find(
    (question) => Number(question.id) === Number(req.params.id)
  );
  res.json(question);
});

app.post("/questions/:id/vote", (req, res) => {
  if (req.params.id == 1) {
    console.log(req.body);

    const programmer = programmers.find((programmer) => {
      return (
        `Which project is ${programmer.name} known for?` === req.body.name &&
        programmer.knownFor === req.body.option
      );
    });

    if (programmer) {
      programmer.vote++;

      return res.json({ message: "Correct!" });
    } else if (req.body.option === "empty") {
      const projectEmpty = programmers.find((programmer) => {
        if (
          `Which project is ${programmer.name} known for?` === req.body.name &&
          req.body.option === "empty"
        ) {
          programmer.vote -= 0.5;
        }
      });
      return res.json({ message: "Time's up!" });
    } else {
      const programmerCount = programmers.find((programmer) => {
        if (
          `Which project is ${programmer.name} known for?` === req.body.name &&
          programmer.knownFor !== req.body.option
        ) {
          programmer.vote--;
          console.log(programmer.vote);
        }
      });
      return res.json({ message: "Wrong!" });
    }
  } else if (req.params.id == 2) {
    console.log(req.body);
    const programmer = programmers.find((programmer) => {
      return (
        `Which programmer is known for: ${programmer.knownFor}?` ===
          req.body.project && programmer.name === req.body.option
      );
    });

    if (programmer) {
      programmer.vote++;
      return res.json({ message: "Correct!" });
    } else if (req.body.option === "empty") {
      const programmerEmpty = programmers.find((programmer) => {
        if (
          `Which programmer is known for: ${programmer.knownFor}?` ===
            req.body.project &&
          req.body.option === "empty"
        ) {
          programmer.vote -= 0.5;

          console.log(programmer.vote);
        }
      });
      return res.json({ message: "Time's up!" });
    } else {
      const programmerCountDown = programmers.find((programmer) => {
        if (
          `Which programmer is known for: ${programmer.knownFor}?` ===
            req.body.project &&
          programmer.name !== req.body.option
        ) {
          programmer.vote--;

          console.log(programmer.vote);
        }
      });
      return res.json({ message: "Wrong!" });
    }
  }
});

async function getWikiPage() {
  const response = await axios.default.get(
    "https://en.wikipedia.org/wiki/List_of_programmers"
  );

  const HTML = response.data;
  const doc = new JSDOM(HTML);
  const listedNames = doc.window.document.querySelectorAll("ul");

  const names = [
    {
      name: "Karin Hogenbirk",
      knownFor: "Creating the famous programmers' API",
      id: 20,
      vote: 0,
    },
  ];

  for (let index = 1; index < 24; index++) {
    const list = listedNames[index];
    const name = list.querySelectorAll("li");
    for (let index = 0; index < name.length; index++) {
      const eachName = name[index].textContent;
      const splittedNames = eachName.split(" – ");
      const nameObject = {
        name: splittedNames[0],
        knownFor: splittedNames[1],
        vote: 0,
      };
      names.push(nameObject);
      console.log(nameObject);
    }
  }
  fs.writeFileSync("./programmers.json", JSON.stringify(names));
}

// getWikiPage()
