import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const pwdStrength = p => {
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'var(--danger)', width: '20%' };
    if (p.length < 8) return { label: 'Weak', color: 'var(--warning)', width: '45%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong 💪', color: 'var(--success)', width: '100%' };
    return { label: 'Good', color: 'var(--accent)', width: '70%' };
  };

  const strength = pwdStrength(form.password);
  const pwdMatch = form.confirm && form.password === form.confirm;
  const pwdMismatch = form.confirm && form.password !== form.confirm;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* Left branding panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">🎓</div>
          <h1>Join Campus Hub</h1>
          <p>Create your free account and connect with your campus community.</p>
          <div className="auth-brand-features">
            {['✅ Free to join — no credit card', '🔐 Secure JWT authentication', '🛒 List & discover products', '🎉 Register for campus events', '🤖 AI-powered chatbot help'].map(f => (
              <div className="auth-brand-feature" key={f}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🎓</div>
            <h2>Create your account</h2>
            <p>Join thousands of campus students</p>
          </div>

          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input id="name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">📧</span>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@campus.edu" required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input id="password" type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>{showPwd ? '🙈' : '👁️'}</button>
              </div>
              {strength && (
                <div className="pwd-strength">
                  <div className="pwd-bar"><div style={{ width: strength.width, background: strength.color, height: '100%', borderRadius: 4, transition: 'all 0.3s' }} /></div>
                  <span style={{ fontSize: '0.75rem', color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <div className={`input-wrap ${pwdMatch ? 'input-valid' : pwdMismatch ? 'input-invalid' : ''}`}>
                <span className="input-icon">{pwdMatch ? '✅' : pwdMismatch ? '❌' : '🔒'}</span>
                <input id="confirm" type={showConfirm ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat your password" required />
                <button type="button" className="pwd-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>{showConfirm ? '🙈' : '👁️'}</button>
              </div>
              {pwdMismatch && <p className="field-error">Passwords don't match</p>}
            </div>

            <button type="submit" className="btn-primary btn-full btn-lg" disabled={loading || pwdMismatch}>
              {loading ? <><span className="btn-spinner" /> Creating account...</> : '🚀 Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>Already have an account?</span></div>

          <div className="auth-footer">
            <Link to="/login" className="btn-secondary btn-full" style={{ justifyContent: 'center' }}>
              🔐 Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
