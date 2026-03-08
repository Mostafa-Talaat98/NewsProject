// userSession.js
// Handles displaying the user profile in the navigation bar if logged in

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Find the auth buttons container in the navbar
    const authContainer = document.querySelector('.navbar .d-flex.ms-lg-4');

    if (currentUser && authContainer) {
        // User is logged in, replace buttons with profile picture and dropdown
        const userImg = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=random`;

        authContainer.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 0;">
                    <img src="${userImg}" alt="Profile" class="rounded-circle shadow-sm" width="40" height="40" style="object-fit: cover; border: 2px solid white;">
                    <span class="ms-2 text-white fw-medium d-none d-lg-block">${currentUser.fullName.split(' ')[0]}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                    <li><h6 class="dropdown-header text-dark fw-bold">${currentUser.fullName}</h6></li>
                    <li><small class="dropdown-item-text text-muted mb-2">${currentUser.email}</small></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger fw-medium" href="#" id="logout-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        Logout
                    </a></li>
                </ul>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.reload(); // Reload page to show login/register buttons again
        });
    }
});
