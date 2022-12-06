// api & app
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(logger);

const questions = require("./routers/questions");
app.use("/questions", questions);

const programmers = require("./routers/programmers");
app.use("/programmers", programmers);

const auth = require("./routers/auth");
app.use("/auth", auth);

function logger(req, res, next) {
  console.log(new Date(), req.method);
  next();
}

app.get("/test", (req, res) => {
  return res.json({ message: "OK" });
});

module.exports = app;
