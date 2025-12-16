// Signup Page Script

// Check if already logged in
if (localStorage.getItem("beatboxxUser")) {
    window.location.href = "../index.html";
}

document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    
    errorMessage.textContent = "";
    successMessage.textContent = "";
    
    // Validation
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match";
        return;
    }
    
    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters";
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem("beatboxxUsers")) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        errorMessage.textContent = "Email already registered";
        return;
    }
    
    if (users.find(u => u.username === username)) {
        errorMessage.textContent = "Username already taken";
        return;
    }
    
    // Add new user
    users.push({ email, username, password });
    localStorage.setItem("beatboxxUsers", JSON.stringify(users));
    
    successMessage.textContent = "Account created! Redirecting to login...";
    
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});
