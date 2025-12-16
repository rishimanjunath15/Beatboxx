// About Page Script

function loadStats() {
    const statsList = document.getElementById("stats-list");
    
    // Get song play info from localStorage (stored by app.js)
    const songPlayInfo = JSON.parse(localStorage.getItem("songPlayInfo")) || {};
    
    // Convert to array and sort by play count
    const songsWithCounts = Object.values(songPlayInfo).sort((a, b) => b.count - a.count);
    
    // Check if any songs have been played
    if (songsWithCounts.length === 0) {
        statsList.innerHTML = '<p class="no-stats">No songs played yet. Go listen to some music! 🎵</p>';
        return;
    }
    
    // Render stats
    statsList.innerHTML = songsWithCounts.map((song, rank) => `
        <div class="stat-item ${rank === 0 ? 'top-song' : ''}">
            <span class="rank">${rank + 1}</span>
            <img src="${song.image}" alt="${song.title}">
            <div class="stat-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <div class="play-count">
                <span class="count">${song.count}</span>
                <span class="label">plays</span>
            </div>
        </div>
    `).join('');
}

document.getElementById("clear-stats").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all statistics?")) {
        localStorage.removeItem("playCounts");
        localStorage.removeItem("songPlayInfo");
        loadStats();
    }
});

// Load stats on page load
loadStats();
