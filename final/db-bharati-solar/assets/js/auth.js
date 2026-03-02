/**
 * DB Bharati Solar - Admin Auth Management
 */
const AUTH = {
    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return localStorage.getItem('db_solar_admin_session') === 'active';
    },

    /**
     * Login with password
     */
    login(password) {
        if (password === window.CONFIG.ADMIN_PASS) {
            localStorage.setItem('db_solar_admin_session', 'active');
            return true;
        }
        return false;
    },

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('db_solar_admin_session');
        window.location.href = 'admin-login.html';
    },

    /**
     * Route guard for admin pages
     */
    protectRoute() {
        if (!this.isLoggedIn()) {
            window.location.href = 'admin-login.html';
        }
    }
};

window.AUTH = AUTH;
