import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Heart, UserPlus, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { supabase } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isSignUp && !name) {
      toast.error('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          toast.success('Account created successfully! Please check your email to verify your account.');
          setIsSignUp(false);
        }
      } else {
        await login(email, password);
        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      console.error(isSignUp ? 'Sign up failed:' : 'Login failed:', error);
      toast.error(error.message || (isSignUp ? 'Sign up failed. Please try again.' : 'Login failed. Please check your credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary to-medical-secondary">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-medical">
              <Heart className="h-8 w-8 text-medical-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to HealthCare AI</h1>
            <p className="text-white/80">
              {isSignUp ? 'Create your account to get started' : 'Sign in to access your health dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors backdrop-blur-sm text-white placeholder:text-white/60"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors backdrop-blur-sm text-white placeholder:text-white/60"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-colors backdrop-blur-sm text-white placeholder:text-white/60"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-white text-medical-primary py-3 px-4 rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  {isSignUp ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                Demo credentials: Use any email and password
              </p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:text-white/80 font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;