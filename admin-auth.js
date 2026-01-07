const AdminAuth = {
    isAdminAuthenticated: false,
    adminSessionToken: null,
    sessionTimeout: 30 * 60 * 1000,
    sessionTimer: null,

    initialize: function() {
        const savedToken = sessionStorage.getItem('admin_session_token');
        const savedTokenTime = sessionStorage.getItem('admin_token_time');
        
        if (savedToken && savedTokenTime) {
            const tokenAge = Date.now() - parseInt(savedTokenTime);
            if (tokenAge < this.sessionTimeout) {
                this.isAdminAuthenticated = true;
                this.adminSessionToken = savedToken;
                this.startSessionTimer();
            } else {
                this.logout();
            }
        }
    },

    login: async function(password) {
        try {
            const response = await fetch('/api/admin/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                const data = await response.json();
                this.adminSessionToken = data.token;
                this.isAdminAuthenticated = true;
                sessionStorage.setItem('admin_session_token', this.adminSessionToken);
                sessionStorage.setItem('admin_token_time', Date.now().toString());
                this.startSessionTimer();
                return { success: true, message: 'Admin authenticated' };
            }
            return { success: false, message: 'Invalid credentials. Contact administrator.' };
        } catch (error) {
            console.error('Admin auth error:', error);
            return { success: false, message: 'Authentication service unavailable' };
        }
    },

    logout: function() {
        this.isAdminAuthenticated = false;
        this.adminSessionToken = null;
        sessionStorage.removeItem('admin_session_token');
        sessionStorage.removeItem('admin_token_time');
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
    },

    startSessionTimer: function() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        this.sessionTimer = setTimeout(() => {
            this.logout();
            showNotification('Admin session expired', 'info');
        }, this.sessionTimeout);
    },

    isAuthenticated: function() {
        return this.isAdminAuthenticated && this.adminSessionToken !== null;
    },

    changePassword: async function(newPassword) {
        if (newPassword.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }
        try {
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminSessionToken}`
                },
                body: JSON.stringify({ newPassword })
            });

            if (response.ok) {
                return { success: true, message: 'Password updated successfully. Please log in again.' };
            }
            return { success: false, message: 'Failed to update password' };
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Service unavailable' };
        }
    }
};

AdminAuth.initialize();
