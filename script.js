document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('spreadsheetTable');
    const inputBox = document.getElementById('inputBox');
    const modeLabel = document.getElementById('modeLabelWMR'); // Updated to match new HTML
    const addRowButton = document.getElementById('addRowButton');
    const copyAllButton = document.getElementById('copyAllButton');

    // Set up Wonder Music Run-specific rules
    modeLabel.textContent = "Wonder Music Run"; // Explicitly set to WMR
    inputBox.placeholder = "Enter data for Wonder Music Run...";

    // Function to copy a row
    const copyRow = (row) => {
        const cells = Array.from(row.querySelectorAll('td[contenteditable="true"]'));
        const rowData = cells.map(cell => cell.textContent.trim()).join('\t');
        navigator.clipboard.writeText(rowData)
            .then(() => {
                flashRow(row); // Trigger the visual confirmation
            })
            .catch(err => console.error('Failed to copy row: ', err));
    };

    // Function to flash the row for visual feedback
    const flashRow = (row) => {
        row.style.backgroundColor = '#0056b3'; // Highlight row temporarily
        setTimeout(() => {
            row.style.backgroundColor = ''; // Reset style
        }, 500); // Flash duration
    };

    // Function to copy all rows
    const copyAllRows = () => {
        const rows = table.querySelectorAll('tbody tr');
        const allData = Array.from(rows)
            .map(row => {
                const cells = Array.from(row.querySelectorAll('td[contenteditable="true"]'));
                return cells.map(cell => cell.textContent.trim()).join('\t');
            })
            .join('\n'); // Separate rows with newlines
        navigator.clipboard.writeText(allData)
            .then(() => {
                flashAllRows(); // Flash all rows for feedback
            })
            .catch(err => console.error('Failed to copy all rows: ', err));
    };

    // Function to flash all rows
    const flashAllRows = () => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.backgroundColor = '#0056b3';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 500);
        });
    };

    // Add event listener for dynamically added Copy buttons
    table.addEventListener('click', (event) => {
        if (event.target.classList.contains('copyRowButton')) {
            const row = event.target.closest('tr');
            copyRow(row);
        }
    });

    // Add functionality to dynamically add rows
    addRowButton.addEventListener('click', () => {
        const tableBody = document.querySelector('#spreadsheetTable tbody');
        const newRow = document.createElement('tr');

        // Create 18 editable cells
        for (let i = 0; i < 18; i++) {
            const newCell = document.createElement('td');
            newCell.setAttribute('contenteditable', 'true');
            newRow.appendChild(newCell);
        }

        // Add Copy button to the new row
        const actionCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copyRowButton';
        actionCell.appendChild(copyButton);
        newRow.appendChild(actionCell);

        tableBody.appendChild(newRow);
    });

    // Add event listener for "Copy All" button
    copyAllButton.addEventListener('click', copyAllRows);
});

// Divider

const fieldMapping = {
    'artist': 'artist',
    'a': 'artist',
    'score': 'score',
    's': 'score',
    'year': 'year',
    'y': 'year',
    'genre': 'genre',
    'g': 'genre',
    'desc': 'desc',
    'd': 'desc',
    'comments': 'comments',
    'c': 'comments',
    'language': 'language',
    'l': 'language',
    'alt-song': 'alt-song',
    'as': 'alt-song',
    'alt-art': 'alt-art',
    'aa': 'alt-art',
    'notes': 'notes',
    'n': 'notes',
    'attributes': 'attributes',
    'at': 'attributes',
    'owned': 'owned',
    'o': 'owned',
    'mixtape': 'mix',
    'm': 'mix',
    'added': 'added',
    'ad': 'added'
};

function parseInput(input) {
    const lines = input.split('\n');
    const songs = [];
    const globalFields = {};

    let isTrackReview = false;

    lines.forEach(line => {
        const trimmedLine = line.trim();

        if (!trimmedLine) return; // Skip empty lines

        if (trimmedLine.toLowerCase().startsWith('track review:')) {
            isTrackReview = true;
            return;
        }

        if (!isTrackReview) {
            // Parse global fields
            const colonIndex = trimmedLine.indexOf(':');
            if (colonIndex > -1) {
                const key = trimmedLine.slice(0, colonIndex).trim().toLowerCase();
                const value = trimmedLine.slice(colonIndex + 1).trim();

                // Normalize the key using fieldMapping
                const normalizedKey = fieldMapping[key] || key;

                globalFields[normalizedKey] = value;
            }
        } else {
            // Parse track details
            if (trimmedLine.startsWith('"')) {
                const songNameEndIndex = trimmedLine.indexOf('"', 1);
                if (songNameEndIndex > -1) {
                    const songName = trimmedLine.slice(1, songNameEndIndex);
                    const remainingText = trimmedLine.slice(songNameEndIndex + 1).trim();
                    const hasCheckmark = remainingText.includes('(+)', 0);  // Check for checkmark (+)
            
                    // Check for Artist - Song format
                    const hyphenIndex = songName.indexOf(' - ');
                    if (hyphenIndex !== -1) {
                        // If it matches the "Artist - Song" format, split accordingly
                        const artist = songName.slice(0, hyphenIndex).trim();
                        const song = songName.slice(hyphenIndex + 3).trim(); // skip over " - "
                        const songData = { song: song, artist: artist, checkmark: hasCheckmark, ...globalFields };
                        songs.push(songData);
                    } else {
                        // Otherwise, just treat it as a song
                        const songData = { song: songName, checkmark: hasCheckmark, ...globalFields };
                        songs.push(songData);
                    }
                }
            } else if (songs.length > 0) {
                const colonIndex = trimmedLine.indexOf(':');
                if (colonIndex > -1) {
                    const key = trimmedLine.slice(0, colonIndex).trim().toLowerCase();
                    const value = trimmedLine.slice(colonIndex + 1).trim();

                    // Normalize the key using fieldMapping
                    const normalizedKey = fieldMapping[key] || key;

                    songs[songs.length - 1][normalizedKey] = value;
                }
            }
        }
    });

    return songs;
}

