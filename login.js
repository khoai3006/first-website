document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginSection = document.getElementById('loginSection');
    const signUpSection = document.getElementById('signUpSection');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignUpBtn = document.getElementById('showSignUp');
    const showLoginBtn = document.getElementById('showLogin');

    // Toggle between forms with slide effect
    showSignUpBtn.addEventListener('click', () => {
        loginSection.classList.add("slide-out");
        signUpSection.classList.add("slide-in");
    });

    showLoginBtn.addEventListener('click', () => {
        loginSection.classList.remove("slide-out");
        signUpSection.classList.remove("slide-in");
    });

    // Signup Form Handler
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            alert('Email already registered!');
            return;
        }

        // Save new user
        users.push({ email, phone, password });
        localStorage.setItem('users', JSON.stringify(users));

        // Clear form
        signupForm.reset();

        // Show success message
        alert('Registration successful! Please login.');

        // Slide back to login
        loginSection.classList.remove("slide-out");
        signUpSection.classList.remove("slide-in");
    });

    // Login Form Handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Check credentials
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Login successful
            alert('Login successful!');
            window.location.href = '/home.html'; // Redirect to dashboard
        } else {
            alert('Invalid email or password');
        }
    });

    // After successful signup, slide back to login
    function showLoginAfterSignup() {
        loginSection.style.transform = 'translateX(0)';
        signUpSection.style.transform = 'translateX(100%)';
    }
});
