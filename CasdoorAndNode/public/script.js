document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loggedInView = document.getElementById('logged-in-view');
    const loggedOutView = document.getElementById('logged-out-view');
    const userNameSpan = document.getElementById('userName');
    const userEmailSpan = document.getElementById('userEmail');
    const userDisplayNameSpan = document.getElementById('userDisplayName');
    const userPictureImg = document.getElementById('userPicture');

    const getProtectedDataBtn = document.getElementById('getProtectedDataBtn');
    const protectedDataMessage = document.getElementById('protectedDataMessage');

    const newDisplayNameInput = document.getElementById('newDisplayNameInput');
    const updateProfileBtn = document.getElementById('updateProfileBtn');    
    const updateProfileMessage = document.getElementById('updateProfileMessage');

    // Function to update UI based on login status
    async function updateUI() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();

            if (data.isAuthenticated) {
                userNameSpan.textContent = data.user.name;
                userEmailSpan.textContent = data.user.email;
                userDisplayNameSpan.textContent = data.user.displayName || 'Not set';
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
            // Clear any previous update messages when UI refreshes
            updateProfileMessage.textContent = '';
            protectedDataMessage.textContent = '';
        } catch (error) {
            console.error('Error fetching user status:', error);
            loggedInView.style.display = 'none';
            loggedOutView.style.display = 'block';
        }
    }

    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }

    // Event Listener for Update Profile Button
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', async () => {
            const newDisplayName = newDisplayNameInput.value.trim();
            if (!newDisplayName) {
                updateProfileMessage.textContent = 'Please enter a new display name.';
                updateProfileMessage.style.color = 'red';
                return;
            }

            updateProfileMessage.textContent = 'Updating profile...';
            updateProfileMessage.style.color = 'black';

            try {
                const response = await fetch('/api/update-profile', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ newDisplayName: newDisplayName })
                });
                const data = await response.json();

                if (response.ok) {
                    updateProfileMessage.textContent = data.message;
                    updateProfileMessage.style.color = 'green';
                    newDisplayNameInput.value = ''; 
                    updateUI(); 
                } else {
                    updateProfileMessage.textContent = `Error: ${data.message || 'Failed to update profile.'}`;
                    updateProfileMessage.style.color = 'red';
                }
            } catch (error) {
                updateProfileMessage.textContent = 'Network error or backend issue during update.';
                updateProfileMessage.style.color = 'red';
                console.error('Fetch error for update profile:', error);
            }
        });
    }

    // Initial UI update on page load
    updateUI();
});