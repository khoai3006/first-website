document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginSection = document.getElementById('loginSection');
    const signUpSection = document.getElementById('signUpSection');
    const loginForm = document.getElementById('loginForm');
    const showSignUpBtn = document.getElementById('showSignUp');
    const showLoginBtn = document.getElementById('showLogin');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginButton = document.querySelector('.login-form button[type="submit"]');

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time email validation
    loginEmail.addEventListener('input', function() {
        if (!isValidEmail(this.value)) {
            this.classList.remove('valid');
            this.classList.add('error');
            loginButton.disabled = true;
        } else {
            this.classList.remove('error');
            this.classList.add('valid');
            loginButton.disabled = false;
        }
    });

    // Handle "Remember Me"
    const rememberMeCheck = document.getElementById('rememberMeCheck');
    
    if (localStorage.getItem('rememberedEmail')) {
        loginEmail.value = localStorage.getItem('rememberedEmail');
        rememberMeCheck.checked = true;
    }

    // Form submission handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const button = this.querySelector('button[type="submit"]');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        button.disabled = true;

        // Handle "Remember Me" on submit
        if (rememberMeCheck.checked) {
            localStorage.setItem('rememberedEmail', loginEmail.value);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail.value,
                    password: loginPassword.value
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard';
            }
            
        } catch (error) {
            console.error('Login error:', error);
            displayErrorMessage('Invalid email or password');
        }
    });

    // Error message display
    function displayErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = loginForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        loginForm.appendChild(errorDiv);
        loginForm.classList.add('shake');
        setTimeout(() => loginForm.classList.remove('shake'), 500);
        
        const button = loginForm.querySelector('button[type="submit"]');
        button.innerHTML = 'Login';
        button.disabled = false;
    }

    // Password visibility toggle
    const togglePassword = document.createElement('button');
    togglePassword.type = 'button';
    togglePassword.innerHTML = '<i class="far fa-eye"></i>';
    togglePassword.className = 'toggle-password';
    loginPassword.parentElement.appendChild(togglePassword);

    togglePassword.addEventListener('click', function() {
        const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPassword.setAttribute('type', type);
        this.innerHTML = type === 'password' ? 
            '<i class="far fa-eye"></i>' : 
            '<i class="far fa-eye-slash"></i>';
    });

    // Auto-hide password after inactivity
    let passwordTimeout;
    loginPassword.addEventListener('input', function() {
        clearTimeout(passwordTimeout);
        if (this.type === 'text') {
            passwordTimeout = setTimeout(() => {
                this.type = 'password';
                togglePassword.innerHTML = '<i class="far fa-eye"></i>';
            }, 15000);
        }
    });

    // Toggle between login and signup forms
    showSignUpBtn.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signUpSection.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', () => {
        loginSection.style.display = 'block';
        signUpSection.style.display = 'none';
    });

    const signupPassword = document.getElementById('signupPassword');
    const strengthMeter = document.querySelector('.password-strength-meter');
    const strengthText = strengthMeter.querySelector('.strength-text span');

    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Uppercase check
        if (password.match(/[A-Z]/)) strength++;
        
        // Lowercase check
        if (password.match(/[a-z]/)) strength++;
        
        // Number check
        if (password.match(/[0-9]/)) strength++;
        
        // Special character check
        if (password.match(/[^A-Za-z0-9]/)) strength++;

        return strength;
    }

    function updatePasswordStrength(strength) {
        const strengthStates = [
            { class: 'strength-none', text: 'None' },
            { class: 'strength-weak', text: 'Weak' },
            { class: 'strength-fair', text: 'Fair' },
            { class: 'strength-good', text: 'Good' },
            { class: 'strength-strong', text: 'Strong' }
        ];

        // Remove all strength classes
        strengthStates.forEach(state => {
            strengthMeter.classList.remove(state.class);
        });

        // Add current strength class
        strengthMeter.classList.add(strengthStates[strength].class);
        strengthText.textContent = strengthStates[strength].text;
    }

    signupPassword.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updatePasswordStrength(strength);
    });
});
