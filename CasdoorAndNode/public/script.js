// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loggedInView = document.getElementById('logged-in-view');
    const loggedOutView = document.getElementById('logged-out-view');
    const userNameSpan = document.getElementById('userName');
    const userEmailSpan = document.getElementById('userEmail');
    const userPictureImg = document.getElementById('userPicture');

    // Function to update UI based on login status
    async function updateUI() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();

            if (data.isAuthenticated) {
                userNameSpan.textContent = data.user.name;
                userEmailSpan.textContent = data.user.email;
                if (data.user.picture) {
                    userPictureImg.src = data.user.picture;
                    userPictureImg.style.display = 'block';
                } else {
                    userPictureImg.style.display = 'none';
                }
                loggedInView.style.display = 'block';
                loggedOutView.style.display = 'none';
            } else {
                loggedInView.style.display = 'none';
                loggedOutView.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
            // Fallback to logged out view in case of API error
            loggedInView.style.display = 'none';
            loggedOutView.style.display = 'block';
        }
    }

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/login'; // Redirect to backend's login endpoint
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/logout'; // Redirect to backend's logout endpoint
        });
    }

    // Initial UI update on page load
    updateUI();
});