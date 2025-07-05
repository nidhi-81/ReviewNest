import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import '../index.css'
export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then(data => setBooks(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
   <div className="container">
      <h1 className="fancy-heading"> ReviewNest - Explore Novels</h1>
      <div className="books-grid">
        {books.map(book => (
          <BookCard key={book.BookID} book={book} />
        ))}
      </div>
    </div>
  );

}
