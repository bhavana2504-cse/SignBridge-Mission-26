import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { storageService } from '../services/storageService';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  error: null,
  authNotice: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  resendConfirmationEmail: async () => {},
  clearError: () => {},
  clearAuthNotice: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);

  const clearError = () => setError(null);
  const clearAuthNotice = () => setAuthNotice(null);

  useEffect(() => {
    // 0. Parse URL fragment/search for auth callbacks, confirmation tokens, or errors
    const checkUrlAuthParams = () => {
      try {
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        const search = window.location.search ? window.location.search.substring(1) : '';
        const combined = hash.includes('=') ? hash : search;
        if (!combined) return;

        const params = new URLSearchParams(combined);
        const errorParam = params.get('error');
        const errorCode = params.get('error_code');
        const errorDescription = params.get('error_description');
        const type = params.get('type');
        const accessToken = params.get('access_token');

        if (errorParam || errorCode) {
          let message = errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : 'Email verification failed.';
          if (errorCode === 'otp_expired' || message.toLowerCase().includes('expired')) {
            message = 'Your confirmation link has expired or has already been used. Please request a new confirmation email below.';
          } else if (errorParam === 'access_denied') {
            message = 'Access denied or invalid verification link. Please request a new confirmation email below.';
          }
          setAuthNotice({
            type: 'error',
            title: 'Verification Link Expired or Invalid',
            message
          });
          // Clean URL parameters to avoid re-triggering
          window.history.replaceState(null, '', window.location.pathname);
        } else if (type === 'signup' || (accessToken && type !== 'recovery')) {
          setAuthNotice({
            type: 'success',
            title: 'Email Verified Successfully!',
            message: 'Your email address has been confirmed. You are now signed in to SignBridge.'
          });
          window.history.replaceState(null, '', window.location.pathname);
        } else if (type === 'recovery') {
          setAuthNotice({
            type: 'info',
            title: 'Password Reset',
            message: 'You have been authenticated via recovery link. You may now update your password.'
          });
        }
      } catch (e) {
        console.warn('[SignBridge Auth] URL auth parsing notice:', e);
      }
    };

    checkUrlAuthParams();

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
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    });

    if (signUpError) {
      if (signUpError.message?.toLowerCase().includes('already registered')) {
        setError('An account with this email already exists. Please sign in or reset your password.');
      } else {
        setError(signUpError.message);
      }
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

  // Resend confirmation email
  const resendConfirmationEmail = async (email) => {
    clearError();
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Check environment variables.');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const { data, error: resendErr } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (resendErr) {
      setError(resendErr.message);
      throw resendErr;
    }

    return data;
  };

  const value = {
    user,
    session,
    loading,
    error,
    authNotice,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmationEmail,
    clearError,
    clearAuthNotice,
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
