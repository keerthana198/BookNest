import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then((r) => r.data);

export const getMe = () => api.get('/auth/me').then((r) => r.data);

export const getTopReviewers = () =>
  api.get('/auth/top-reviewers').then((r) => r.data);

// ── Books ─────────────────────────────────────────────
export const getBooks = (genre, sort) =>
  api.get('/books', { params: { genre, sort } }).then((r) => r.data);

export const getPopularBooks = () =>
  api.get('/books/popular').then((r) => r.data);

export const getTopRatedBooks = () =>
  api.get('/books/top-rated').then((r) => r.data);

export const getBook = (id) => api.get(`/books/${id}`).then((r) => r.data);

export const searchBooks = (q) =>
  api.get('/books/search', { params: { q } }).then((r) => r.data);

export const suggestBook = (data) =>
  api.post('/books/suggest', data).then((r) => r.data);

export const seedBooks = () => api.get('/books/seed').then((r) => r.data);

// ── Library ───────────────────────────────────────────
export const getMyLibrary = () => api.get('/library').then((r) => r.data);

export const addToLibrary = (bookId, status = 'Want to Read') =>
  api.post(`/library/${bookId}`, { status }).then((r) => r.data);

export const updateLibraryStatus = (bookId, status) =>
  api.patch(`/library/${bookId}`, { status }).then((r) => r.data);

export const removeFromLibrary = (bookId) =>
  api.delete(`/library/${bookId}`).then((r) => r.data);

// ── Reviews ───────────────────────────────────────────
export const getReviews = (bookId) =>
  api.get(`/reviews/book/${bookId}`).then((r) => r.data);

export const postReview = (bookId, rating, comment) =>
  api.post('/reviews', { bookId, rating, comment }).then((r) => r.data);
export const likeReview = async (id) => {
  const res = await fetch(`/api/reviews/${id}/like`, { method: 'PATCH' });
  return res.json();
};

export const dislikeReview = async (id) => {
  const res = await fetch(`/api/reviews/${id}/dislike`, { method: 'PATCH' });
  return res.json();
};
export default api;
