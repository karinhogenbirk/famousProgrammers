// api & app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
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
