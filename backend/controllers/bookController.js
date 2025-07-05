const { poolPromise, sql } = require('../config/db');

exports.addBook = async (req, res) => {
  const { title, author, detail } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Title', sql.NVarChar, title)
      .input('Author', sql.NVarChar, author)
      .input('Detail', sql.NVarChar, detail)
      .execute('sp_AddBook');

    res.status(201).json({ message: 'Book added successfully' });

  } catch (err) {
    console.error('Add Book Error:', err);
    res.status(500).json({ error: 'Failed to add book' });
  }
};


exports.getBooks = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute('sp_GetAllBooks');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Get Books Error:', err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
