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
    const [firstName, lastName, email, phone, title] = line
      .split(",")
      .map((value) => value.trim())

    const person = new Person()

    Reflect.set(person, "firstName", firstName)
    Reflect.set(person, "lastName", lastName)
    Reflect.set(person, "email", email)
    Reflect.set(person, "phone", phone)
    Reflect.set(person, "title", title)

    return person
  })

  createTable(persons)
}

function createTable(data) {
  const tableBody = document.getElementById("tableBody")
  tableBody.innerHTML = ""

  data.forEach((person) => {
    const tr = document.createElement("tr")
    tr.classList.add("border-b", "border-gray-200", "hover:bg-gray-100")
    Object.keys(new Person()).forEach((key) => {
      const td = document.createElement("td")
      td.textContent = Reflect.get(person, key)
      td.classList.add("py-2", "px-4")
      tr.appendChild(td)
    })

    tableBody.appendChild(tr)
  })

  updateButtonState()
}

document.getElementById("saveButton").addEventListener("click", saveData)

function saveData() {
  const rows = document.querySelectorAll("#tableBody tr")
  const data = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td")

    const personData = new Person()
    Reflect.set(personData, "firstName", cells[0].textContent)
    Reflect.set(personData, "lastName", cells[1].textContent)
    Reflect.set(personData, "email", cells[2].textContent)
    Reflect.set(personData, "phone", cells[3].textContent)
    Reflect.set(personData, "title", cells[4].textContent)

    return personData
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

  updateButtonState()
}

function updateButtonState() {
  const tableBody = document.getElementById("tableBody")
  const hasData = tableBody.rows.length > 0

  const saveButton = document.getElementById("saveButton")
  const clearButton = document.getElementById("clearButton")

  saveButton.disabled = !hasData
  clearButton.disabled = !hasData
}
