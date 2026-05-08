import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import MyLibrary from './pages/MyLibrary.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Explore from './pages/Explore.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import './styles/App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="my-library" element={<MyLibrary />} />
        <Route path="books/:id" element={<BookDetails />} />
      </Route>
    </Routes>
  );
}
