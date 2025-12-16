// Song data - will be populated from API
let songData = [];
let currentIndex = 0;
let currentAudio = null;

// iTunes API to fetch songs
async function fetchSongs(searchTerm = "pop hits 2024") {
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    
    try {
        // Using iTunes Search API (free, no auth required)
        const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=25`
        );
        const data = await response.json();
        
        songData = data.results.map((track, index) => ({
            id: index,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName || "Single",
            year: new Date(track.releaseDate).getFullYear().toString(),
            duration: formatDuration(track.trackTimeMillis),
            image: track.artworkUrl100.replace("100x100", "300x300"),
            previewUrl: track.previewUrl,
            trackId: track.trackId
        }));
        
        renderSongs();
        loading.style.display = "none";
        
        // Update about page song data in localStorage for stats
        localStorage.setItem("songDataCache", JSON.stringify(songData));
        
    } catch (error) {
        console.error("Error fetching songs:", error);
        loading.innerHTML = "Failed to load songs. Please try again.";
    }
}

// Format duration from milliseconds to mm:ss
function formatDuration(ms) {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Render songs to the DOM
function renderSongs() {
    const songsList = document.getElementById("songs-list");
    songsList.innerHTML = songData.map((song, index) => `
        <div class="song-item" data-index="${index}">
            <img src="${song.image}" alt="${song.title}">
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <span class="song-duration">${song.duration}</span>
        </div>
    `).join("");
    
    // Add click listeners to song items
    document.querySelectorAll(".song-item").forEach((item) => {
        item.addEventListener("click", () => {
            const index = parseInt(item.dataset.index);
            currentIndex = index;
            showSongDetails(index);
        });
    });
}

// Track play count in localStorage
function incrementPlayCount(index) {
    const song = songData[index];
    if (!song) return;
    
    const playCounts = JSON.parse(localStorage.getItem("playCounts")) || {};
    const key = song.trackId || index;
    playCounts[key] = (playCounts[key] || 0) + 1;
    
    // Also store song info for the about page
    const songInfo = JSON.parse(localStorage.getItem("songPlayInfo")) || {};
    songInfo[key] = {
        title: song.title,
        artist: song.artist,
        image: song.image,
        count: playCounts[key]
    };
    
    localStorage.setItem("playCounts", JSON.stringify(playCounts));
    localStorage.setItem("songPlayInfo", JSON.stringify(songInfo));
}

// Toggle play/pause icon
function updatePlayPauseIcon() {
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    if (!currentAudio || currentAudio.paused) {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    } else {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
    }
}

// Play a song
function playSong(index) {
    if (currentAudio) {
        currentAudio.pause();
    }
    
    const song = songData[index];
    if (!song || !song.previewUrl) {
        alert("Preview not available for this song");
        return;
    }
    
    currentIndex = index;
    currentAudio = new Audio(song.previewUrl);
    currentAudio.play();
    incrementPlayCount(index);
    bindProgressBar();
    updatePlayingIndicator();
    updatePlayPauseIcon();
    updateNowPlaying();
    
    currentAudio.addEventListener("ended", () => {
        updatePlayPauseIcon();
        // Auto-play next song
        if (currentIndex < songData.length - 1) {
            playSong(currentIndex + 1);
        }
    });
}

// Update now playing display
function updateNowPlaying() {
    const song = songData[currentIndex];
    if (song) {
        const nowPlaying = document.getElementById("now-playing");
        if (nowPlaying) {
            nowPlaying.innerHTML = `
                <img src="${song.image}" alt="${song.title}">
                <div class="now-playing-info">
                    <span class="now-playing-title">${song.title}</span>
                    <span class="now-playing-artist">${song.artist}</span>
                </div>
            `;
        }
    }
}

// Play/Pause button
document.querySelector("#play-pause-btn").addEventListener("click", () => {
    if (!currentAudio) {
        if (songData.length > 0) {
            playSong(0);
        }
        return;
    }
    
    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
    updatePlayPauseIcon();
});

// Next button
document.querySelector("#next-btn").addEventListener("click", () => {
    if (songData.length === 0) return;
    const nextIndex = (currentIndex + 1) % songData.length;
    playSong(nextIndex);
});

// Previous button
document.querySelector("#prev-btn").addEventListener("click", () => {
    if (songData.length === 0) return;
    const prevIndex = (currentIndex - 1 + songData.length) % songData.length;
    playSong(prevIndex);
});

// Update playing indicator
function updatePlayingIndicator() {
    document.querySelectorAll(".song-item").forEach((item, index) => {
        item.classList.remove("playing");
        if (index === currentIndex) {
            item.classList.add("playing");
        }
    });
}

// Show song details modal
function showSongDetails(index) {
    const song = songData[index];
    if (!song) return;
    
    const modal = document.getElementById("song-modal");
    
    document.getElementById("modal-img").src = song.image;
    document.getElementById("modal-title").textContent = song.title;
    document.getElementById("modal-artist").textContent = song.artist;
    document.getElementById("modal-album").textContent = `Album: ${song.album}`;
    document.getElementById("modal-year").textContent = `Year: ${song.year}`;
    document.getElementById("modal-duration").textContent = `Duration: ${song.duration}`;
    
    modal.classList.add("show");
}

// Close modal
document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("song-modal").classList.remove("show");
});

// Close modal on outside click
document.getElementById("song-modal").addEventListener("click", (e) => {
    if (e.target.id === "song-modal") {
        document.getElementById("song-modal").classList.remove("show");
    }
});

// Play from modal
document.getElementById("modal-play-btn").addEventListener("click", () => {
    const modal = document.getElementById("song-modal");
    playSong(currentIndex);
    modal.classList.remove("show");
});

// Progress bar
const progressBar = document.querySelector("#progress-bar");

function bindProgressBar() {
    if (!currentAudio) return;
    
    currentAudio.addEventListener("timeupdate", () => {
        if (currentAudio.duration) {
            progressBar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
        }
    });
}

// Seek when user drags progress bar
progressBar.addEventListener("input", () => {
    if (currentAudio && currentAudio.duration) {
        currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
    }
});

// Search functionality
document.getElementById("search-btn").addEventListener("click", () => {
    const searchTerm = document.getElementById("search-input").value.trim();
    if (searchTerm) {
        fetchSongs(searchTerm);
    }
});

// Search on Enter key
document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const searchTerm = document.getElementById("search-input").value.trim();
        if (searchTerm) {
            fetchSongs(searchTerm);
        }
    }
});

// Load initial songs
fetchSongs("top hits 2024");






