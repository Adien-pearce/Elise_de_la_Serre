/**
 * Melo Login & Onboarding Service
 */

const LoginPage = {
    /**
     * Handle logout/exit
     */
    logout: function() {
        localStorage.removeItem('melo_logged_in');
        window.location.href = 'login.html';
    }
};

// Export to window object
window.LoginPage = LoginPage;
