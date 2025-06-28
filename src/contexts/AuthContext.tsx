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
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as User);
        setProfile(session.user as User);
        setAuthState({
          user: session.user as User,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as User);
          setProfile(session.user as User);
          setAuthState({
            user: session.user as User,
            isLoading: false,
            isAuthenticated: true,
          });
          checkSubscription();
        } else {
          setUser(null);
          setProfile(null);
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          setSubscription('free');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.session?.user) {
        setUser(data.user as User);
        setProfile(data.user as User);
        setAuthState({
          user: data.user as User,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user as User);
        setProfile(data.user as User);
        setAuthState({
          user: data.user as User,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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