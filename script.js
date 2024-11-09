let cakeImage = new Image();
let userImage = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Position initiale de l'image de l'utilisateur
let userXOffset = canvas.width / 2 - 50; // Centré horizontalement par défaut
let userYOffset = 300; // Position initiale
let isDragging = false; // État de drag
let userImageWidth = 100; // Initial width of the user image
let userImageHeight = 100; // Initial height of the user image
let isResizing = false; // To track if resizing is happening
let resizeHandleSize = 10; // Size of the resize handle


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

/// Function to load multiple user images
function loadUserImage(event) {
    const files = event.target.files;
    if (files) {
        // Loop through all selected files and add them to the canvas
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = (e) => {
                let newImage = new Image();
                newImage.src = e.target.result;
                newImage.onload = () => {
                    // Add the image and its initial position
                    userImages.push({
                        img: newImage,
                        x: canvas.width / 2 - newImage.width / 2,  // Default X position (centered)
                        y: canvas.height / 2 - newImage.height / 2, // Default Y position (centered)
                        width: newImage.width,
                        height: newImage.height
                    });
                    drawCanvas(); // Redraw canvas with new image
                };
            };
            reader.readAsDataURL(file);
        }
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
     // Draw resize handle
    drawResizeHandle();
}
// Check if mouse is inside the resize handle
function isInsideResizeHandle(x, y) {
    const handleX = userXOffset + userImageWidth - resizeHandleSize / 2;
    const handleY = userYOffset + userImageHeight - resizeHandleSize / 2;
    return x >= handleX && x <= handleX + resizeHandleSize && y >= handleY && y <= handleY + resizeHandleSize;
}

// Mouse down event to start dragging or resizing
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (isInsideResizeHandle(x, y)) {
        isResizing = true; // Start resizing
    } else {
        // Check if the user clicked inside the image (to drag)
        if (x >= userXOffset && x <= userXOffset + userImageWidth && y >= userYOffset && y <= userYOffset + userImageHeight) {
            isDragging = true; // Start dragging
        }
    }
});
// Mouse move event to handle dragging or resizing
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        userXOffset = e.clientX - rect.left - userImageWidth / 2;
        userYOffset = e.clientY - rect.top - userImageHeight / 2;
        drawCanvas();
    }
    if (isResizing) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Calculate new image size based on mouse movement
        userImageWidth = x - userXOffset;
        userImageHeight = y - userYOffset;
        drawCanvas(); // Redraw the canvas with the new image size
    }
});

// Mouse up event to stop dragging or resizing
canvas.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
});

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
