import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function SignIn({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanEmail === 'bpc1164@gmail.com' && cleanPassword === 'bpc@1164') {
        setIsLoading(false);
        onLoginSuccess({ email: cleanEmail, name: 'BP Consultant Admin' });
      } else {
        setIsLoading(false);
        setError('Invalid Email or Password. Please check your credentials.');
      }
    }, 400);
  };

  const fillCredentials = () => {
    setEmail('bpc1164@gmail.com');
    setPassword('bpc@1164');
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 30%, rgba(201, 168, 76, 0.08) 0%, rgba(6, 14, 33, 1) 70%)'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px 32px',
        border: '1.5px solid rgba(201, 168, 76, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(240, 217, 138, 0.15)',
        animation: 'fadeUp 0.5s ease'
      }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dim))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(201, 168, 76, 0.35)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={34} color="#060e21" strokeWidth={2.4} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '6px'
          }} className="gold-gradient-text">
            BP CONSULTANT
          </h1>

          <div style={{
            fontSize: '0.82rem',
            color: 'var(--cream-dim)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            HR and Compliance • Bill Book Portal
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: '#fca5a5',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email input */}
          <div>
            <label className="input-label" htmlFor="login-email">
              <Mail size={13} style={{ display: 'inline', marginRight: '5px' }} />
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="bpc-input"
              placeholder="bpc1164@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          {/* Password input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label" htmlFor="login-password">
                <Lock size={13} style={{ display: 'inline', marginRight: '5px' }} />
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="bpc-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '40px', fontSize: '0.95rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--cream-dim)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Sign In Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '6px' }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={17} />
                <span>Sign In to Bill Book</span>
              </>
            )}
          </button>

          {/* Quick Auto-fill button */}
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <button
              type="button"
              onClick={fillCredentials}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                opacity: 0.85
              }}
            >
              Fill login credentials automatically
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
