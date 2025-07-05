import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import LoginRegister from './pages/LoginRegister';
import ProtectedRoute from './components/ProtectedRoute';
import AddBook from './pages/AddBook';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/books/:id" element={
          <ProtectedRoute><BookDetails /></ProtectedRoute>
        } />

        <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
