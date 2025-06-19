import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserResponseDTO } from '../../services/apis/odous-api/users/dtos';

interface ProtectedRouteProps {
    allowedRoles: Array<UserResponseDTO['role']>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const userString = localStorage.getItem('user');
    let user: UserResponseDTO | null = null;

    if (userString) {
        try {
            user = JSON.parse(userString) as UserResponseDTO;
        } catch (error) {
            console.error("Falha ao parsear usuário do localStorage:", error);
            localStorage.removeItem('user');
        }
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles || allowedRoles.length === 0 || !allowedRoles.includes(user.role)) {
        return <Navigate to="/nao-autorizado" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
