function showCreateForm() {
  var firstName = document.getElementById("nameFind").value;
  var lastName = document.getElementById("surnameFind").value;
  console.log(firstName, lastName);
  openModalCreate(firstName, lastName);
}

function openModalCreate(firstname, lastname) {
  document.getElementById("return_message").innerText = "";
  document.getElementById("programmer_exists").innerText = "";
  document.getElementById("projectCreate").value = "";
  createModal.style.display = "block";
  var span = document.getElementsByClassName("close")[1];
  span.onclick = function () {
    createModal.style.display = "none";
  };
  var firstNameField = document.getElementById("nameCreate");
  var lastNameField = document.getElementById("surnameCreate");
  firstNameField.value = firstname;
  lastNameField.value = lastname;
}

let formCreate = document.getElementById("create");

formCreate.addEventListener("submit", function (event) {
  event.preventDefault();

  var firstname = document.getElementById("nameCreate").value;
  var surname = document.getElementById("surnameCreate").value;
  var name = firstname + " " + surname;
  var project = document.getElementById("projectCreate").value;

  console.log(name, project);

  createProgrammer(name, project);
});

async function createProgrammer(name, project) {
  const response = await fetch("./auth/create", {
    method: "POST",
    body: JSON.stringify({ name: name, project: project }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);

  document.getElementById("return_message").innerText = data.message;

  if (response.status === 400) {
    document.getElementById("programmer_exists").innerText = "Update page";
  }
}
