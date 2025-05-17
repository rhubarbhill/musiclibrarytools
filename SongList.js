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
            const addedDate = song.Added || ""; // Assuming Added contains date as a string
    
            const genreTerms = genreSearch.toLowerCase().split(";").map(term => term.trim());
            const descriptorTerms = descriptorSearch.toLowerCase().split(";").map(term => term.trim());
            const yearTerms = yearSearch.split(";").map(term => term.trim());
            const languageTerms = languageSearch.toLowerCase().split(";").map(term => term.trim());
            const artistTerms = artistSearch.toLowerCase().split(";").map(term => term.trim());
            const nameTerms = nameSearch.toLowerCase().split(";").map(term => term.trim());
    
            function matches(field, terms, includeAll) {
                if (!field) return false;
                if (terms.length === 0) return true;
                return includeAll
                    ? terms.every(term => field.includes(term))
                    : terms.some(term => field.includes(term));
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

            function matchDateRange(songDate, startDate, endDate) {
                if (!songDate) return false;
                const songDateObj = new Date(songDate);
                const startDateObj = startDate ? new Date(startDate) : null;
                const endDateObj = endDate ? new Date(endDate) : null;
    
                if (startDateObj && endDateObj) {
                    return songDateObj >= startDateObj && songDateObj <= endDateObj;
                } else if (startDateObj) {
                    return songDateObj >= startDateObj;
                } else if (endDateObj) {
                    return songDateObj <= endDateObj;
                }
                return true;
            }
    
            return (
                matches(genres, genreTerms, includeAllGenres) &&
                matches(descriptors, descriptorTerms, includeAllDescriptors) &&
                (yearSearch === "" || matchYear(yearTerms, parseInt(year, 10))) &&
                (languageSearch === "" || matches(language, languageTerms, false)) &&
                (artistSearch === "" || matches(artist, artistTerms, false)) &&
                (nameSearch === "" || matches(name, nameTerms, false)) &&
                matchDateRange(addedDate, startDate, endDate)
            );
        });
    }    
//    function filteredSongs() {
//         return songsDict.filter((song) => {
//             const genres = song["B. Genre(s)"]?.toLowerCase();
//             const descriptors = song["All descriptors"]?.toLowerCase();
//             const year = song.Year.toString();
//             const language = song.Language?.toLowerCase();
//             const artist = song.Artist?.toLowerCase();
//             const name = song["Song"]?.toLowerCase();

//             const genreTerms = genreSearch.toLowerCase().split(";").map(term => term.trim());
//             const descriptorTerms = descriptorSearch.toLowerCase().split(";").map(term => term.trim());
 
//             function matches(field, terms, includeAll) {
//                 if (!field) return false;
//                 if (terms.length === 0) return true;
//                 return includeAll ? terms.every(term => field.includes(term)) : terms.some(term => field.includes(term));
//             }

