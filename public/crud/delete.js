function openDeleteModal(firstname, lastname) {
  document.getElementById("deleted_message").innerText = "";
  deleteModal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    deleteModal.style.display = "none";
  };
  document.getElementById("nameDelete").innerText = firstname + " " + lastname;

  document.querySelector("#yes").onclick = () =>
    deleteProgrammer(firstname, lastname);
  document.querySelector("#no").onclick = () =>
    function () {
      deleteModal.style.display = "none";
    };
}

async function deleteProgrammer(firstname, surname) {
  const response = await fetch("./auth/delete", {
    method: "DELETE",
    body: JSON.stringify({ firstname: firstname, surname: surname }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  document.getElementById("deleted_message").innerText = data.message;
  findProgrammer();
}
