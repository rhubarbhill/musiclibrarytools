// Function to load the navbar
function loadNavbar() {
    const navbarHTML = `
        <nav style="background-color: #f4f4f4; padding: 1em; text-align: center;">
            <a href="index.html" style="margin-right: 1em; text-decoration: none; color: #333;">Home</a>
            <a href="song_randomizer.html" style="margin-right: 1em; text-decoration: none; color: #333;">Song Randomizer</a>
            <a href="album_randomizer.html" style="text-decoration: none; color: #333;">Album Randomizer</a>
        </nav>
    `;
    document.getElementById('navbar').innerHTML = navbarHTML;
}

// Function to save the state into localStorage
function saveState() {
    const pageData = {};

    // Save data from Home Page
    if (document.getElementById('home-text')) {
        pageData.homeText = document.getElementById('home-text').value;
    }

    // Save data from Song Randomizer Page
    if (document.getElementById('song-notes')) {
        pageData.songNotes = document.getElementById('song-notes').value;
    }

    // Save data from Album Randomizer Page
    if (document.getElementById('album-notes')) {
        pageData.albumNotes = document.getElementById('album-notes').value;
    }

    // Store in localStorage
    localStorage.setItem('pageState', JSON.stringify(pageData));
}

// Function to load the state from localStorage
function loadState() {
    const pageData = JSON.parse(localStorage.getItem('pageState')) || {};

    // Load data into Home Page
    if (document.getElementById('home-text')) {
        document.getElementById('home-text').value = pageData.homeText || '';
    }

    // Load data into Song Randomizer Page
    if (document.getElementById('song-notes')) {
        document.getElementById('song-notes').value = pageData.songNotes || '';
    }

    // Load data into Album Randomizer Page
    if (document.getElementById('album-notes')) {
        document.getElementById('album-notes').value = pageData.albumNotes || '';
    }
}

// Initialize the navbar and handle state
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadState();

    // Save state before the page is unloaded
    window.addEventListener('beforeunload', saveState);
});
