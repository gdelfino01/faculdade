import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    createdAt?: string;
    lastLogin?: string;
}

export const useAuthProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUserData = () => {
        setIsLoading(true);
        
        // TENTAR CARREGAR DO LOCALSTORAGE PRIMEIRO
        const userString = localStorage.getItem("user");
        if (userString) {
            try {
                const userData = JSON.parse(userString);
                setUser({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    avatar: userData.avatar || '',
                    createdAt: userData.createdAt || '2024-01-15T10:30:00Z',
                    lastLogin: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Erro ao parsear dados do usuário:', error);
                // DADOS SIMULADOS COMO FALLBACK
                setUser({
                    id: 1,
                    name: 'Usuário Sistema',
                    email: 'usuario@odous.com',
                    role: 'admin',
                    avatar: '',
                    createdAt: '2024-01-15T10:30:00Z',
                    lastLogin: new Date().toISOString(),
                });
            }
        } else {
            // DADOS SIMULADOS SE NÃO HOUVER NO LOCALSTORAGE
            setUser({
                id: 1,
                name: 'Usuário Sistema',
                email: 'usuario@odous.com',
                role: 'admin',
                avatar: '',
                createdAt: '2024-01-15T10:30:00Z',
                lastLogin: new Date().toISOString(),
            });
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        loadUserData();
    }, []);

    // FUNÇÃO PARA RECARREGAR DADOS DO USUÁRIO APÓS ATUALIZAÇÃO
    const refreshUser = () => {
        loadUserData();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    };

    return {
        user,
        isLoading,
        logout,
        refreshUser // NOVA FUNÇÃO PARA RECARREGAR DADOS
    };
};