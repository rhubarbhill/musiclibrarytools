const fs = require("fs");
const csv = require("csv-parser"); // Install with `npm install csv-parser`

// Input into terminal: node csv2jsonSongs.js 

// Input and output file paths
const inputCsv = "./songs.csv"; // Path to your input CSV file
const outputJson = "./songs2.js"; // Path to the output JSON file

// Fields that should remain as strings
const stringFields = [
    "Song",
    "Artist",
    "F. Genre(s)",
    "B. Genre(s)",
    "All descriptors",
    "Comments",
    "BM",
    "Language",
    "Alt. Song Name(s)",
    "Alt. Artist Name(s)",
    "Notes",
    "Attributes",
    "Owned",
    "Mixtape(s)",
    "Added",
    "Conc",
    "BC",
    "TC",
];

// Fields that should be numbers
const numberFields = ["Score", "Year"];

// Function to process rows and ensure proper data types
function processRow(row) {
    const processedRow = {};

    for (const key in row) {
        if (stringFields.includes(key)) {
            processedRow[key] = row[key].trim(); // Always treat as string
        } else if (numberFields.includes(key)) {
            processedRow[key] = parseFloat(row[key]) || null; // Convert to number or null
        } else {
            processedRow[key] = row[key]; // Default behavior for unknown fields
        }
    }

    return processedRow;
}

// Read and process the CSV file
function convertCsvToJson(inputCsv, outputJson) {
    const results = [];

    fs.createReadStream(inputCsv)
        .pipe(csv())
        .on("data", (row) => {
            const processedRow = processRow(row);
            results.push(processedRow);
        })
        .on("end", () => {
            // Write the results to the output file as a JS variable
            const jsContent = `window.songsDict = ${JSON.stringify(results, null, 2)};`;
            fs.writeFileSync(outputJson, jsContent);
            console.log(`Conversion complete. JSON saved to ${outputJson}`);
        });
}

// Run the conversion
convertCsvToJson(inputCsv, outputJson);
