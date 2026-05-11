import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/sidebar.css';

const genres = ['Fiction', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Self-help', 'History'];

const navItems = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '📚', label: 'My Library', path: '/my-library', protected: true },
//{ icon: '⭐', label: 'My Reviews', path: '/my-reviews', protected: true },
//{ icon: '❤️', label: 'Liked Reviews', path: '/liked', protected: true },
//{ icon: '👤', label: 'Profile', path: '/profile', protected: true },
//{ icon: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  return (
    <aside className="sidebar">
      {user && (
        <div className="sidebar-profile">
          <div className="profile-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-tagline">Book Lover</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          if (item.protected && !user) return null;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {user && (
          <button className="sidebar-nav-item logout" onClick={() => { logoutUser(); navigate('/'); }}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        )}
      </nav>

      <div className="sidebar-genres">
        <h3 className="genres-title">Genres</h3>
        <div className="genres-list">
          {genres.map((g) => (
            <Link key={g} to={`/explore?genre=${g}`} className="genre-item">
              {g}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
