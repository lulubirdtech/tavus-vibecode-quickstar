import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, AuthState } from '../types/auth';

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  subscription: string;
  checkSubscription: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  });
  const [subscription, setSubscription] = useState<string>('free');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadUserProfile(session.user.id);
        setAuthState({
          user: session.user,
          isLoading: false,
          isAuthenticated: true,
        });
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
          setUser(session.user);
          await loadUserProfile(session.user.id);
          setAuthState({
            user: session.user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setUser(null);
          setProfile(null);
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create user profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: user?.email || '',
            name: user?.user_metadata?.name || 'User',
            role: 'patient'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        await loadUserProfile(data.user.id);
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
        checkSubscription();
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    setSubscription('free');
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