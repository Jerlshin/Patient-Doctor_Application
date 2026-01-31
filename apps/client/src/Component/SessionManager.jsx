import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SessionManager() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const publicPaths = ['/', '/login', '/register', '/bmi']; // Paths accessible without login

        if (token && user.role) {
            // If logged in and on a public path (like login), redirect to dashboard
            if (publicPaths.includes(location.pathname)) {
                if (user.role === 'doctor') {
                    navigate('/doctor-dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        }
    }, [navigate, location]);

    return null;
}
