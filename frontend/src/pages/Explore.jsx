import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard.jsx';
import { getBooks } from '../services/api.js';
import '../styles/explore.css';

const GENRES = ['All', 'Fiction', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Self-help', 'History'];
const SORTS = [
  { value: '', label: 'Default' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'newest', label: 'Newest' },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    setLoading(true);
    getBooks(genre || undefined, sort || undefined)
      .then(setBooks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [genre, sort]);

  const setFilter = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set(key, val);
    else params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="explore">
      <h1 className="explore-title">Explore Books</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Genre:</label>
          <div className="filter-pills">
            {GENRES.map((g) => (
              <button
                key={g}
                className={`filter-pill ${(genre === g || (!genre && g === 'All')) ? 'active' : ''}`}
                onClick={() => setFilter('genre', g === 'All' ? '' : g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setFilter('sort', e.target.value)} className="sort-select">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="explore-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
          {books.length === 0 && <p className="no-books">No books found.</p>}
        </div>
      )}
    </div>
  );
}
