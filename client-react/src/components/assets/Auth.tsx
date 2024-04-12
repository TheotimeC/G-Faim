import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import api from './api';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string;
    login: (tokens: { accessToken: string; refreshToken: string, role: string }) => void;
    logout: () => void;
    refreshToken: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  role: '',
  login: () => {},
  logout: () => {},
  refreshToken: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('accessToken');
    return !!token; // Convertit la présence du token en booléen
  });
  const [role, setRole] = useState<string>(() => localStorage.getItem('role') || '');

  const login = ({ accessToken, refreshToken, role }: { accessToken: string; refreshToken: string; role: string }) => {
    localStorage.setItem('accessToken', accessToken); // Stocke l'access token dans localStorage
    localStorage.setItem('refreshToken', refreshToken); // Stocke le refresh token dans localStorage
    localStorage.setItem('role', role); // Stocke le rôle dans localStorage
    setIsAuthenticated(true); // Met à jour l'état d'authentification
    setRole(role); // Met à jour l'état du rôle
};

  const logout = () => {
    localStorage.removeItem('accessToken'); // Supprime l'access token de localStorage
    localStorage.removeItem('refreshToken'); // Supprime le refresh token de localStorage
    localStorage.removeItem('userCache');
    setIsAuthenticated(false); // Met à jour l'état d'authentification
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      // Appel à une route sur le serveur pour rafraîchir le token
      const response = await api.post('http://localhost:3000/auth/refresh', { refreshToken });
      const { accessToken, newRefreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken); // Stocke le nouveau access token dans localStorage
      localStorage.setItem('refreshToken', newRefreshToken); // Met à jour le refresh token dans localStorage
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Assurez-vous d'avoir une route/endpoint pour valider le token ou tentez un refresh
        await refreshToken(); // Ceci mettra à jour les tokens si le refreshToken est valide
      } catch (error) {
        logout(); // Logout si la validation ou le rafraîchissement échoue
      }
    };
    // Exécuter la validation seulement si isAuthenticated est false mais refreshToken existe
    if (!isAuthenticated && localStorage.getItem('refreshToken')) {
      validateToken();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleLogoutEvent = () => {
      setIsAuthenticated(false);
      // Effectuez également ici d'autres opérations de nettoyage, si nécessaire
    };

    window.addEventListener('logout-event', handleLogoutEvent);

    return () => {
      window.removeEventListener('logout-event', handleLogoutEvent);
    };
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshToken, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log('useAuth must be used within an AuthProvider');
  }
  return context;
};
