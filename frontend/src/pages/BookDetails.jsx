import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook, getReviews, postReview, addToLibrary } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/bookdetails.css';
import { likeReview, dislikeReview } from '../services/api.js';

const STATUS_OPTIONS = ['Want to Read', 'Reading', 'Completed'];

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('Want to Read');

  useEffect(() => {
    getBook(id).then(setBook).catch(() => navigate('/'));
    getReviews(id).then(setReviews).catch(() => {});
  }, [id]);

  const handleAddToLibrary = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToLibrary(id, status);
      alert(`Added to library as "${status}"!`);
    } catch {
      alert('Error adding to library.');
    }
  };
  const updateReview = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === updatedReview._id ? updatedReview : r
      )
    );
  };
  const handleLike = async (reviewId) => {
    try {
      // optimistic update (instant UI change)
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, likes: (r.likes || 0) + 1 }
            : r
        )
      );

      const res = await likeReview(reviewId);
      const updated = res?.data;

      if (!updated?._id) return;

      updateReview(updated);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDislike = async (reviewId) => {
    try {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, dislikes: (r.dislikes || 0) + 1 }
            : r
        )
      );

      const res = await dislikeReview(reviewId);
      const updated = res?.data;

      if (!updated?._id) return;

      updateReview(updated);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const newReview = await postReview(id, rating, comment);
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
    } catch {
      alert('Error submitting review.');
    }
    setSubmitting(false);
  };

  if (!book) return <div className="loading">📚Loading book...</div>;

  return (
    <div className="book-details">
      <div className="book-details-hero">
        <img
          src={book.coverImage || 'http://via.placeholder.com/200x300?text=📖'}
          alt={book.title}
          className="book-details-cover"
          onError={(e) => (e.target.src = 'http://via.placeholder.com/200x300?text=📖')}
        />
        <div className="book-details-info">
          <h1>{book.title}</h1>
          <p className="details-author">by {book.author}</p>
          <div className="details-rating">
            <span>⭐ {book.rating?.toFixed(1)}</span>
            <span className="details-count">({book.reviewCount?.toLocaleString()} reviews)</span>
          </div>
          <div className="details-genres">
            {book.genres?.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
          
          <h4>About Author</h4>
          <p>{book.authorBio}</p>

          <h4>Story Line</h4>
          <p>{book.storyOutline}</p>
          <div className="details-actions">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="add-to-lib-btn" onClick={handleAddToLibrary}>
              Add to Library
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>

        {user && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Write a Review</h3>
            <div className="rating-input">
              <label>Rating: </label>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`star-btn ${n <= rating ? 'active' : ''}`}
                  onClick={() => setRating(n)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="review-textarea"
              required
            />
            <button type="submit" className="submit-review-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first!</p>
          ) : (
           reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar-sm">
                  {r.userName?.[0]?.toUpperCase()}
                </div>

                <div>
                  <div className="reviewer-name-sm">{r.userName}</div>
                  <div className="review-rating">{'⭐'.repeat(r.rating)}</div>
                </div>

                <div className="review-date">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>

              <p className="review-comment">{r.comment}</p>

              {/* ⭐ LIKE / DISLIKE SECTION */}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => handleLike(r._id)}>
                  👍 {r.likes || 0}
                </button>

                <button type="button" onClick={() => handleDislike(r._id)}>
                  👎 {r.dislikes || 0}
                </button>
              </div>
            </div>
          )) 
          )}
        </div>
      </div>
    </div>
  );
}
