document.addEventListener("DOMContentLoaded", () => {
    // State variables
    let tasks = [songsDict[0], songsDict[1], songsDict[2]];
    let newTask = "";
    let allMatchingSongs = [];
    let genreSearch = "";
    let descriptorSearch = "";
    let yearSearch = "";
    let languageSearch = "";
    let artistSearch = "";
    let nameSearch = "";
    let startDate = "";
    let endDate = "";
    let includeAllGenres = false;
    let includeAllDescriptors = false;
    let includeAllLanguages = false;

    // Random number generator
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Filter logic
    function filteredSongs() {
        return songsDict.filter((song) => {
            const genres = song["B. Genre(s)"]?.toLowerCase() || "";
            const descriptors = song["All descriptors"]?.toLowerCase() || "";
            const year = song.Year?.toString() || "";
            const language = song.Language?.toLowerCase() || "";
            const artist = song.Artist?.toLowerCase() || "";
            const name = song["Song"]?.toLowerCase() || "";

            // Helper functions
            function matchSearchTerms(searchTerms, field, includeAll) {
                if (!field) return false;
                if (searchTerms.length === 0) return true;
                return includeAll
                    ? searchTerms.every(term => field.includes(term))
                    : searchTerms.some(term => field.includes(term));
            }

            function matchYear(searchTerms, songYear) {
                return searchTerms.some((term) => {
                    if (term.includes("-")) {
                        const [start, end] = term.split("-").map(Number);
                        return songYear >= start && songYear <= end;
                    } else {
                        return parseInt(term, 10) === parseInt(songYear, 10);
                    }
                });
            }

            // Split search terms
            const genreSearchTerms = genreSearch.split(";").map(term => term.trim().toLowerCase());
            const descriptorSearchTerms = descriptorSearch.split(";").map(term => term.trim().toLowerCase());
            const yearSearchTerms = yearSearch.split(";").map(term => term.trim());
            const languageSearchTerms = languageSearch.split(";").map(term => term.trim().toLowerCase());
            const artistSearchTerms = artistSearch.split(";").map(term => term.trim().toLowerCase());
            const nameSearchTerms = nameSearch.split(";").map(term => term.trim().toLowerCase());

            return (
                matchSearchTerms(genreSearchTerms, genres, includeAllGenres) &&
                matchSearchTerms(descriptorSearchTerms, descriptors, includeAllDescriptors) &&
                matchYear(yearSearchTerms, parseInt(year, 10)) &&
                matchSearchTerms(languageSearchTerms, language, includeAllLanguages) &&
                matchSearchTerms(artistSearchTerms, artist, false) &&
                matchSearchTerms(nameSearchTerms, name, false)
            );
        });
    }

    // Render tasks
    function renderTasks() {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";

        tasks.forEach((song, index) => {
            const listItem = document.createElement("li");
            listItem.className = "song-row";
            listItem.style.backgroundColor = song.BC;

            listItem.innerHTML = `
                <div class="song-content">
                    <div class="song-info" style="color: ${song.TC}">
                        <div>
                            <span class="song-name">
                                ${song.Artist} - ${song.Song} <span style="font-weight: normal; font-size: 0.9rem">(${song.Year})</span>
                            </span>
                        </div>
                        <div>
                            <span class="genres" style="font-weight: normal; font-size: 1rem">
                                ${song["F. Genre(s)"].replaceAll(";", ",")}
                            </span>
                        </div>
                    </div>
                    <div class="buttons">
                        <button class="add-button" onclick="randomReplace(${index})">🎲</button>
                        <button class="delete-button" onclick="deleteTask(${index})">❌</button>
                        <button class="move-button" onclick="moveTaskUp(${index})">👆</button>
                        <button class="move-button" onclick="moveTaskDown(${index})">👇</button>
                    </div>
                </div>
            `;

            taskList.appendChild(listItem);
        });
    }

    // Load All
    function loadAll() {
        allMatchingSongs = filteredSongs();
        const songList = document.getElementById("song-list");
        songList.innerHTML = "";

        allMatchingSongs.forEach((song) => {
            const songDiv = document.createElement("div");
            songDiv.className = "song-row";
            songDiv.style.backgroundColor = song.BC;

            songDiv.innerHTML = `
                <div style="color: ${song.TC};">
                    <div style="font-size: 1rem; font-weight: bold;">${song.Artist} - ${song.Song}</div>
                    <div style="font-size: 0.8rem; margin-top: 5px;">${song.Year} | ${song["B. Genre(s)"]}</div>
                </div>
            `;

            songList.appendChild(songDiv);
        });
    }

    // Attach event listeners for search filters
    document.getElementById("genre-search").addEventListener("input", (e) => {
        genreSearch = e.target.value;
        renderTasks();
    });
    document.getElementById("artist-search").addEventListener("input", (e) => {
        artistSearch = e.target.value;
        renderTasks();
    });
    document.getElementById("name-search").addEventListener("input", (e) => {
        nameSearch = e.target.value;
        renderTasks();
    });
    document.getElementById("year-search").addEventListener("input", (e) => {
        yearSearch = e.target.value;
        renderTasks();
    });
    document.getElementById("language-search").addEventListener("input", (e) => {
        languageSearch = e.target.value;
        renderTasks();
    });
    document.getElementById("include-all-genres").addEventListener("change", (e) => {
        includeAllGenres = e.target.checked;
        renderTasks();
    });
    document.getElementById("include-all-descriptors").addEventListener("change", (e) => {
        includeAllDescriptors = e.target.checked;
        renderTasks();
    });

    // Attach event listeners for buttons
    document.getElementById("random-new-button").addEventListener("click", randomNew);
    document.getElementById("random-replace-all-button").addEventListener("click", randomReplaceAll);
    document.getElementById("delete-all-button").addEventListener("click", deleteAll);
    document.getElementById("load-all-button").addEventListener("click", loadAll);

    // Expose global functions
    window.randomReplace = randomReplace;
    window.deleteTask = deleteTask;
    window.moveTaskUp = moveTaskUp;
    window.moveTaskDown = moveTaskDown;

    // Initial render
    renderTasks();
});
