const app = require("./programmers");
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("I AM ALIVE! ON PORT", PORT);
});
