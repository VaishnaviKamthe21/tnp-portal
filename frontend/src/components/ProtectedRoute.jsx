import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const user = getCurrentUser();

    if (!isAuth) {
        // Redirect to login but save the location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Role not allowed - redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
