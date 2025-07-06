const { poolPromise, sql } = require('../config/db');



exports.addReview = async (req, res) => {
  const { bookId, rating, comment, isAnonymous, sentimentScore } = req.body;
  const userId = req.user.userId; 

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('BookID', sql.Int, bookId)
      .input('UserID', sql.Int, userId)
      .input('Rating', sql.Int, rating)
      .input('Comment', sql.NVarChar, comment)
      .input('IsAnonymous', sql.Bit, isAnonymous)
      .input('SentimentScore', sql.Float, sentimentScore)
      .execute('sp_AddReview');

    res.status(201).json({ message: 'Review added successfully' });

  } catch (err) {
    console.error('Add Review Error:', err.message);
    res.status(500).json({ error: 'Failed to add review' });
  }
};


exports.getReviewsByBook = async (req, res) => {
  const { bookId } = req.params;
  if (isNaN(bookId)) {
  return res.status(400).json({ error: 'Invalid Book ID' });
}
  const userId = req.user.userId; 

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('BookID', sql.Int, bookId)
      .input('UserID', sql.Int, userId)
      .execute('sp_GetReviewsByBookID');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Get Reviews Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.likeOrDislikeReview = async (req, res) => {
  const { reviewId, isLike } = req.body;
  const userId = req.user.userId;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ReviewID', sql.Int, reviewId)
      .input('UserID', sql.Int, userId)
      .input('IsLike', sql.Bit, isLike)
      .execute('sp_LikeOrDislikeReview');

    res.status(200).json({ message: 'Vote recorded' });
  } catch (err) {
    console.error('Like/Dislike Error:', err);
    res.status(500).json({ error: 'Failed to like/dislike review' });
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ReviewID', sql.Int, reviewId)
      .execute('sp_DeleteReview'); 

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete Review Error:', err.message);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        r.*, 
        u.Name, 
        b.Title,
        ISNULL(SUM(CASE WHEN v.IsLike = 1 THEN 1 ELSE 0 END), 0) AS LikeCount,
        ISNULL(SUM(CASE WHEN v.IsLike = 0 THEN 1 ELSE 0 END), 0) AS DislikeCount
      FROM Reviews r
      JOIN Users u ON r.UserID = u.UserID
      JOIN Books b ON r.BookID = b.BookID
      LEFT JOIN ReviewLikes v ON r.ReviewID = v.ReviewID
      GROUP BY r.ReviewID, r.BookID, r.UserID, r.Rating, r.Comment, r.IsAnonymous, r.SentimentScore, r.CreatedAt,
               u.Name, b.Title
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Get all reviews error:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
