import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { ApiService } from '../services/apiService';

interface AuthContextType {
  user: any | null;
  profile: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  subscription: string;
  checkSubscription: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [subscription, setSubscription] = useState<string>('free');

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const userData = await ApiService.validateToken(token);
      if (userData) {
        setUser(userData);
        setProfile(userData);
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await ApiService.login(email, password);
      
      if (response.session?.access_token && response.user) {
        localStorage.setItem('token', response.session.access_token);
        setUser(response.user);
        setProfile(response.user);
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await ApiService.register(email, password, name);
      
      if (response.session?.access_token && response.user) {
        localStorage.setItem('token', response.session.access_token);
        setUser(response.user);
        setProfile(response.user);
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setProfile(null);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      setSubscription('free');
    }
  };

  const checkSubscription = async (): Promise<string> => {
    try {
      // Simulate subscription check
      const userSubscription = 'free'; // Default to free
      setSubscription(userSubscription);
      return userSubscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return 'free';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading: authState.isLoading,
        login,
        signup,
        logout,
        isAuthenticated: authState.isAuthenticated,
        subscription,
        checkSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};