// Save the state of all inputs and textareas on the page
function saveState() {
    const pageData = {};

    // Select all inputs and textareas on the page
    const elements = document.querySelectorAll('input, textarea');
    elements.forEach(element => {
        pageData[element.id] = element.value; // Use the element's ID as the key
    });

    // Save the page-specific data into localStorage
    localStorage.setItem('pageState', JSON.stringify(pageData));
}

// Load the state of all inputs and textareas from localStorage
function loadState() {
    const savedData = JSON.parse(localStorage.getItem('pageState')) || {};

    // Restore values to inputs and textareas
    Object.keys(savedData).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = savedData[id];
        }
    });
}

// Initialize state management on every page
document.addEventListener('DOMContentLoaded', () => {
    loadState(); // Restore data on page load

    // Save data before navigating away
    window.addEventListener('beforeunload', saveState);
});
