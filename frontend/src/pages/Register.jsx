import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/auth.css';
import bookLogo from "../assets/logo.png";

const FLOATING_BOOKS = [
  { top: '8%',  left: '12%', rotate: '-15deg', color: '#8b3a2a', w: 28, h: 40 },
  { top: '14%', left: '68%', rotate: '12deg',  color: '#2a3f6a', w: 22, h: 34 },
  { top: '28%', left: '82%', rotate: '-8deg',  color: '#4a6741', w: 18, h: 28 },
  { top: '52%', left: '6%',  rotate: '18deg',  color: '#5c3a5a', w: 24, h: 36 },
  { top: '62%', left: '78%', rotate: '-20deg', color: '#7a5c2a', w: 20, h: 30 },
  { top: '75%', left: '22%', rotate: '10deg',  color: '#c8860a', w: 16, h: 26 },
  { top: '82%', left: '88%', rotate: '-5deg',  color: '#3a5c4a', w: 26, h: 38 },
  { top: '5%',  left: '44%', rotate: '22deg',  color: '#6b3a1a', w: 14, h: 22 },
];

function FloatingBook({ top, left, rotate, color, w, h, delay }) {
  return (
    <div
      className="floating-book"
      style={{
        position: 'absolute',
        top,
        left,
        width: w,
        height: h,
        background: color,
        borderRadius: '2px 4px 4px 2px',
        transform: `rotate(${rotate})`,
        opacity: 0.55,
        animationDelay: delay,
      }}
    />
  );
}

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { loginUser }           = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(name, email, password);
      loginUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page register-page">

      {/* Ambient floating books in background */}
      <div className="register-bg">
        {FLOATING_BOOKS.map((b, i) => (
          <FloatingBook key={i} {...b} delay={`${i * 0.4}s`} />
        ))}
        <div className="register-bg-glow" />
      </div>

      <div className="auth-card register-card">

        {/* Left: form */}
        <div className="auth-right-panel">
          <div className="auth-brand">
            <div className="auth-brand-icon"><img src={bookLogo} alt="Book Logo" /></div>
            <span className="auth-brand-name">BookNest</span>
          </div>

          <div className="auth-welcome">
            <h2>Begin your<br />next chapter.</h2>
            <p>Join thousands of readers today</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
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
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account…' : '→  Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>

          <span className="auth-page-num">p. 00</span>
        </div>

        {/* Right: decorative panel */}
        <div className="auth-left-panel register-right-panel">
          <div className="register-panel-inner">
            <div className="register-shelf-art">
              {/* Stacked books illustration */}
              <div className="stack-book" style={{ width: 90, height: 16, background: '#8b3a2a', borderRadius: 3 }} />
              <div className="stack-book" style={{ width: 80, height: 16, background: '#2a3f6a', borderRadius: 3 }} />
              <div className="stack-book" style={{ width: 100, height: 16, background: '#4a6741', borderRadius: 3 }} />
              <div className="stack-book" style={{ width: 70, height: 16, background: '#c8860a', borderRadius: 3 }} />
              <div className="stack-book" style={{ width: 95, height: 16, background: '#5c3a5a', borderRadius: 3 }} />
              <div className="stack-book" style={{ width: 85, height: 16, background: '#6b3a1a', borderRadius: 3 }} />
              <div className="stack-book stack-book--gap" style={{ width: 75, height: 16, background: '#3a5c4a', borderRadius: 3 }} />
            </div>

            <div className="register-panel-text">
              <p className="register-stat"><span>10,000+</span> books catalogued</p>
              <p className="register-stat"><span>50,000+</span> readers worldwide</p>
              <p className="register-stat"><span>∞</span> stories waiting</p>
            </div>

            <div className="register-panel-quote">
              <blockquote>"Not all those who wander are lost — some are just browsing."</blockquote>
              <cite>— A librarian, probably</cite>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}