// Save token and role after login
export const saveAuth = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
};

// Get role from token payload
export const getRole = () => localStorage.getItem('role');

// Check if user is logged in
export const isLoggedIn = () => !!localStorage.getItem('token');

// Logout
export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
};

// Decode JWT payload without a library
export const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};