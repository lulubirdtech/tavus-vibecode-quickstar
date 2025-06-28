import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [subscription, setSubscription] = useState<string>('free');

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfile(userData);
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simple validation - accept any email/password combination
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create a simple user object
      const userData: User = {
        id: `user_${Date.now()}`,
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        role: 'patient',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));

      setUser(userData);
      setProfile(userData);
      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
      });
      
      await checkSubscription();
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simple validation
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create a simple user object
      const userData: User = {
        id: `user_${Date.now()}`,
        email: email,
        name: name,
        role: 'patient',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData));

      setUser(userData);
      setProfile(userData);
      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
      });
      
      await checkSubscription();
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
      // Simple subscription check - default to free
      const userSubscription = 'free';
      setSubscription(userSubscription);
      return userSubscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription('free');
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