// Function to render the parsed songs into the table
// function renderTable(songs) {
//     const tableBody = document.querySelector('#spreadsheetTable tbody');
//     tableBody.innerHTML = ''; // Clear existing rows

//     songs.forEach((song, index) => {
//         const row = document.createElement('tr');

//         // Create and append cells
//         const keys = [
//             '-', 'song', 'artist', 'score', 'year', 'genre', 'bg', 'desc',
//             'comments', 'bm', 'language', 'alt-song', 'alt-art', 'notes',
//             'attributes', 'owned', 'mix', 'added'
//         ];

//         keys.forEach(key => {
//             const cell = document.createElement('td');
//             if (key === '-') {
//                 // Set the checkmark based on the song's property
//                 cell.textContent = song.checkmark ? '✓' : '';
//             } else if (key === 'comments') {
//                 cell.textContent = song.comments?.trim();
//             } else {
//                 cell.textContent = song[key] || '';
//             }
//             cell.contentEditable = true; // Make cells editable
//             row.appendChild(cell);
//         });

//         // Add action button cell
//         const actionCell = document.createElement('td');
//         const copyButton = document.createElement('button');
//         copyButton.textContent = 'Copy';
//         copyButton.classList.add('copyRowButton');
//         copyButton.addEventListener('click', () => copyRow(row));
//         actionCell.appendChild(copyButton);
//         row.appendChild(actionCell);

//         tableBody.appendChild(row);
//     });
// }

