let cakeImage = new Image();
let userImage = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Position initiale de l'image de l'utilisateur
let userXOffset = canvas.width / 2 - 50; // Centré horizontalement par défaut
let userYOffset = 300; // Position initiale
let isDragging = false; // État de drag




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
    // Effacer le canevas et remplir avec un fond blanc
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF"; // Fond blanc
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'image du gâteau (si elle est chargée)
    if (cakeImage.src) {
        // Calculer la taille de l'image de gâteau pour conserver le rapport d'aspect
        let cakeWidth = canvas.width;
        let cakeHeight = (cakeImage.height / cakeImage.width) * cakeWidth;

        // Ajuster la hauteur et la largeur pour qu'elles s'adaptent au canevas
        if (cakeHeight > canvas.height) {
            cakeHeight = canvas.height;
            cakeWidth = (cakeImage.width / cakeImage.height) * cakeHeight;
        }

        // Centrer l'image dans le canevas
        const cakeXOffset = (canvas.width - cakeWidth) / 2;
        const cakeYOffset = (canvas.height - cakeHeight) / 2;
        ctx.drawImage(cakeImage, cakeXOffset, cakeYOffset, cakeWidth, cakeHeight);
    }

    // Dessiner l'image de l'utilisateur (si elle est chargée)
    if (userImage.src) {
        const userImgSize = 100; // Taille de l'image de l'utilisateur
        const userXOffset = canvas.width / 2 - userImgSize / 2;
        const userYOffset = canvas.height / 2 - userImgSize / 2;
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

function downloadImage() {
    if (savedImageDataURL) {
        const link = document.createElement('a');
        link.download = 'photo-gateau.png';
        link.href = savedImageDataURL; // Utilise l'image enregistrée
        link.click();
    } else {
        alert("Veuillez d'abord enregistrer les modifications !");
    }
}