//             return (
//                 matches(genres, genreTerms, includeAllGenres) &&
//                 matches(descriptors, descriptorTerms, includeAllDescriptors) &&
//                 (!yearSearch || year.includes(yearSearch)) &&
//                 (!languageSearch || language.includes(languageSearch)) &&
//                 (!artistSearch || artist.includes(artistSearch)) &&
//                 (!nameSearch || name.includes(nameSearch))
//             );
//         });
//     }

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
                        <button class="move-button" onclick="copyToClipboard('${song.Artist}')">🎤</button>
                        <button class="move-button" onclick="copyToClipboard('${song.Song}')">🎵</button>
                    </div>
                </div>
            `;

            taskList.appendChild(listItem);
        });
    }
    
    // Helper function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(
            () => {
                console.log(`Copied to clipboard: ${text}`);
            },
            (err) => {
                console.error("Failed to copy text: ", err);
            }
        );
    }

    // Random Replace
    function randomReplace(index) {
        const filtered = filteredSongs();
        if (filtered.length > 0) {
            tasks[index] = filtered[rand(0, filtered.length - 1)];
            renderTasks();
        }
    }

    // Random New
    function randomNew() {
        const filtered = filteredSongs();
        if (filtered.length > 0) {
            tasks.push(filtered[rand(0, filtered.length - 1)]);
            renderTasks();
        }
    }

    // Random Replace All
    function randomReplaceAll() {
        const filtered = filteredSongs();
        if (filtered.length > 0) {
            tasks = tasks.map(() => filtered[rand(0, filtered.length - 1)]);
            renderTasks();
        }
    }

    // Delete All
    function deleteAll() {
        tasks = [];
        renderTasks();
    }

    // Delete Task
    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Move Task Up
    function moveTaskUp(index) {
        if (index > 0) {
            [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
            renderTasks();
        }
    }

    // Move Task Down
    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            [tasks[index + 1], tasks[index]] = [tasks[index], tasks[index + 1]];
            renderTasks();
        }
    }

    // Expose functions globally
    window.copyToClipboard = copyToClipboard;
    window.randomReplace = randomReplace;
    window.randomNew = randomNew;
    window.randomReplaceAll = randomReplaceAll;
    window.deleteAll = deleteAll;
    window.deleteTask = deleteTask;
    window.moveTaskUp = moveTaskUp;
    window.moveTaskDown = moveTaskDown;

    // Initial render
    renderTasks();

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

    // Update the genre search filter
    document.getElementById("genre-search").addEventListener("input", (e) => {
        genreSearch = e.target.value;
        renderTasks(); // Re-render tasks based on the updated filters
    });

    // Update the artist search filter
    document.getElementById("artist-search").addEventListener("input", (e) => {
        artistSearch = e.target.value;
        renderTasks();
    });

    // Similarly, add listeners for other filters like year, language, etc.
    document.getElementById("descriptor-search").addEventListener("input", (e) => {
        descriptorSearch = e.target.value;
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

    document.getElementById("start-date").addEventListener("change", (e) => {
        startDate = e.target.value;
        renderTasks();
    });
    
    document.getElementById("end-date").addEventListener("change", (e) => {
        endDate = e.target.value;
        renderTasks();
    });
    


    // Attach global buttons
    document.getElementById("random-new-button").addEventListener("click", randomNew);
    document.getElementById("random-replace-all-button").addEventListener("click", randomReplaceAll);
    document.getElementById("delete-all-button").addEventListener("click", deleteAll);

    document.getElementById("load-all-button").addEventListener("click", loadAll);
});

// // We need to change this later

// document.addEventListener('DOMContentLoaded', () => {
//     // const songsDict = /* Import or copy songs2.js data here */;
//     // Access songsDict from the global scope (provided by songs2.js)
//     console.log('J', songsDict[rand(0, songsDict.length - 1)].Conc);
    
//     // Random number generator function
//     function rand(min, max) {
//         return Math.floor(Math.random() * (max - min + 1) + min);
//     }

//     // State variables
//     let tasks = [songsDict[0], songsDict[1], songsDict[2]];
//     let newTask = "";

//     let searchTerm = "";

//     let genreSearch = "";
//     let descriptorSearch = "";
//     let yearSearch = "";
//     let languageSearch = "";
//     let artistSearch = "";
//     let nameSearch = "";
//     let startDate = "";
//     let endDate = "";

//     let allMatchingSongs = []; // Holds all matching songs

//     // Checkbox state
//     let includeAllGenres = false;
//     let includeAllDescriptors = false;
//     let includeAllYears = false;
//     let includeAllLanguages = false;

//     // Filter logic
//     function filteredSongs() {
//         return songsDict.filter((song) => {
//             const genres = song["B. Genre(s)"]?.toLowerCase();
//             const descriptors = song["All descriptors"]?.toLowerCase();
//             const year = song.Year.toString();
//             const language = song.Language?.toLowerCase();
//             const artist = song.Artist?.toLowerCase();
//             const name = song["Song"]?.toLowerCase();

//             const genreSearchTerms = genreSearch.split(";").map(term => term.trim().toLowerCase());
//             const descriptorSearchTerms = descriptorSearch.split(";").map(term => term.trim().toLowerCase());
//             const yearSearchTerms = yearSearch.split(";").map(term => term.trim());
//             const languageSearchTerms = languageSearch.split(";").map(term => term.trim().toLowerCase());
//             const artistSearchTerms = artistSearch.split(";").map(term => term.trim().toLowerCase());
//             const nameSearchTerms = nameSearch.split(";").map(term => term.trim().toLowerCase());

//             function matchSearchTerms(searchTerms, field, includeAll) {
//                 if (!field) return false;
//                 if (searchTerms.length === 0) return true;
//                 return includeAll
//                     ? searchTerms.every(term => field.includes(term))
//                     : searchTerms.some(term => field.includes(term));
//             }

//             function matchYear(searchTerms, songYear) {
//                 return searchTerms.some((term) => {
//                     if (term.includes("-")) {
//                         const [start, end] = term.split("-").map(Number);
//                         return songYear >= start && songYear <= end;
//                     } else {
//                         return parseInt(term, 10) === parseInt(songYear, 10);
//                     }
//                 });
//             }

//             function matchDateRange(songDate, startDate, endDate) {
//                 if (!songDate) return false;
//                 const songDateObj = new Date(songDate);
//                 const startDateObj = startDate ? new Date(startDate) : null;
//                 const endDateObj = endDate ? new Date(endDate) : null;

//                 if (startDateObj && endDateObj) {
//                     return songDateObj >= startDateObj && songDateObj <= endDateObj;
//                 } else if (startDateObj) {
//                     return songDateObj >= startDateObj;
//                 } else if (endDateObj) {
//                     return songDateObj <= endDateObj;
//                 }
//                 return true;
//             }

//             const matchesGenre = genreSearch === "" || matchSearchTerms(genreSearchTerms, genres, includeAllGenres);
//             const matchesDescriptor = descriptorSearch === "" || matchSearchTerms(descriptorSearchTerms, descriptors, includeAllDescriptors);
//             const matchesYear = yearSearch === "" || matchYear(yearSearchTerms, year);
//             const matchesLanguage = languageSearch === "" || matchSearchTerms(languageSearchTerms, language, includeAllLanguages);
//             const matchesArtist = artistSearch === "" || matchSearchTerms(artistSearchTerms, artist, false);
//             const matchesName = nameSearch === "" || matchSearchTerms(nameSearchTerms, name, false);
//             const matchesDate = matchDateRange(song.Added, startDate, endDate);

//             return matchesGenre && matchesDescriptor && matchesYear && matchesLanguage && matchesArtist && matchesName && matchesDate;
//         });
//     }

//      // Filtered songs
//     // let filteredSongs = []; // Re-calculate this dynamically if needed

//     // Handle input change
//     function handleInputChange(event) {
//         newTask = event.target.value;
//     }

//     // Add a new random song
//     function randomNew() {
//         if (filteredSongs.length > 0) {
//             const newSong = filteredSongs[rand(0, filteredSongs.length - 1)];
//             tasks.push(newSong);
//             renderTasks();
//         } else {
//             alert("No songs match your search criteria.");
//         }
//     }

//     // Replace a specific task with a random song
//     function randomReplace(index) {
//         if (filteredSongs.length > 0) {
//             const newSong = filteredSongs[rand(0, filteredSongs.length - 1)];
//             tasks[index] = newSong;
//             renderTasks();
//         }
//     }

//     // Replace all tasks with random songs
//     function randomReplaceAll() {
//         if (filteredSongs.length > 0) {
//             tasks = tasks.map(() => filteredSongs[rand(0, filteredSongs.length - 1)]);
//             renderTasks();
//         }
//     }

//     // Delete all tasks
//     function deleteAll() {
//         tasks = [];
//         renderTasks();
//     }

//     // Add a specific task
//     function addTask() {
//         if (newTask.trim() !== "") {
//             tasks.push({ Song: newTask, Artist: "Unknown Artist", Year: "Unknown Year" }); // Example default
//             newTask = ""; // Clear input
//             renderTasks();
//         }
//     }

//     // Delete a specific task
//     function deleteTask(index) {
//         tasks.splice(index, 1);
//         renderTasks();
//     }

//     // Move task up
//     function moveTaskUp(index) {
//         if (index > 0) {
//             [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
//             renderTasks();
//         }
//     }

//     // Move task down
//     function moveTaskDown(index) {
//         if (index < tasks.length - 1) {
//             [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
//             renderTasks();
//         }
//     }

//     // Render song details
//     function Conc(song) {
//         const { artist, Song } = song;

//         if (!artist.includes("; ")) {
//             return `${artist} - ${Song}`;
//         }

//         const artistList = artist.split("; ");
//         const mainArtists = [artistList[0]];
//         const features = [];

//         artistList.slice(1).forEach((part) => {
//             if (part.startsWith("ft. ")) {
//                 features.push(part.slice(4));
//             } else {
//                 mainArtists.push(part);
//             }
//         });

//         const mainArtistsString = mainArtists.join(", ");
//         const featuresString = features.length ? ` (ft. ${features.join(", ")})` : "";

//         return `${mainArtistsString} - ${Song}${featuresString}`;
//     }

//     // Render tasks to the DOM
//     function renderTasks() {
//         const taskList = document.querySelector("#task-list");
//         taskList.innerHTML = ""; // Clear existing tasks

//         tasks.forEach((task, index) => {
//             const listItem = document.createElement("li");
//             listItem.textContent = Conc(task);

//             // Add buttons
//             const randomReplaceBtn = document.createElement("button");
//             randomReplaceBtn.textContent = "🎲";
//             randomReplaceBtn.addEventListener("click", () => randomReplace(index));

//             const deleteBtn = document.createElement("button");
//             deleteBtn.textContent = "❌";
//             deleteBtn.addEventListener("click", () => deleteTask(index));

//             const moveUpBtn = document.createElement("button");
//             moveUpBtn.textContent = "👆";
//             moveUpBtn.addEventListener("click", () => moveTaskUp(index));

//             const moveDownBtn = document.createElement("button");
//             moveDownBtn.textContent = "👇";
//             moveDownBtn.addEventListener("click", () => moveTaskDown(index));

//             // Append elements
//             listItem.appendChild(randomReplaceBtn);
//             listItem.appendChild(deleteBtn);
//             listItem.appendChild(moveUpBtn);
//             listItem.appendChild(moveDownBtn);

//             taskList.appendChild(listItem);
//         });
//     }

//     // Initial render
//     renderTasks();

//     // Initialize UI here (e.g., create elements, add event listeners)
//     console.log(filteredSongs());
// });
