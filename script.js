let cakeImage = new Image();
let userImage = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Position initiale de l'image de l'utilisateur
let userXOffset = canvas.width / 2 - 50; // Centré horizontalement par défaut
let userYOffset = 300; // Position initiale
let isDragging = false; // État de drag


function showAdminLogin() {
    document.getElementById('admin-dialog').style.display = 'block';
}

// Cache la boîte de dialogue de connexion admin
function hideAdminLogin() {
    document.getElementById('admin-dialog').style.display = 'none';
}


// Connexion admin
function loginAsAdmin() {
    const password = document.getElementById('admin-password').value;
    
    if (password === "1234") {  // Mot de passe fictif
        document.getElementById('user-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        hideAdminLogin();  // Ferme la boîte de dialogue de connexion
    } else {
        alert("Mot de passe incorrect.");
    }
}
// Fonction pour sélectionner une image de gâteau
function selectCake(src) {
    cakeImage.src = src;
    cakeImage.onload = () => {
        drawCanvas();
    };
}

// Fonction pour charger l'image de l'utilisateur
function loadUserImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userImage.src = e.target.result;
            userImage.onload = () => {
                drawCanvas();
            };
        };
        reader.readAsDataURL(file);
    }
}
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canevas
    ctx.fillStyle = "#FFFFFF"; // Fond blanc
    // Dessiner l'image du gâteau (si elle est chargée)
    if (cakeImage.src) {
        const cakeHeight = (cakeImage.height / cakeImage.width) * canvas.width;
        const cakeYOffset = canvas.height - cakeHeight;
        ctx.drawImage(cakeImage, 0, cakeYOffset, canvas.width, cakeHeight);
    }
    
    // Dessiner l'image de l'utilisateur (si elle est chargée)
    if (userImage.src) {
        const userImgSize = 100;
        ctx.drawImage(userImage, userXOffset, userYOffset, userImgSize, userImgSize);
    }
}



// Fonction pour vérifier si le clic est sur l'image de l'utilisateur
function isInsideUserImage(x, y) {
    const userImgSize = 100;
    return (
        x >= userXOffset &&
        x <= userXOffset + userImgSize &&
        y >= userYOffset &&
        y <= userYOffset + userImgSize
    );
}

// Événements de souris pour gérer le drag-and-drop
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Vérifie si le clic est sur l'image de l'utilisateur
    if (isInsideUserImage(x, y)) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        userXOffset = e.clientX - rect.left - 50; // Ajuste pour centrer
        userYOffset = e.clientY - rect.top - 50;
        drawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

function saveCanvasAsImage() {
    savedImageDataURL = canvas.toDataURL(); // Sauvegarde l'image comme dataURL
    alert("Modifications enregistrées !");
}

function sendToAdmin() {
    if (savedImageDataURL) {
        const adminGallery = document.getElementById('admin-gallery');
        const img = document.createElement('img');
        img.src = savedImageDataURL;
        img.classList.add('user-creation');
        adminGallery.appendChild(img);
        alert("Image envoyée à l'admin !");
    } else {
        alert("Veuillez d'abord enregistrer les modifications !");
    }
}
