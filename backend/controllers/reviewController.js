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
exports.getReviewsByBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('BookID', sql.Int, bookId)
      .execute('sp_GetReviewsByBookID');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Get Reviews Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
