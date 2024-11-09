let cakeImage = new Image();
let userImage = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Initial user image properties
let userXOffset = canvas.width / 2 - 50; // Center horizontally by default
let userYOffset = 300; // Default vertical position
let userImageWidth = 100; // Initial width of the user image
let userImageHeight = 100; // Initial height of the user image
let zoomFactor = 1; // Zoom factor

let isDragging = false; // To track if the image is being dragged

// Load the gallery and set up the initial canvas
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-section').style.display === 'block') {
        loadAdminGallery();
    }
});

// Function to load and select a cake image from the gallery
function selectCake(src) {
    cakeImage.src = src;
    cakeImage.onload = () => {
        drawCanvas();
    };
}

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

// Function to draw images on the canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the cake image if loaded
    if (cakeImage.src) {
        const cakeHeight = (cakeImage.height / cakeImage.width) * canvas.width;
        const cakeYOffset = canvas.height - cakeHeight;
        ctx.drawImage(cakeImage, 0, cakeYOffset, canvas.width, cakeHeight);
    }

    // Draw the user image if loaded (applying zoom)
    if (userImage.src) {
        ctx.drawImage(userImage, userXOffset, userYOffset, userImageWidth * zoomFactor, userImageHeight * zoomFactor);
    }
}

// Mouse down event to start dragging
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= userXOffset && x <= userXOffset + userImageWidth * zoomFactor && y >= userYOffset && y <= userYOffset + userImageHeight * zoomFactor) {
        isDragging = true; // Start dragging the image
    }
});

// Mouse move event to handle dragging
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        userXOffset = e.clientX - rect.left - userImageWidth * zoomFactor / 2;
        userYOffset = e.clientY - rect.top - userImageHeight * zoomFactor / 2;
        drawCanvas();
    }
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Zoom In function
function zoomIn() {
    zoomFactor += 0.1; // Increase zoom factor by 10%
    drawCanvas(); // Redraw the canvas with the new zoom
}

// Zoom Out function
function zoomOut() {
    zoomFactor = Math.max(0.1, zoomFactor - 0.1); // Decrease zoom factor by 10%, but not below 0.1
    drawCanvas(); // Redraw the canvas with the new zoom
}

// Function to save the canvas as an image
function saveCanvasAsImage() {
    const savedImageDataURL = canvas.toDataURL(); // Save the image as a data URL
    alert("Modifications saved!");
}

// Function to send the canvas image to the admin
function sendToAdmin() {
    const savedImageDataURL = canvas.toDataURL();
    if (savedImageDataURL) {
        saveImageToLocalStorage(savedImageDataURL);
        alert("Image sent to admin!");
    } else {
        alert("Please save the modifications first!");
    }
}

// Function to save the image in LocalStorage
function saveImageToLocalStorage(imageData) {
    const images = JSON.parse(localStorage.getItem('adminImages')) || [];
    images.push(imageData);
    localStorage.setItem('adminImages', JSON.stringify(images));
    loadAdminGallery(); // Refresh the admin gallery
}

// Function to load the admin gallery
function loadAdminGallery() {
    const adminGallery = document.getElementById('admin-gallery');
    adminGallery.innerHTML = ""; // Clear the gallery

    const images = JSON.parse(localStorage.getItem('adminImages')) || [];
    images.forEach(imageData => {
        const img = document.createElement('img');
        img.src = imageData;
        img.classList.add('user-creation');
        img.onclick = () => addToCanvas(imageData); // Add image to canvas on click
        adminGallery.appendChild(img);
    });
}

// Function to add the selected gallery image to the canvas
function addToCanvas(imageSrc) {
    userImage.src = imageSrc;
    userImage.onload = () => {
        userXOffset = canvas.width / 2 - userImage.width / 2; // Center the image
        userYOffset = canvas.height / 2 - userImage.height / 2; // Center the image
        userImageWidth = userImage.width; // Set original width
        userImageHeight = userImage.height; // Set original height
        zoomFactor = 1; // Reset zoom factor
        drawCanvas(); // Redraw the canvas
}
