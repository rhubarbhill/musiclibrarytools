document.addEventListener("DOMContentLoaded", () => {
    // Dummy data for testing
    const songsDict = [
        { Artist: "Taylor Swift", Song: "Lover", Year: 2019, "B. Genre(s)": "Pop", BC: "#f5f5dc", TC: "#000000" },
        { Artist: "Adele", Song: "Hello", Year: 2015, "B. Genre(s)": "Soul; Pop", BC: "#ffcccb", TC: "#000000" },
        { Artist: "The Beatles", Song: "Yesterday", Year: 1965, "B. Genre(s)": "Rock", BC: "#add8e6", TC: "#000000" },
    ];

    let tasks = [...songsDict]; // Initialize tasks with songsDict

    // Render tasks to the DOM
    function renderTasks() {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Clear the list

        tasks.forEach((song, index) => {
            const listItem = document.createElement("li");
            listItem.className = "song-row";
            listItem.style.backgroundColor = song.BC;

            listItem.innerHTML = `
                <div>
                    <strong>${song.Artist}</strong> - ${song.Song} (${song.Year})
                    <span style="font-size: 0.9rem; color: ${song.TC};">${song["B. Genre(s)"]}</span>
                </div>
                <div>
                    <button onclick="randomReplace(${index})">🎲</button>
                    <button onclick="deleteTask(${index})">❌</button>
                </div>
            `;

            taskList.appendChild(listItem);
        });
    }

    // Example button functions
    function randomReplace(index) {
        tasks[index] = songsDict[Math.floor(Math.random() * songsDict.length)];
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Expose functions globally
    window.randomReplace = randomReplace;
    window.deleteTask = deleteTask;

    // Initial render
    renderTasks();
});