function renderTable(songs) {
    const tableBody = document.querySelector('#spreadsheetTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    songs.forEach((song, index) => {
        const row = document.createElement('tr');

        // Create and append cells
        const keys = [
            '-', 'song', 'artist', 'score', 'year', 'genre', 'bg', 'desc',
            'comments', 'bm', 'language', 'alt-song', 'alt-art', 'notes',
            'attributes', 'owned', 'mix', 'added'
        ];

        keys.forEach(key => {
            const cell = document.createElement('td');

            if (key === '-') {
                cell.textContent = song.checkmark ? '✓' : '';
            } else if (key === 'song') {
                // Log the original and cleaned values for debugging
                console.log('Original Song:', song[key], 'Cleaned Song:', cleanSongOrArtist(song[key], 'song'));
                cell.textContent = cleanSongOrArtist(song[key], 'song');
            } else if (key === 'artist') {
                // Log the original and cleaned values for debugging
                console.log('Original Artist:', song[key], 'Cleaned Artist:', cleanSongOrArtist(song[key], 'artist'));
                cell.textContent = cleanSongOrArtist(song[key], 'artist');
            } else if (key === 'comments') {
                cell.textContent = song.comments?.trim();
            } else {
                cell.textContent = song[key] || '';
            }
            cell.contentEditable = true; // Make cells editable
            row.appendChild(cell);
        });

        // Add action button cell
        const actionCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.classList.add('copyRowButton');
        copyButton.addEventListener('click', () => copyRow(row));
        actionCell.appendChild(copyButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}


// Utility function to clean up song or artist names for the table
// function cleanSongOrArtist(value, type) {
//     const songCodeRegex = /^\[(Song|Album)\d+,/;

//     if (songCodeRegex.test(value)) {
//         const parts = value.replace(/^\[.*?,/, '').split(' - ');
//         if (type === 'artist') {
//             return parts[0]?.trim() || value; // Return artist part
//         } else if (type === 'song') {
//             // Remove any trailing "]" from the song part
//             const song = parts[1]?.trim() || value;
//             return song.replace(/]$/, ''); // Remove ONLY trailing brackets
//         }
//     }

//     return value; // Return original value if no cleanup needed
// }

// function cleanSongOrArtist(value, type) {
//     if (!value) return '';

//     // Remove [Song###] or [Album###] patterns
//     value = value.replace(/\[.*?\]/g, '');

//     // Trim whitespace after removing brackets
//     value = value.trim();

//     // For 'song', remove any trailing ']'
//     if (type === 'song') {
//         value = value.replace(/\]+$/, ''); // Remove any trailing right brackets
//     }

//     return value;
// }

function cleanSongOrArtist(value, type) {
    if (!value) return '';

    // Remove [Song###] or [Album###] patterns only at the beginning
    value = value.replace(/^\[.*?,/, ''); // Removes [Song###, or [Album###,

    // Trim whitespace after removing brackets
    value = value.trim();

    // Additional cleanup for 'song': Remove trailing brackets
    if (type === 'song') {
        value = value.replace(/\]+$/, ''); // Remove any trailing right brackets
    }

    return value;
}




// Function to copy a single row to the clipboard
function copyRow(row) {
    const rowText = Array.from(row.querySelectorAll('td'))
        .slice(0, -1) // Exclude the action button cell
        .map(cell => cell.textContent.trim())
        .join('\t'); // Use tab as a delimiter
    navigator.clipboard.writeText(rowText)
        .then(() => {
            row.style.backgroundColor = 'lightblue';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 500); // Revert after 500ms
        })
        .catch(err => console.error('Error copying row:', err));

}

// Function to copy all rows to the clipboard
function copyAllRows() {
    const tableBody = document.querySelector('#spreadsheetTable tbody');
    const rowsText = Array.from(tableBody.querySelectorAll('tr'))
        .map(row => Array.from(row.querySelectorAll('td'))
            .slice(0, -1) // Exclude the action button cell
            .map(cell => cell.textContent.trim())
            .join('\t') // Use tab as a delimiter
        )
        .join('\n'); // Use newline to separate rows
    navigator.clipboard.writeText(rowsText)
        .then(() => {
            const tableBody = document.querySelector('#spreadsheetTable tbody');
            tableBody.style.backgroundColor = 'lightblue';
            setTimeout(() => {
                tableBody.style.backgroundColor = '';
            }, 500); // Revert after 500ms
        })
        .catch(err => console.error('Error copying all rows:', err));

}

// Add event listener for input box
document.querySelector('#inputBox').addEventListener('input', (event) => {
    const input = event.target.value;
    const songs = parseInput(input);
    renderTable(songs);
});

// Add event listener for "Copy All" button
document.querySelector('#copyAllButton').addEventListener('click', copyAllRows);

// Output Working

document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.getElementById('inputBox');
    const outputBox = document.getElementById('outputBox');

    const generateOutput = () => {
        const inputText = inputBox.value.trim();
        const lines = inputText.split('\n');
        const outputLines = [];

        let isTrackReview = false;
        let currentEntry = [];
        let currentSongCode = '';

        const flushCurrentEntry = () => {
            if (currentEntry.length > 0) {
                const entryText = currentEntry.join('\n\n').trim();
                outputLines.push(entryText);
                currentEntry = [];
                currentSongCode = ''; // Reset song code after flushing
            }
        };

        lines.forEach(line => {
            const trimmedLine = line.trim();

            if (!trimmedLine) return; // Skip empty lines

            // Detect start of track review section
            if (trimmedLine.toLowerCase().startsWith('track review:')) {
                isTrackReview = true;
                return;
            }

            // Detect song/album code
            if (trimmedLine.startsWith('[')) {
                currentSongCode = trimmedLine; // Store the code for the current song
                return;
            }

            // Skip metadata lines like Y:, G:, D:, L:
            if (trimmedLine.match(/^[a-zA-Z]:/)) {
                return;
            }

            if (isTrackReview) {
                const songMatch = trimmedLine.match(/"([^"]+)"(\s\(\+\))?\s*-\s*(.*)/);

                if (songMatch) {
                    // New song detected: flush the previous entry
                    flushCurrentEntry();

                    const songName = songMatch[1];
                    const isAdded = !!songMatch[2];
                    const songDescription = songMatch[3].trim();

                    // Format song name and identifier
                    let formattedSong = `"${songName}"`;

                    if (currentSongCode) {
                        formattedSong = `[${currentSongCode},${songName}]`;
                    }

                    if (isAdded) {
                        const songNameWithoutQuotes = formattedSong.slice(1, -1); // Remove the outer quotes
                        formattedSong = `"[b]${songNameWithoutQuotes}[/b]"`; // Add bold inside new quotes
                    }

                    currentEntry.push(`${formattedSong} - ${songDescription}`);
                } else {
                    // Continuation of a multi-paragraph entry
                    currentEntry.push(trimmedLine);
                }
            }
        });

        // Flush any remaining entry after the loop
        flushCurrentEntry();

        // Set the outputBox's value with blank lines separating entries
        outputBox.value = outputLines.join('\n\n');
    };

    // Automatically update outputBox when inputBox changes
    inputBox.addEventListener('input', generateOutput);
});
