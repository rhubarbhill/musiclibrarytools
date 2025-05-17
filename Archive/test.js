return (<div className="to-do-list">

    <h1>Song Randomizer</h1>

    <div>
        <button
            className="top-button"
            onClick={randomNew}>
            Random New
        </button>
        <button
            className="top-button"
            onClick={randomReplaceAll}>
            Random Replace All
        </button>
        <button
            className="delete-all"
            onClick={deleteAll}
            style={{
                backgroundColor: "red",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "10px 15px",
                marginLeft: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            Delete All
        </button>
    </div>

    <div className="song-page">
        <div className="song-container">
            <ol>
                {tasks.map((song, index) =>
                    <li key={index} style={{ backgroundColor: song.BC }} className="song-row">
                        <div className="song-content">
                            <th className="song-info" style={{ color: song.TC }}>
                                <div>
                                    <span className="song-name">
                                        {<Conc
                                            artist={song.Artist}
                                            song={song.Song}
                                        />} <span style={{ fontWeight: "normal", fontSize: "0.9rem" }}>
                                            ({song.Year})
                                        </span>
                                    </span>
                                </div>
                                <div>
                                    <span className="genres" style={{ fontWeight: "normal", fontSize: "1rem" }}>
                                        {song["F. Genre(s)"].replaceAll(";", ",")}
                                    </span>
                                </div>
                            </th>

                            <th className="buttons">
                                <button
                                    className="add-button"
                                    onClick={() => randomReplace(index)}>
                                    🎲
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(index)}>
                                    ❌
                                </button>

                                <button
                                    className="move-button"
                                    onClick={() => moveTaskUp(index)}>
                                    👆
                                </button>

                                <button
                                    className="move-button"
                                    onClick={() => moveTaskDown(index)}>
                                    👇
                                </button>
                            </th>
                        </div>
                    </li>
                )}
            </ol>
        </div>

        <div className="search-container">
            <div className="search-group">
                <input
                    type="text"
                    placeholder="Search by artist..."
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                />
            </div>
            <div className="search-group">
                <input
                    type="text"
                    placeholder="Search by song name..."
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                />
            </div>

            <div className="search-group">
                <div>
                    <input
                        type="text"
                        placeholder="Search by genre..."
                        value={genreSearch}
                        onChange={(e) => setGenreSearch(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={includeAllGenres}
                            onChange={(e) => setIncludeAllGenres(e.target.checked)}
                        />
                        Include all
                    </label>
                </div>
            </div>

            <div className="search-group">
                <div>
                    <input
                        type="text"
                        placeholder="Search by descriptor..."
                        value={descriptorSearch}
                        onChange={(e) => setDescriptorSearch(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={includeAllDescriptors}
                            onChange={(e) => setIncludeAllDescriptors(e.target.checked)}
                        />
                        Include all
                    </label>
                </div>
            </div>

            <div className="search-group">
                <div>
                    <input
                        type="text"
                        placeholder="Search by year..."
                        value={yearSearch}
                        onChange={(e) => setYearSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="search-group">
                <div>
                    <input
                        type="text"
                        placeholder="Search by language..."
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={includeAllLanguages}
                            onChange={(e) => setIncludeAllLanguages(e.target.checked)}
                        />
                        Include all
                    </label>
                </div>
            </div>

            <div className="search-group">
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="search-group">
                <label>End Date:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
        </div>
    </div>

    <div className="all-matching-songs">
        <button
            onClick={loadAll}
            style={{
                marginTop: "20px",
                marginBottom: "10px",
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            Load All
        </button>
        <div className="song-list">
            {allMatchingSongs.map((song, index) => (
                <div
                    key={index}
                    className="song-row"
                    style={{ backgroundColor: song.BC }}
                >
                    <div style={{ color: song.TC }}>
                        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                            {song.Artist} - {song["Song"]}
                        </div>
                        <div style={{ fontSize: "0.8rem", marginTop: "5px" }}>
                            {song.Year} | {song["B. Genre(s)"]}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>

</div>)