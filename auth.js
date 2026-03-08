// auth.js
// Handles authentication logic for login and register pages

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Firebase configuration from user
const firebaseConfig = {
    apiKey: "AIzaSyCh7AivnrhiHGA29KXPIvIjD-GpJ-vs7xg",
    authDomain: "news-44e46.firebaseapp.com",
    projectId: "news-44e46",
    storageBucket: "news-44e46.firebasestorage.app",
    messagingSenderId: "928535427648",
    appId: "1:928535427648:web:dd81fd63dfe22f364b3da5",
    measurementId: "G-VEZXY71F9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {

    // Helper function to show alerts
    function showAlert(message, type = 'danger') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.auth-alert');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show auth-alert mt-3`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Insert alert before the form
        const form = document.querySelector('form');
        form.parentNode.insertBefore(alertDiv, form);
    }

    // --- Registration Logic ---
    const registerForm = document.querySelector('form');
    // Check if we are on the register page specifically by looking for the fullName field
    const isRegisterPage = document.getElementById('fullName') !== null;

    if (isRegisterPage && registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Basic validation
            if (password !== confirmPassword) {
                showAlert('Passwords do not match!');
                return;
            }

            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long.');
                return;
            }

            // Get existing users from localStorage or initialize empty array
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user already exists
            const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

            if (userExists) {
                showAlert('An account with this email already exists. Please sign in instead.');
                return;
            }

            // Create new user object
            const newUser = {
                id: Date.now(),
                fullName,
                email,
                password // Note: In a real app, never store plain text passwords!
            };

            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Optionally store the current logged-in user session
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            showAlert('Registration successful! Redirecting...', 'success');

            // Redirect to home after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // --- Login Logic ---
    if (!isRegisterPage && registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Get existing users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Find user by email
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                showAlert('No account found with this email. Please register first.', 'warning');
                return;
            }

            if (user.password !== password) {
                showAlert('Incorrect password. Please try again.', 'danger');
                return;
            }

            // Login successful
            localStorage.setItem('currentUser', JSON.stringify(user));
            showAlert(`Welcome back, ${user.fullName}! Redirecting...`, 'success');

            // Redirect to home after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // --- Google Button Redirect (Firebase Auth) ---
    const googleBtns = document.querySelectorAll('.google-btn');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();

            try {
                // Trigger Firebase Google Sign In
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Save user info to localStorage to simulate the session
                const loggedInUser = {
                    id: user.uid,
                    fullName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    isGoogleAuth: true
                };
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));

                showAlert(`Successfully signed in as ${user.displayName}! Redirecting...`, 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);

            } catch (error) {
                console.error("Firebase Authentication Error", error);

                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;

                showAlert(`Sign in failed: ${errorMessage}`);
            }
        });
    });
});
