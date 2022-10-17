const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000 
const programmers = require("./programmers.json");
// const uniqueRandomArray = require("unique-random-array")

app.listen(PORT, () => {
    console.log("It works!")
})


app.get("/programmers", (req, res) => {
    return res.json(programmers)
} )

//random projecten en programmers uit programmers.json halen
    function getRandomProject(programmers) { 
        const keys = Object.values(programmers);

        const randomObject = keys[Math.floor(Math.random() * keys.length)];
        const randomProject= randomObject.knownFor

        return randomProject
    }

    function getRandomName(programmers) { 
        const keys = Object.values(programmers);

        const randomObject = keys[Math.floor(Math.random() * keys.length)];
        const randomName = randomObject.name

        return randomName
    }

     //rightProject geeft het juiste antwoord bij randomName
    const randomName = getRandomName(programmers)
    const project = programmers.find((project) => randomName === project.name );
    const rightProject = project.knownFor
   
       
    const randomProject = getRandomProject(programmers)
    const programmer = programmers.find((programmer) => randomProject === programmer.knownFor );
    const rightName = programmer.name

        //onderstaande geeft een array met een randomProject, bijbehorende jusite programmer(name), en 3 random programmers(getRandomName)
        const questionOne = [
            {project: randomProject,
            names: [rightName,
            getRandomName(programmers),
            getRandomName(programmers),
            getRandomName(programmers)
            ]
            }
        ]

        const questionTwo = [
            {name: randomName,
            projects: [
            rightProject,
            getRandomProject(programmers),
            getRandomProject(programmers),
            getRandomProject(programmers)
            ]
            }
        ]

    //functie om iedere keer een nieuw project/name te returnen:
    function projectQuestionOne(questionOne) {
        const nameQuestion = questionOne[0].project;
        return nameQuestion
    }

    function nameQuestionTwo(questionTwo) {
        const nameQuestion = questionTwo[0].name;
        return nameQuestion
    }

        //variabele met een array maken en deze shuffelen, voor vraag 1 en 2 (Q1 en Q2)

    let itemsQ1 = questionOne[0].names

    function shuffledNames(itemsQ1) {
        var currentIndex = itemsQ1.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = itemsQ1[currentIndex];
          itemsQ1[currentIndex] = itemsQ1[randomIndex];
          itemsQ1[randomIndex] = temporaryValue;
        }
        return itemsQ1;
      }

const shuffledProgrammers = shuffledNames(itemsQ1)

    let itemsQ2 = questionTwo[0].projects


function shuffledProjects(itemsQ2) {
    var currentIndex = itemsQ2.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = itemsQ2[currentIndex];
      itemsQ2[currentIndex] = itemsQ2[randomIndex];
      itemsQ2[randomIndex] = temporaryValue;
    }
    return itemsQ2;
  }

    const shuffledProjectsList = shuffledProjects(itemsQ2) 


        const questions = [ 
            { 
                id: 1,
              question: `Which programmer is known for: ${projectQuestionOne(questionOne)}?`,
              options:
                 {  1: shuffledProgrammers[0], 
                    2: shuffledProgrammers[1],
                    3: shuffledProgrammers[2],
                    4: shuffledProgrammers[3] } 
            }, 
                { id: 2,
                 question: `Which project is ${nameQuestionTwo(questionTwo)} known for?`,
                    options:
                        { 1: shuffledProjectsList[0], 
                           2: shuffledProjectsList[1],
                           3: shuffledProjectsList[2],
                           4: shuffledProjectsList[3]
                       } , 
                }
                ]
            

                console.log(questions)




    app.get("/questions/:id", (req, res) => {
        const question = questions.find((question) => Number(question.id) === Number(req.params.id));
        res.json(question);
      });



async function getWikiPage() {
    const response = await axios.default.get("https://en.wikipedia.org/wiki/List_of_programmers");
    
    const HTML = response.data
    const doc = new JSDOM(HTML)
    const listedNames = doc.window.document.querySelectorAll("ul");

const names = [{name: "Karin Hogenbirk", knownFor: "Creating the famous programmers' API", id: 20}];


for (let index = 1; index < 24; index++) {
    const list = listedNames[index]
    const nextId = index  +1
        const name = list.querySelectorAll("li")
        for (let index = 0; index < name.length; index++) {
            const tempId = index +1;
            const id = nextId + String(tempId)
            const eachName = name[index].textContent
            const splittedNames = eachName.split(" – ")
            const nameObject = {name: splittedNames[0], knownFor: splittedNames[1], id: Number(id) }
            //begint opnieuw met tellen bij iedere nieuwe letter vh alfabet
            names.push(nameObject);
    console.log(nameObject)
        }
     

    
 }
 fs.writeFileSync("./programmers.json", JSON.stringify(names));
}
     
// getWikiPage()