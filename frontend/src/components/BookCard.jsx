import { useNavigate } from 'react-router-dom';
import { addToLibrary } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/book.css';

export default function BookCard({ book }) {
  console.log("BOOK DATA:", book);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddToLibrary = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    try {
      await addToLibrary(book._id, 'Want to Read');
      alert(`"${book.title}" added to your library!`);
    } catch {
      alert('Already in your library or error occurred.');
    }
  };

  return (
    <div className="book-card" onClick={() => navigate(`/books/${book._id}`)}>
      <div className="book-cover-wrap">
        <img
          src={book.coverImage || 'https://via.placeholder.com/150x220?text=📖'}
          alt={book.title}
          className="book-cover"
          onError={(e) => (e.target.src = 'https://via.placeholder.com/150x220?text=📖')}
        />
        <div className="book-overlay">
          <button className="add-library-btn" onClick={handleAddToLibrary}>+ Library</button>
        </div>
      </div>
      <div className="book-info">
        <h4 className="book-title">{book.title}</h4>
        <p className="book-author">{book.author}</p>
        <p>{book.description}</p>
        <div className="book-rating">
          <span className="star">⭐</span>
          <span className="rating-num">{book.rating ? book.rating?.toFixed(1) : "N/A"}</span>
          <span className="review-count">({book.reviewCount ? (book.reviewCount / 1000).toFixed(1) : 0}K)</span>
        </div>
      </div>
      <button className="view-details-btn" onClick={(e) =>{e.stopPropagation(); navigate(`/books/${book._id}`);}}>
        View Details
      </button>
    </div>
  );
}
