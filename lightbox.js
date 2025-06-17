// Open lightbox
function openLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "flex";
}

// Close lightbox
function closeLightbox(event) {
    const lightbox = document.getElementById("lightbox");
    if (!event || event.target === lightbox) {
        lightbox.style.display = "none";
    }
}

// Ensure lightbox is hidden on page load
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none"; // Ensure it's hidden on load
});
