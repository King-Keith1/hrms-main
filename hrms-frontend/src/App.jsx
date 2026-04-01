import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import { isLoggedIn, getRole } from './utils/auth';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';

// Protected route - redirects to login if not authenticated
function ProtectedRoute({ children, allowedRoles }) {
    if (!isLoggedIn()) return <Navigate to="/login" />;

    const role = getRole();
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Placeholder routes - we'll fill these in next */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_EMPLOYEE']}>
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}