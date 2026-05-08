# BookNest — Full Stack App

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: NestJS
- **Database**: MongoDB (Mongoose)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) OR MongoDB Atlas URI

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/booknest
JWT_SECRET=your_super_secret_key_here
PORT=3001
```

```bash
npm run start:dev
```

Backend runs at: http://localhost:3001

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 📁 Project Structure

```
booknest/
├── frontend/          # React + Vite
│   └── src/
│       ├── components/   # Navbar, Sidebar, BookCard, RightPanel
│       ├── pages/        # Home, MyLibrary, BookDetails
│       ├── styles/       # CSS files
│       └── services/     # API calls (api.js)
│
└── backend/           # NestJS
    └── src/
        ├── books/        # Books module (CRUD)
        ├── users/        # Users module
        ├── reviews/      # Reviews module
        └── auth/         # Auth (JWT)
```

## 🔑 API Endpoints

### Auth
- `POST /auth/register` — Register
- `POST /auth/login` — Login → returns JWT

### Books
- `GET /books` — All books (query: `?genre=Fiction&sort=rating`)
- `GET /books/popular` — Popular books
- `GET /books/top-rated` — Top rated books
- `GET /books/:id` — Book details
- `POST /books` — Create book (admin)
- `POST /books/suggest` — Suggest a book

### Library (authenticated)
- `GET /library` — My library
- `POST /library/:bookId` — Add to library
- `PATCH /library/:bookId` — Update status (reading/completed/want-to-read)

### Reviews
- `GET /reviews/book/:bookId` — Reviews for a book
- `POST /reviews` — Post a review (authenticated)
