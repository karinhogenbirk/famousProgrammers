let formUpdate = document.getElementById("update");

formUpdate.addEventListener("submit", function (event) {
  event.preventDefault();

  var firstname = document.getElementById("nameUpdate").value;
  var surname = document.getElementById("surnameUpdate").value;
  var project = document.getElementById("projectUpdate").value;

  updateProgrammer(firstname, surname, project);
});

function openModal(firstname, lastname, knownfor) {
  document.getElementById("programmer_updated").innerText = "";
  document.getElementById("updated_info").innerText = "";
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[2];
  span.onclick = function () {
    modal.style.display = "none";
  };
  var firstNameField = document.getElementById("nameUpdate");
  var lastNameField = document.getElementById("surnameUpdate");
  var knownForField = document.getElementById("projectUpdate");
  firstNameField.value = firstname;
  lastNameField.value = lastname;
  knownForField.value = knownfor;
}

async function updateProgrammer(firstname, surname, project) {
  const response = await fetch("./auth/update", {
    method: "PATCH",
    body: JSON.stringify({
      firstname: firstname,
      surname: surname,
      project: project,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  document.getElementById("programmer_updated").innerText = data.message;

  if (response.status === 201) {
    document.getElementById("updated_info").innerText = data.programmer;
    findProgrammer();
  }
}
