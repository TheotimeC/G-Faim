import React, { createContext, useState, ReactNode, useContext } from 'react';
import api from '../common/Api';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (tokens: { accessToken: string; refreshToken: string }) => void; // Mettre à jour la signature
    logout: () => void;
    refreshToken: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refreshToken: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (tokens: { accessToken: string; refreshToken: string }) => {
    const { accessToken, refreshToken } = tokens;
    localStorage.setItem('accessToken', accessToken); // Stocke l'access token dans localStorage
    localStorage.setItem('refreshToken', refreshToken); // Stocke le refresh token dans localStorage
    setIsAuthenticated(true); // Met à jour l'état d'authentification
  };

  const logout = () => {
    localStorage.removeItem('accessToken'); // Supprime l'access token de localStorage
    localStorage.removeItem('refreshToken'); // Supprime le refresh token de localStorage
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshToken }}>
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
