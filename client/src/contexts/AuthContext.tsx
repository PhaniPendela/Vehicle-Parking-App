
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/utils/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Try real API call first
      try {
        const response = await apiService.login({ email, password });
        
        setUser(response.user);
        setToken(response.token);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return true;
      } catch (apiError) {
        console.warn('Backend API not available, using mock authentication');
        
        // Fallback to mock authentication
        let mockUser: User;
        let mockToken: string;
        
        if (email === 'admin@test.com' && password === 'admin123') {
          mockUser = {
            id: 'admin-1',
            email: 'admin@test.com',
            fullName: 'Admin User',
            role: 'admin'
          };
          mockToken = 'mock-admin-token-123';
        } else if (email === 'user@test.com' && password === 'user123') {
          mockUser = {
            id: 'user-1',
            email: 'user@test.com',
            fullName: 'John Doe',
            role: 'user'
          };
          mockToken = 'mock-user-token-123';
        } else {
          throw new Error('Invalid credentials');
        }
        
        setUser(mockUser);
        setToken(mockToken);
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
