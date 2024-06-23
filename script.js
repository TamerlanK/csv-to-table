class Person {
  constructor(firstName, lastName, email, phone, title) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.title = title
  }
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const content = e.target.result
      parseFileContent(content)
    }
    reader.readAsText(file)
  }
}

function parseFileContent(content) {
  const lines = content.trim().split("\n")

  const persons = lines.map((line) => {
    const values = line.split(",").map((value) => value.trim())
    return {
      firstName: values[0],
      lastName: values[1],
      email: values[2],
      phone: values[3],
      title: values[4],
    }
  })

  createTable(persons)
}

function createTable(data) {
  const tableBody = document.getElementById("tableBody")
  tableBody.innerHTML = ""

  data.forEach((person) => {
    const tr = document.createElement("tr")
    tr.classList.add("border-b", "border-gray-200", "hover:bg-gray-100")
    ;["firstName", "lastName", "email", "phone", "title"].forEach((key) => {
      const td = document.createElement("td")
      td.textContent = person[key]
      td.classList.add("py-2", "px-4")
      tr.appendChild(td)
    })

    tableBody.appendChild(tr)
  })

  const saveButton = document.getElementById("saveButton")
  saveButton.disabled = false
}

document.getElementById("saveButton").addEventListener("click", saveData)

function saveData() {
  const rows = document.querySelectorAll("#tableBody tr")
  const data = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td")
    return {
      firstName: cells[0].textContent,
      lastName: cells[1].textContent,
      email: cells[2].textContent,
      phone: cells[3].textContent,
      title: cells[4].textContent,
    }
  })

  fetch("http://localhost:3000/persons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      alert("Data saved successfully!")
    })
    .catch((error) => {
      console.log(`Error: ${error}`)
    })
}

document.getElementById("clearButton").addEventListener("click", clearTable)

function clearTable() {
  document.getElementById("tableBody").innerHTML = ""
  document.getElementById("fileInput").value = ""
  document.getElementById("saveButton").disabled = true
}
