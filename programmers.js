// api & app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 4000;
const programmers = require("./programmers.json");
const {
  createRandomProgrammerQuestion,
  createRandomProjectQuestion,
} = require("./utils/questions");

app.listen(PORT, () => {
  console.log("It works!");
});

app.get("/programmers", (req, res) => {
  return res.json(programmers);
});

app.get("/questions/programmers/random", (req, res) => {
  res.json(createRandomProgrammerQuestion(programmers));
});

app.get("/questions/projects/random", (req, res) => {
  res.json(createRandomProjectQuestion(programmers));
});

app.post("/questions/programmers/answer", (req, res) => {
  // Stap 1: find the programmer with the right name
  const programmer = programmers.find((programmer) => {
    return `Which project is ${programmer.name} known for?` === req.body.name;
  });

  // Stap 2: check the option (answer)
  // correct -> vote + 1
  // empty -> vote - 0.5
  // wrong -> vote - 1
  if (req.body.option === programmer.knownFor) {
    programmer.vote++;
    return res.json({ message: "Correct!" });
  } else if (req.body.option === "empty") {
    programmer.vote -= 0.5;
    return res.json({ message: "Time's up!" });
  } else {
    programmer.vote--;
    return res.json({ message: "Wrong!" });
  }
});

app.post("/questions/projects/answer", (req, res) => {
  // Stap 1: find the programmer with the right project
  const programmer = programmers.find((programmer) => {
    return (
      `Which programmer is known for: ${programmer.knownFor}?` ===
      req.body.project
    );
  });

  // Stap 2: check the option (answer)
  // correct -> vote + 1
  // empty -> vote - 0.5
  // wrong -> vote - 1
  if (req.body.option === programmer.name) {
    programmer.vote++;
    return res.json({ message: "Correct!" });
  } else if (req.body.option === "empty") {
    programmer.vote -= 0.5;
    return res.json({ message: "Time's up!" });
  } else {
    programmer.vote--;
    return res.json({ message: "Wrong!" });
  }
});

// testObj = [
//   { name: "Karin", score: 1 },
//   { name: "Marcel", score: 0 },
//   { name: "Ola", score: 3 },
//   { name: "Sonja", score: 5 },
//   { name: "Michiel", score: 9 },
//   { name: "Djun", score: 4 },
//   { name: "Ashwin", score: 2 },
// ];

let highscoreArray = [];

function highScores(programmers) {
  for (let index = 0; index < programmers.length; index++) {
    const programmer = programmers[index];
    if (programmer.vote > 0) {
      highscoreArray.push(programmer);
    }
  }
  //this sorts the highest scores
  let sortedArray = highscoreArray.sort(function (a, b) {
    return b.score - a.score;
  });
  //this takes the first 5
  const newHighscoreArray = [
    sortedArray[0],
    sortedArray[1],
    sortedArray[2],
    sortedArray[3],
    sortedArray[4],
  ];
  return newHighscoreArray;
}

// console.log(highScores(programmers));

app.get("/questions/results", (req, res) => {
  return res.json(highScores(programmers));
});
