import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <div className="card">
      <h2>{book.Title}</h2>
      <p><strong>Author:</strong> {book.Author}</p>
      <p>{book.Detail?.slice(0, 120)}...</p>
      <Link to={`/books/${book.BookID}`}>
        <button>View Reviews</button>
      </Link>
    </div>
  );
}
