// Login Page Script

// Check if already logged in
if (localStorage.getItem("beatboxxUser")) {
    window.location.href = "../index.html";
}

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("beatboxxUsers")) || [];
    
    // Find user
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);
    
    if (user) {
        // Save logged in user
        localStorage.setItem("beatboxxUser", JSON.stringify({
            username: user.username,
            email: user.email
        }));
        window.location.href = "../index.html";
    } else {
        errorMessage.textContent = "Invalid email/username or password";
    }
});
