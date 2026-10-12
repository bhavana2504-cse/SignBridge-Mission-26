import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { storageService } from '../services/storageService';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  clearError: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // 1. Get initial active session
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.warn('[SignBridge Auth] Session restoration notice:', sessionError.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        storageService.syncWithSupabase(session.user);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_IN' && newSession?.user) {
        await storageService.syncWithSupabase(newSession.user);
      } else if (event === 'SIGNED_OUT') {
        // Retain local progress cache for seamless experience
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up with Email and Password
  const signUp = async (email, password, fullName = '') => {
    clearError();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Check environment variables.');
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      throw signUpError;
    }

    if (data?.user) {
      // Sync initial profile
      storageService.updateUserProfile({
        name: fullName || email.split('@')[0]
      });
      if (data.session) {
        await storageService.syncWithSupabase(data.user);
      }
    }

    return data;
  };

  // Sign in with Email and Password
  const signIn = async (email, password) => {
    clearError();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Check environment variables.');
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
      throw signInError;
    }

    if (data?.user) {
      await storageService.syncWithSupabase(data.user);
    }

    return data;
  };

  // Sign out
  const signOut = async () => {
    clearError();
    if (!supabase || !isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.warn('[SignBridge Auth] Sign out notice:', signOutError.message);
    }
    setUser(null);
    setSession(null);
  };

  // Reset password
  const resetPassword = async (email) => {
    clearError();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Check environment variables.');
    }

    const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '#reset-password'
    });

    if (resetError) {
      setError(resetError.message);
      throw resetError;
    }

    return data;
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
    isConfigured: isSupabaseConfigured()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
