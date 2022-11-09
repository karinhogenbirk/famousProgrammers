// scraping
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

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

getWikiPage();
