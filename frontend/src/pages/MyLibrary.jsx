import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyLibrary, updateLibraryStatus, removeFromLibrary } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/mylibrary.css';

const STATUSES = ['Want to Read', 'Reading', 'Completed'];
const STATUS_COLORS = { 'Reading': '#3b82f6', 'Completed': '#22c55e', 'Want to Read': '#f59e0b' };

export default function MyLibrary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyLibrary().then(setLibrary).finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = async (bookId, status) => {
    await updateLibraryStatus(bookId, status);
    setLibrary((prev) =>
      prev.map((e) => (e.book._id === bookId ? { ...e, status } : e))
    );
  };

  const handleRemove = async (bookId) => {
    await removeFromLibrary(bookId);
    setLibrary((prev) => prev.filter((e) => e.book._id !== bookId));
  };

  const filtered = filter === 'All' ? library : library.filter((e) => e.status === filter);

  if (loading) return <div className="loading">Loading library...</div>;

  return (
    <div className="my-library">
      <h1>My Library</h1>

      <div className="library-filters">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            className={`filter-pill ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s} {s !== 'All' && `(${library.filter((e) => e.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-library-page">
          <p>No books here yet.</p>
          <Link to="/explore" className="explore-link">Explore Books</Link>
        </div>
      ) : (
        <div className="library-grid">
          {filtered.map((entry) => (
            <div key={entry._id} className="library-card">
              <img
                src={entry.book?.coverImage || 'https://via.placeholder.com/120x170?text=📖'}
                alt={entry.book?.title}
                className="library-card-cover"
                onClick={() => navigate(`/books/${entry.book._id}`)}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/120x170?text=📖')}
              />
              <div className="library-card-info">
                <h3 onClick={() => navigate(`/books/${entry.book._id}`)}>
                  {entry.book?.title}
                </h3>
                <p>{entry.book?.author}</p>
                <div className="library-card-rating">
                  ⭐ {entry.book?.rating?.toFixed(1)}
                </div>
                <select
                  value={entry.status}
                  onChange={(e) => handleStatusChange(entry.book._id, e.target.value)}
                  className="status-select"
                  style={{ borderColor: STATUS_COLORS[entry.status] }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(entry.book._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
