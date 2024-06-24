class Person {
  constructor(firstName, lastName, email, phone, title) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.phone = phone
    this.title = title
  }
}

function isEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload)

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()

    reader.onload = function (e) {
      try {
        const content = e.target.result
        parseFileContent(content)
        alert("File uploaded successfully!")
      } catch (error) {
        console.error("Error processing file content: ", error)
        document.getElementById("fileError").innerText = error.message
        clearTable()
      }
    }

    reader.onerror = function (e) {
      alert(`Error while reading the file`)
      console.log(`Error: ${e}`)
    }
    reader.readAsText(file)
  }
}

function parseFileContent(content) {
  const lines = content.trim().split("\n")

  const persons = lines.map((line, index) => {
    const personData = line.split(",").map((value) => value.trim())

    const person = Reflect.construct(Person, personData)

    if (!isEmail(person.email)) {
      throw new Error(
        `Invalid email found on line ${index + 1}: ${person.email}`
      )
    }

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
    const cellsData = Array.from(cells).map((cell) => cell.textContent)

    return Reflect.construct(Person, cellsData)
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

  if (hasData) {
    saveButton.classList.remove("hidden")
    clearButton.classList.remove("hidden")
  } else {
    saveButton.classList.add("hidden")
    clearButton.classList.add("hidden")
  }
}
