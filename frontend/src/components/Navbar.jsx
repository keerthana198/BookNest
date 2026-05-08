import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { searchBooks } from '../services/api.js';
import '../styles/navbar.css';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        const data = await searchBooks(query);
        setResults(data);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="BookNest Logo" className="navbar-logo" />
        <div className="brand-text">
          <span className="brand-name">BookNest</span>
          <span className="brand-tagline">Where stories live and readers belong</span>
        </div>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/explore" className="nav-link">Explore</Link>
        <Link to="/my-library" className="nav-link">My Library</Link>
      </div>

      <div className="navbar-search" ref={searchRef}>
        <input
          type="text"
          placeholder="Search books or authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        {showDropdown && results.length > 0 && (
          <div className="search-dropdown">
            {results.map((book) => (
              <div
                key={book._id}
                className="search-result-item"
                onClick={() => {
                  navigate(`/books/${book._id}`);
                  setShowDropdown(false);
                  setQuery('');
                }}
              >
                <div className="search-result-title">{book.title}</div>
                <div className="search-result-author">{book.author}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-menu">
            <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <span className="user-name">Hi, {user.name?.split(' ')[0]}</span>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
