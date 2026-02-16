import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const RoleRoute = ({ allowedRoles }) => {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <Spinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Check if user's role is in the allowed roles array
    if (!allowedRoles.includes(user.role)) {
        // Redirect to dashboard if user doesn't have required role
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default RoleRoute;
