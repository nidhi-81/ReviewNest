const { poolPromise, sql } = require('../config/db');

// ➕ Add Review
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

// 📖 Get Reviews by Book ID
// 📖 Get Reviews by Book ID with user votes
exports.getReviewsByBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.userId; // get user from JWT

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
