// Authentication handler
(function() {
    const user = JSON.parse(localStorage.getItem("beatboxxUser"));
    const userSection = document.getElementById("user-section");
    const loginSection = document.getElementById("login-section");
    const usernameDisplay = document.getElementById("username-display");
    const logoutBtn = document.getElementById("logout-btn");

    // Determine if we're in pages folder or root
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const loginPath = isInPagesFolder ? "login.html" : "pages/login.html";

    if (user) {
        // User is logged in
        if (userSection) userSection.style.display = "flex";
        if (loginSection) loginSection.style.display = "none";
        if (usernameDisplay) usernameDisplay.textContent = user.username;
    } else {
        // User is not logged in
        if (userSection) userSection.style.display = "none";
        if (loginSection) loginSection.style.display = "flex";
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("beatboxxUser");
            window.location.href = loginPath;
        });
    }
})();
