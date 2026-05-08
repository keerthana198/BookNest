import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';
import bookLogo from "../assets/logo.png";

const BOOKS = [
  // Row 4 (top)
  [
    { w: 14, h: 62, color: '#8b3a2a' },
    { w: 11, h: 55, color: '#4a6741' },
    { w: 18, h: 68, color: '#2a3f6a' },
    { w: 12, h: 50, color: '#7a5c2a' },
    { w: 16, h: 60, color: '#5c3a5a' },
    { w: 9,  h: 45, color: '#6b4a20' },
    { w: 20, h: 72, color: '#3a5c4a' },
    { w: 13, h: 58, color: '#7a3030' },
    { w: 11, h: 52, color: '#4a4a7a' },
    { w: 15, h: 65, color: '#5a4020' },
    { w: 10, h: 48, color: '#3a5a3a' },
  ],
  // Row 3
  [
    { w: 16, h: 70, color: '#6b3a1a' },
    { w: 13, h: 60, color: '#1a4a5c' },
    { w: 10, h: 52, color: '#5c5c2a' },
    { w: 19, h: 75, color: '#8b4a5c' },
    { w: 12, h: 58, color: '#3a6b3a' },
    { w: 14, h: 64, color: '#6b6b3a' },
    { w: 9,  h: 46, color: '#4a2a6b' },
    { w: 17, h: 68, color: '#c8860a', opacity: 0.8 },
    { w: 11, h: 54, color: '#2a4a2a' },
    { w: 15, h: 62, color: '#7a2a2a' },
  ],
  // Row 2
  [
    { w: 18, h: 78, color: '#2a3a5c' },
    { w: 11, h: 56, color: '#6b4a2a' },
    { w: 14, h: 65, color: '#5c2a4a' },
    { w: 20, h: 80, color: '#3a5a2a' },
    { w: 9,  h: 48, color: '#8b5c2a' },
    { w: 15, h: 70, color: '#4a2a2a' },
    { w: 12, h: 60, color: '#2a5a5a' },
    { w: 16, h: 68, color: '#7a4a7a' },
    { w: 10, h: 52, color: '#5a6b2a' },
  ],
  // Row 1 (bottom)
  [
    { w: 15, h: 66, color: '#4a5c8b' },
    { w: 12, h: 58, color: '#7a3a2a' },
    { w: 18, h: 72, color: '#2a5c4a' },
    { w: 10, h: 50, color: '#6b5a2a' },
    { w: 20, h: 80, color: '#5c2a5c' },
    { w: 13, h: 62, color: '#3a3a6b' },
    { w: 11, h: 54, color: '#8b4a2a' },
    { w: 16, h: 70, color: '#2a6b2a' },
    { w: 9,  h: 46, color: '#5c4a4a' },
  ],
];

function Bookshelf() {
  const rowBottoms = ['48px', '140px', '230px', '318px'];
  const shelfBottoms = ['42px', '134px', '224px', '312px'];

  return (
    <div className="bookshelf">
      <div className="glow-top" />

      <div className="lamp">
        <div className="lamp-arm" />
        <div className="lamp-head" />
      </div>
      <div className="lamp-light-cone" />

      {shelfBottoms.map((b, i) => (
        <div key={i} className="shelf-line" style={{ bottom: b }} />
      ))}

      {[...BOOKS].reverse().map((row, ri) => (
        <div key={ri} className="shelf-row" style={{ bottom: rowBottoms[ri] }}>
          {row.map((book, bi) => (
            <div
              key={bi}
              className="book"
              style={{
                width: book.w,
                height: book.h,
                background: book.color,
                opacity: book.opacity ?? 1,
                marginRight: bi < row.length - 1 ? 3 : 0,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      loginUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Left panel — bookshelf */}
        <div className="auth-left-panel">
          <Bookshelf />
          <div className="auth-panel-quote">
            <blockquote>"A reader lives a thousand lives before he dies."</blockquote>
            <cite>— George R.R. Martin</cite>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-right-panel">
          <div className="auth-brand">
            <div className="auth-brand-icon"><img src={bookLogo} alt="Book Logo" /></div>
            <span className="auth-brand-name">BookNest</span>
          </div>

          <div className="auth-welcome">
            <h2>Welcome back,<br />reader.</h2>
            <p>Sign in to continue your story</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in…' : '→  Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          <span className="auth-page-num">p. 01</span>
        </div>

      </div>
    </div>
  );
}