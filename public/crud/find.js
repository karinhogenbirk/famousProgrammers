let formFind = document.getElementById("find");

formFind.addEventListener("submit", function (event) {
  event.preventDefault();
  findProgrammer();
});

async function findProgrammer() {
  var firstname = document.getElementById("nameFind").value;
  var surname = document.getElementById("surnameFind").value;
  const results = document.getElementById("results");
  results.replaceChildren();
  const response = await fetch("./auth/find", {
    method: "POST",
    body: JSON.stringify({ firstname: firstname, surname: surname }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const programmerList = data.programmer;

  document.getElementById("programmer_message").innerText = data.message;

  for (let index = 0; index < programmerList.length; index++) {
    const programmer = programmerList[index];
    const programmerArray = programmer.name.split(" ", 5);
    const programmerFirstname = programmerArray[0];
    const programmerLastnameArray = programmerArray.slice(1).toString();
    const programmerLastname = programmerLastnameArray.replaceAll(",", " ");
    const programmerKnownfor = programmer.knownFor;
    const template = document.querySelector("template");
    const content = template.content.cloneNode(true);
    content.querySelector("#firstname").innerText = programmerFirstname;
    content.querySelector("#lastname").innerText = programmerLastname;
    content.querySelector("#knownfor").innerText = programmerKnownfor;
    content.querySelector("#edit").onclick = () =>
      openModal(programmerFirstname, programmerLastname, programmerKnownfor);
    content.querySelector("#delete").onclick = () =>
      openDeleteModal(programmerFirstname, programmerLastname);
    document.querySelector("#results").append(content);
  }
}
