import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sentimentScore, setSentimentScore] = useState('');

  useEffect(() => {
    // Fetch book details (optional)
    fetch(`http://localhost:5000/api/books`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(b => b.BookID == id);
        if (found) setBook(found);
      });

    // Fetch reviews for this book
    fetch(`http://localhost:5000/api/reviews/${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // if auth is implemented

    const reviewData = {
      bookId: parseInt(id),
      rating,
      comment,
      isAnonymous,
      sentimentScore: parseFloat(sentimentScore) 
    };

    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '', // if needed
        },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews(prev => [...prev, newReview]);
        setComment('');
        setRating(5);
        setIsAnonymous(false);
      }
    } catch (err) {
      console.error('Review post error:', err);
    }
  };

  return (
    <div className="container">
      <h1>{book.Title}</h1>
      <p><strong>Author:</strong> {book.Author}</p>
      <p>{book.Description}</p>

      <hr />

      <h2>📖 Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="card">
            <p><strong>Rating:</strong> {review.Rating} ⭐</p>
            <p><strong>Comment:</strong> {review.Comment}</p>
            <p><strong>By:</strong> {review.ReviewerName}</p>
            {review.SentimentScore && (
              <p><strong>Sentiment Score:</strong> {review.SentimentScore.toFixed(2)}</p>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      <hr />
      <h2>📝 Leave a Review</h2>
      <form onSubmit={handleReviewSubmit}>
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            {[5,4,3,2,1].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Comment:
          <br />
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" cols="50" required />
        </label>
        <br />

        <label>Sentiment Score (0 to 1):</label>
<input
  type="number"
  step="0.01"
  min="0"
  max="1"
  value={sentimentScore}
  onChange={(e) => setSentimentScore(e.target.value)}
  required
/>
<br/>

        <label>
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          Submit Anonymously
        </label>
        <br />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}
