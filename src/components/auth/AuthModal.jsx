import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2, ShieldCheck } from '../common/Icons';

export function AuthModal({ isOpen, onClose }) {
  const { 
    signIn, 
    signUp, 
    resetPassword, 
    resendConfirmationEmail, 
    error: authError, 
    authNotice,
    clearError, 
    clearAuthNotice,
    isConfigured 
  } = useAuth();

  // Mode: 'signin' | 'signup' | 'forgot' | 'resend'
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [localError, setLocalError] = useState(null);

  // If there is an authNotice from callback (e.g. otp_expired), open in appropriate mode
  useEffect(() => {
    if (authNotice && isOpen) {
      if (authNotice.type === 'error') {
        setLocalError(authNotice.message);
        setMode('resend');
      } else if (authNotice.type === 'success') {
        setStatusMessage({ type: 'success', text: authNotice.message });
      }
    }
  }, [authNotice, isOpen]);

  if (!isOpen) return null;

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    clearError();
    clearAuthNotice();
    setLocalError(null);
    setStatusMessage(null);
  };

  const handleResendDirect = async (targetEmail) => {
    const toEmail = targetEmail || email;
    if (!toEmail || !toEmail.includes('@')) {
      setLocalError('Please enter a valid email address to resend confirmation.');
      return;
    }
    setLoading(true);
    setLocalError(null);
    try {
      await resendConfirmationEmail(toEmail);
      setStatusMessage({
        type: 'info',
        text: `Verification email resent to ${toEmail}. Please check your spam folder or inbox.`
      });
    } catch (err) {
      setLocalError(err.message || 'Unable to resend confirmation email. Please check your address or try later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setStatusMessage(null);
    clearError();
    clearAuthNotice();

    // Basic client validation
    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if ((mode === 'signin' || mode === 'signup') && (!password || password.length < 6)) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        setStatusMessage({ type: 'success', text: 'Welcome back! Signed in successfully.' });
        setTimeout(() => {
          onClose();
        }, 800);
      } else if (mode === 'signup') {
        const res = await signUp(email, password, fullName);
        if (res?.user && !res?.session) {
          setStatusMessage({
            type: 'info',
            text: `Account created for ${email}! A confirmation link has been sent. Please check your inbox and confirm before signing in.`
          });
        } else {
          setStatusMessage({ type: 'success', text: 'Account registered successfully! 100 welcome coins granted.' });
          setTimeout(() => {
            onClose();
          }, 900);
        }
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setStatusMessage({
          type: 'info',
          text: 'Password recovery email sent! Check your inbox for reset instructions.'
        });
      } else if (mode === 'resend') {
        await resendConfirmationEmail(email);
        setStatusMessage({
          type: 'info',
          text: `A new confirmation link has been sent to ${email}. Please check your inbox.`
        });
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('email not confirmed')) {
        setLocalError('Your email has not been confirmed yet. Please check your inbox or click "Resend Confirmation" below.');
      } else {
        setLocalError(msg || 'An authentication error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'signin') return 'Sign In to SignBridge';
    if (mode === 'signup') return 'Create Free Account';
    if (mode === 'resend') return 'Resend Confirmation Email';
    return 'Reset Your Password';
  };

  const isEmailNotConfirmed = (localError || authError || '').toLowerCase().includes('not confirmed') || (localError || '').includes('expired');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} maxWidth="480px">
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
          <BridgeLogo size={36} color="#5c54e5" />
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {mode === 'signin' && 'Access your synced ISL learning streak, coins, and bookmarks.'}
          {mode === 'signup' && 'Join thousands of learners mastering Indian Sign Language with 100 free coins.'}
          {mode === 'forgot' && "Enter your email to receive a password reset link."}
          {mode === 'resend' && "Did not receive your confirmation email or did the link expire? Enter your email to get a new one."}
        </p>
      </div>

      {/* Configuration notice if Supabase is offline */}
      {!isConfigured && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#92400e', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <AlertCircle size={18} color="#d97706" />
          <span>Supabase credentials pending in environment. Running in local progress mode.</span>
        </div>
      )}

      {/* Error Message */}
      {(localError || authError) && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '0.85rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#b91c1c' }} role="alert">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span>{localError || authError}</span>
              {isEmailNotConfirmed && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="footer-btn-link"
                    style={{ fontWeight: '800', color: '#b91c1c', textDecoration: 'underline' }}
                    onClick={() => handleResendDirect(email)}
                    disabled={loading}
                  >
                    Resend confirmation link to {email || 'my email'} →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Notice */}
      {statusMessage && (
        <div style={{ backgroundColor: statusMessage.type === 'success' ? '#ecfdf5' : '#eff6ff', border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#bfdbfe'}`, borderRadius: '12px', padding: '0.85rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: statusMessage.type === 'success' ? '#047857' : '#1d4ed8' }} role="status">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color={statusMessage.type === 'success' ? '#10b981' : '#3b82f6'} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span>{statusMessage.text}</span>
              {mode === 'signup' && statusMessage.type === 'info' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="footer-btn-link"
                    style={{ fontWeight: '700', color: '#1d4ed8', textDecoration: 'underline' }}
                    onClick={() => handleResendDirect(email)}
                    disabled={loading}
                  >
                    Didn't receive it? Click to resend link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mode === 'signup' && (
          <div>
            <label htmlFor="auth-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Full Name:
            </label>
            <input
              id="auth-name"
              type="text"
              required
              placeholder="e.g. Bhavana Sivakumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="dict-search-input"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.95rem' }}
            />
          </div>
        )}

        <div>
          <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Email Address:
          </label>
          <input
            id="auth-email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="dict-search-input"
            style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.95rem' }}
          />
        </div>

        {(mode === 'signin' || mode === 'signup') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label htmlFor="auth-password" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Password:
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  className="footer-btn-link"
                  style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary-700)' }}
                  onClick={() => handleSwitchMode('forgot')}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dict-search-input"
              style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.95rem' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '0.8rem', justifyContent: 'center', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
        >
          {loading 
            ? 'Please wait...' 
            : mode === 'signin' 
              ? 'Sign In' 
              : mode === 'signup' 
                ? 'Create Account' 
                : mode === 'resend' 
                  ? 'Send Confirmation Link' 
                  : 'Send Reset Link'
          }
        </button>
      </form>

      {/* Helpful Mode Switching Options */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {mode === 'signin' ? (
          <>
            <div>
              Don't have an account?{' '}
              <button
                type="button"
                className="footer-btn-link"
                style={{ fontWeight: '800', color: 'var(--color-primary-700)' }}
                onClick={() => handleSwitchMode('signup')}
              >
                Sign up for free
              </button>
            </div>
            <div>
              Waiting for confirmation?{' '}
              <button
                type="button"
                className="footer-btn-link"
                style={{ fontWeight: '700', color: 'var(--color-primary-600)' }}
                onClick={() => handleSwitchMode('resend')}
              >
                Resend confirmation email
              </button>
            </div>
          </>
        ) : (
          <div>
            Already have an account?{' '}
            <button
              type="button"
              className="footer-btn-link"
              style={{ fontWeight: '800', color: 'var(--color-primary-700)' }}
              onClick={() => handleSwitchMode('signin')}
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AuthModal;
