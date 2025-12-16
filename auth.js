// Authentication handler
(function() {
    const user = JSON.parse(localStorage.getItem("beatboxxUser"));
    const userSection = document.getElementById("user-section");
    const loginSection = document.getElementById("login-section");
    const usernameDisplay = document.getElementById("username-display");
    const logoutBtn = document.getElementById("logout-btn");

    if (user) {
        // User is logged in
        userSection.style.display = "flex";
        loginSection.style.display = "none";
        usernameDisplay.textContent = user.username;
    } else {
        // User is not logged in
        userSection.style.display = "none";
        loginSection.style.display = "flex";
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("beatboxxUser");
            window.location.href = "login.html";
        });
    }
})();
