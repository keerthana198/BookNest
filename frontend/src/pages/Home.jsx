import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularBooks, getTopRatedBooks, seedBooks } from '../services/api.js';
import '../styles/home.css';
import BookCard from "../components/BookCard";

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    image: "https://covers.openlibrary.org/b/id/10523338-L.jpg",
    rating: 4.8
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    image: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
    rating: 4.5
  }
];

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await seedBooks(); // Seeds DB on first load
        const [pop, top] = await Promise.all([getPopularBooks(), getTopRatedBooks()]);
        console.log("Popular:", pop);
        console.log("TopRated:", top);
        setPopular(pop);
        setTopRated(top);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <h1>Find Your Next Book</h1>
          <p>Turn pages, share opinions, build your reading world.</p>
          <Link to="/explore" className="hero-btn">Explore Books</Link>
        </div>
      </div>

      {/* Popular Books */}
      <section className="book-section">
        <div className="section-header">
          <h2>Popular Books</h2>
          <Link to="/explore" className="view-all">View all</Link>
        </div>
        <div className="books-grid">
          {popular.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

      {/* Top Rated Books */}
      <section className="book-section">
        <div className="section-header">
          <h2>Top Rated Books</h2>
          <Link to="/explore?sort=rating" className="view-all">View all</Link>
        </div>
        <div className="top-rated-list">
          {topRated.map((book) => (
            <div key={book._id} className="top-rated-item">
              <img
                src={book.coverImage || 'https://via.placeholder.com/60x85?text=📖'}
                alt={book.title}
                className="top-rated-cover"
                onError={(e) =>
                  (e.target.src = 'https://via.placeholder.com/60x85?text=📖')
                }
              />
              <div className="top-rated-info">
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <div className="book-rating">
                  <span>⭐ {book.rating?.toFixed(1)}</span>
                  <span className="review-count">
                    ({book.reviewCount ? (book.reviewCount / 1000).toFixed(1) : 0}K)
                  </span>
                </div>
                <p className="top-rated-desc">
                  {book.description?.slice(0, 60)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}