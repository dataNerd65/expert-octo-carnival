// Function to display/hide password
function showPassword() {
    var password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

// Function to redirect to signup page
function redirectToSignUp() {
    window.location.href = 'signup.html';
}

// Function to redirect to login page
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Function to display success message
function displaySuccessMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; // Clear any existing error messages
    errorMessage.classList.remove('error'); // Remove error class
    errorMessage.classList.add('success'); // Add success class
    errorMessage.textContent = message;
}

// Function to display error message
function displayErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('success'); // Remove success class
    errorMessage.classList.add('error'); // Add error class
}

// Function to handle signup form submission
function signUpUser() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Client-side form validation
    if (!fullname || !email || !username || !password || !confirmPassword) {
        displayErrorMessage("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        displayErrorMessage("Passwords do not match!");
        return;
    }

    // Send a POST request to the server with user data
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname: fullname,
            email: email,
            username: username,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('User signed up successfully');
            displaySuccessMessage("Signup successful!");
            window.location.href = 'login.html'; // Redirect to the login page
        } else {
            console.log('Failed to sign up user');
            displayErrorMessage("Failed to sign up user. Please try again later.");
        }
    })
    .catch(error => {
        console.error('Error signing up user: ', error.message);
        displayErrorMessage("An error occurred. Please try again later.");
    });
}

// Function to handle login form submission
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //Send a POST request to the server with user credentials
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (response.ok){
            console.log('User logged in successfully!');
            displaySuccessMessage("Login successful! Redirecting to dashboard...");
            //Redirect user to homepage
            window.location.href = 'dashboard.html';
        } else {
            console.log('Failed to log in user!');
            displayErrorMessage("Invalid username or password. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error logging in user: ', error.message);
        displayErrorMessage("An error occurred. Please try again later");
    });
}

// Now declare other variables and set up event listeners
document.addEventListener('DOMContentLoaded', function(){
    const signUpForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const signUpLink = document.getElementById('sign-up');

    if (signUpForm) { // Check if the signup form element exists
        // Event listener for signup form submission
        signUpForm.addEventListener("submit", function(event){
            event.preventDefault(); // Prevent form submission

            // Call the signUpUser function when the signup form is submitted
            signUpUser();
        });
    } else {
        console.error("Element with ID 'signup-form' not found.");
    }

    if (loginForm) { // Check if the login form element exists
        // Event listener for login form submission
        loginForm.addEventListener("submit", function(event){
            event.preventDefault(); // Prevent form submission

            // Call the loginUser function when the login form is submitted
            loginUser();
        });
    } else {
        console.error("Element with ID 'login-form' not found.");
    }

    if (forgotPasswordLink) { // Check if the forgot password link element exists
        // Event listener for "Forgot Password?" link
        forgotPasswordLink.addEventListener("click", function(event){
            event.preventDefault();
            displayErrorMessage("This feature is not available yet!");
        });
    } else {
        console.error("Element with ID 'forgot-password' not found.");
    }

    if (signUpLink) { // Check if the sign up link element exists
        // Event listener for "Sign Up" link
        signUpLink.addEventListener("click", function(event){
            event.preventDefault();
            window.location.href = './signup.html'; // Redirect to the signup page
        });
    } else {
        console.error("Element with ID 'sign-up' not found.");
    }
});
loginUser()
signUpUser()