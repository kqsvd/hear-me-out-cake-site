let cakeImage = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let savedImageDataURL = "";
let userImages = []; // Déclaration globale pour stocker les images de l'utilisateur avec leurs positions
let draggedImageIndex = null; // Indice de l'image actuellement déplacée
let isDragging = false;


// Charger la galerie d'admin dès le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Vérifie si l'admin est connecté en accédant directement (optionnel : gérer la connexion)
    if (document.getElementById('admin-section').style.display === 'block') {
        loadAdminGallery();
    }
});
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
    
    if (password === "admin123") {  // Mot de passe fictif
        document.getElementById('user-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        document.getElementById('admin-login').style.display = 'none'; // Masquer le bouton de connexion admin

        hideAdminLogin();
        loadAdminGallery();  // Charger les images de la galerie d'admin dès la connexion
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

// Fonction pour charger plusieurs images de l'utilisateur
function loadUserImages(event) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                // Ajouter chaque image avec une position initiale dans le tableau userImages
                userImages.push({ img: img, x: canvas.width / 2 - 50, y: userImages.length * 110 });
                drawCanvasWithImages(); // Redessiner le canevas avec les nouvelles images
            };
        };
        reader.readAsDataURL(file);
    }
}

// Fonction pour dessiner les images sur le canevas
function drawCanvasWithImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'image du gâteau si elle est sélectionnée
    if (cakeImage.src) {
        const cakeHeight = (cakeImage.height / cakeImage.width) * canvas.width;
        const cakeYOffset = canvas.height - cakeHeight;
        ctx.drawImage(cakeImage, 0, cakeYOffset, canvas.width, cakeHeight);
    }

    // Dessiner chaque image de l'utilisateur avec sa position spécifique
    userImages.forEach((userImage) => {
        const userImgSize = 100;
        ctx.drawImage(userImage.img, userImage.x, userImage.y, userImgSize, userImgSize);
    });
}

// Fonction pour vérifier si le clic est sur une image
function getClickedImageIndex(x, y) {
    for (let i = userImages.length - 1; i >= 0; i--) { // Vérifie de haut en bas
        const userImage = userImages[i];
        if (
            x >= userImage.x &&
            x <= userImage.x + 100 &&
            y >= userImage.y &&
            y <= userImage.y + 100
        ) {
            return i; // Renvoie l'indice de l'image cliquée
        }
    }
    return null;
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

// Fonction pour vérifier si le clic est sur une image
function getClickedImageIndex(x, y) {
    for (let i = userImages.length - 1; i >= 0; i--) { // Vérifie de haut en bas
        const userImage = userImages[i];
        if (
            x >= userImage.x &&
            x <= userImage.x + 100 &&
            y >= userImage.y &&
            y <= userImage.y + 100
        ) {
            return i; // Renvoie l'indice de l'image cliquée
        }
    }
    return null;
}

// Événements pour gérer le déplacement des images
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedIndex = getClickedImageIndex(x, y);
    if (clickedIndex !== null) {
        draggedImageIndex = clickedIndex;
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && draggedImageIndex !== null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Mettre à jour la position de l'image en cours de déplacement
        userImages[draggedImageIndex].x = x - 50; // Centrer l'image sous la souris
        userImages[draggedImageIndex].y = y - 50;
        drawCanvasWithImages(); // Redessiner le canevas
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    draggedImageIndex = null;
});

function saveCanvasAsImage() {
    savedImageDataURL = canvas.toDataURL(); // Sauvegarde l'image comme dataURL
    alert("Modifications enregistrées !");
}

function sendToAdmin() {
    if (savedImageDataURL) {
        saveImageToLocalStorage(savedImageDataURL);
        alert("Image envoyée à l'admin !");
    } else {
        alert("Veuillez d'abord enregistrer les modifications !");
    }
}

// Fonction pour sauvegarder une image dans le Local Storage
function saveImageToLocalStorage(imageData) {
    const images = JSON.parse(localStorage.getItem('adminImages')) || [];
    images.push(imageData);
    localStorage.setItem('adminImages', JSON.stringify(images));
    loadAdminGallery(); // Rafraîchit la galerie d'admin
}

// Fonction pour charger les images de la galerie d'admin depuis le Local Storage
function loadAdminGallery() {
    const adminGallery = document.getElementById('admin-gallery');
    adminGallery.innerHTML = ""; // Efface le contenu actuel

    const images = JSON.parse(localStorage.getItem('adminImages')) || [];
    images.forEach(imageData => {
        const img = document.createElement('img');
        img.src = imageData;
        img.classList.add('user-creation');
        img.onclick = () => openLightbox(imageData); // Ouvrir la lightbox au clic
        adminGallery.appendChild(img);
    });
}

// Fonction pour ouvrir la lightbox
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    lightboxImage.src = imageSrc;
    lightbox.style.display = 'flex';

    if (lightboxImage) {
        lightboxImage.src = imageSrc; // Ensure imageSrc is correctly passed
        lightbox.style.display = 'flex'; // Show the lightbox
    } else {
        console.error('Lightbox image element not found!');
    }
}

// Fonction pour fermer la lightbox
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}
