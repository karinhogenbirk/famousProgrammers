function getRandomElement(array) {
  const keys = Object.values(array);
  const randomObject = keys[Math.floor(Math.random() * keys.length)];
  return randomObject;
}

function getRandomProject(programmers) {
  const randomObject = getRandomElement(programmers);
  return randomObject.knownFor;
}

function getRandomName(programmers) {
  const randomObject = getRandomElement(programmers);
  return randomObject.name;
}

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

  const shuffledAnswers = shuffleArray(projects);

  return {
    name: `Which project is ${randomName} known for?`,
    projects: shuffledAnswers,
  };
}

function shuffleArray(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

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

  const shuffledNameAnswers = shuffleArray(names);

  return {
    project: `Which programmer is known for: ${randomProject}?`,
    names: shuffledNameAnswers,
  };
}

module.exports = {
  createRandomProgrammerQuestion: createRandomProgrammerQuestion,
  createRandomProjectQuestion: createRandomProjectQuestion,
};
