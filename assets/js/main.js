let apiKey = "Bearer cd8a73b8-bc9f-4c87-8c2b-62c3c9b464f3"

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function getPromos() {
    fetch('http://146.59.242.125:3009/promos', {
        method: 'GET',
        headers: {
            "authorization": apiKey
        }
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to load promos. Please try again later.");
        }
        return response.json();
    }).then((data) => {
        data.forEach(promo => {
            create(promo)
        });
    }).catch((error) => {
        console.error("Error fetching promos:", error);
        displayError("Failed to load promos. Please try again later.");
    });
}

function send() {
    let obj = {
        name: document.getElementById(`name`).value,
        startDate: document.getElementById(`startDate`).value,
        endDate: document.getElementById(`endDate`).value,
    }
    fetch('http://146.59.242.125:3009/promos', {
        method: 'POST',
        headers: {
            "Authorization": apiKey,
            "Content-type": "Application/json"
        },
        body: JSON.stringify(obj)
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        console.log("Promo created successfully:", data);
        create(data);
    }).catch((error) => {
        console.error("Error creating promo:", error);
        displayError("Failed to create promo. Please try again.");
    });
}

let classes = []
let list = document.getElementById(`promos-container`);

function create(prom = null) {
    if (!prom) {
        displayError("Invalid promo data");
        return;
    }
    try {
        let article = document.createElement("article");
        article.classList.add("mainArticle")
        let paraOne = document.createElement("p");
        paraOne.innerHTML = prom.name
        article.appendChild(paraOne);
        let div = document.createElement('div');
        article.appendChild(div);
        let details = document.createElement(`p`);
        details.classList.add("details");
        details.addEventListener("click", () => {
            localStorage.setItem("IDPromo", prom._id)
            location.href = "./pages/details.html"
        })
        details.textContent = "Details";
        details.title = "Click to view details"
        article.appendChild(details);
        list.appendChild(article);
    } catch (error) {
        displayError("Error displaying promo. Please refresh the page.");
    }
}

function display() {
    classes.forEach(el => {
        create(el)
    });
}

getPromos()