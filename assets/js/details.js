async function deletePromo() {
    let promoID = localStorage.getItem("IDPromo")
    console.log(promoID);
    const response = await fetch("http://146.59.242.125:3009/promos/" + promoID, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer cd8a73b8-bc9f-4c87-8c2b-62c3c9b464f3"
        }
    },
    );
    location.href = "/index.html"
}

async function createStudents() {
    try {
        let promoID = localStorage.getItem("IDPromo");
        if (!promoID) {
            throw new Error("Promo ID not found in local storage");
        }

        const body = {
            firstName: document.getElementById(`firstName`).value,
            lastName: document.getElementById(`name`).value,
            age: document.getElementById(`age`).value,
        };

        if (!body.firstName || !body.lastName || !body.age) {
            throw new Error("All fields are required");
        }

        const response = await fetch("http://146.59.242.125:3009/promos/" + promoID + "/students/", {
            method: "POST",
            headers: {
                Authorization: "Bearer cd8a73b8-bc9f-4c87-8c2b-62c3c9b464f3",
                "Content-type": "Application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Student must not be underage, first name and last name must be at least 3 characters`);
        }

        await displayStudents();
    } catch (error) {
        console.error("Error creating student:", error);
        displayError(error.message || "Failed to create student. Please try again.");
    }
}


async function getStudentbyPromo() {
    let promoID = localStorage.getItem("IDPromo")
    const response = await fetch("http://146.59.242.125:3009/promos/" + promoID, {
        headers: {
            Authorization: "Bearer cd8a73b8-bc9f-4c87-8c2b-62c3c9b464f3",
        },
    })
    const data = await response.json();
    const students = data.students
    return students
}

async function displayStudents() {
    try {
        const pupils = await getStudentbyPromo();
        let studentContainer = document.getElementById(`students-container`);
        if (!studentContainer) {
            throw new Error("Student container not found");
        }
        studentContainer.innerHTML = "";

        if (!Array.isArray(pupils) || pupils.length === 0) {
            throw new Error("No students found");
        }
        pupils.forEach(eleve => {
            let pupilDiv = document.createElement("div");
            pupilDiv.classList.add("pupil");
            studentContainer.appendChild(pupilDiv);
            let paraOne = document.createElement("p");
            paraOne.classList.add("paraOne")
            paraOne.textContent = eleve.firstName
            pupilDiv.appendChild(paraOne);
            let paraTwo = document.createElement("p");
            paraTwo.classList.add("paraTwo")
            paraTwo.textContent = eleve.lastName
            pupilDiv.appendChild(paraTwo);
            let paraThree = document.createElement("p");
            paraThree.classList.add("paraThree")
            paraThree.textContent = eleve.age
            pupilDiv.appendChild(paraThree);
            let inputOne = document.createElement("input");
            inputOne.classList.add("hidden")
            inputOne.type = "text";
            inputOne.placeholder = "First Name";
            inputOne.id = `newFirstName_${eleve._id}`;
            inputOne.value = eleve.firstName;
            pupilDiv.appendChild(inputOne);
            let inputTwo = document.createElement("input");
            inputTwo.classList.add("hidden")
            inputTwo.type = "text";
            inputTwo.placeholder = "Last Name";
            inputTwo.id = `newLastName_${eleve._id}`;
            inputTwo.value = eleve.lastName;
            pupilDiv.appendChild(inputTwo);
            let inputThree = document.createElement("input");
            inputThree.classList.add("hidden");
            inputThree.type = "number";
            inputThree.placeholder = "Age";
            inputThree.id = `newAge_${eleve._id}`;
            inputThree.value = eleve.age;
            pupilDiv.appendChild(inputThree);
            let suppBtn = document.createElement("button");
            suppBtn.classList.add("suppBtn");
            suppBtn.textContent = "Delete";
            suppBtn.addEventListener("click", () => deleteStudent(eleve._id));
            pupilDiv.appendChild(suppBtn);
            let modifyBtn = document.createElement("button");
            modifyBtn.classList.add("modifyBtn");
            modifyBtn.textContent = "Modify";
            pupilDiv.appendChild(modifyBtn);
            modifyBtn.addEventListener("click", () => {
                if (modifyBtn.textContent === "Modify") {
                    paraOne.style.display = "none";
                    paraTwo.style.display = "none";
                    paraThree.style.display = "none";
                    inputOne.style.display = "block";
                    inputTwo.style.display = "block";
                    inputThree.style.display = "block";
                    modifyBtn.textContent = "Update";
                } else {
                    const newFirstName = inputOne.value;
                    const newLastName = inputTwo.value;
                    const newAge = inputThree.value;
                    updateStudent(eleve._id, newFirstName, newLastName, newAge)
                        .then(() => {
                            paraOne.textContent = newFirstName;
                            paraTwo.textContent = newLastName;
                            paraThree.textContent = newAge;
                            paraOne.style.display = "block";
                            paraTwo.style.display = "block";
                            paraThree.style.display = "block";
                            inputOne.style.display = "none";
                            inputTwo.style.display = "none";
                            inputThree.style.display = "none";
                            modifyBtn.textContent = "Modify";
                        })
                        .catch(error => {
                            console.error("Failed to update student:", error);
                        });
                }
            });
        });
        document.getElementById('firstName').value = "";
        document.getElementById('name').value = "";
        document.getElementById('age').value = "";
        let retour = document.createElement('img');
        retour.src = "../assets/imgs/cross.png";
        retour.alt = "Return to home";
        retour.style.position = "fixed";
        retour.style.top = "20px";
        retour.style.right = "20px";
        retour.style.width = "30px";
        retour.style.height = "30px";
        retour.style.cursor = "pointer";
        retour.style.zIndex = "1000";
        retour.addEventListener('click', function () {
            window.location.href = "../index.html";
        });

        document.body.appendChild(retour);
    } catch (error) {
        console.error("Error displaying students:", error);
        displayError("Failed to display students. Please try again later.");
    }
}


async function deleteStudent(studentID) {
    let promoID = localStorage.getItem("IDPromo")
    const response = await fetch(`http://146.59.242.125:3009/promos/${promoID}/students/${studentID}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer cd8a73b8-bc9f-4c87-8c2b-62c3c9b464f3"
        }
    },
    );
    displayStudents()
}

displayStudents()

async function updateStudent(studentID, firstName, lastName, age) {
    try {
        let promoID = localStorage.getItem("IDPromo");
        if (!promoID) {
            throw new Error("Promo ID not found in local storage");
        }

        const response = await fetch(`http://146.59.242.125:3009/promos/${promoID}/students/${studentID}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer cd8a73b8-bc9f-4c87-8c2b-62c3c9b464f3',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, age }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update student.`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating student:", error);
        displayError(error.message || "Failed to update student. Please try again.");
        throw error;
    }
}


function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}