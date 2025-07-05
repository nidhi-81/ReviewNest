// src/pages/AddBook.jsx
import React, { useState } from 'react';
import { getToken } from '../utils/auth';
import './AddBook.css';

export default function AddBook() {
  const [book, setBook] = useState({ title: '', author: '', detail: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });

    if (name === 'title' && value.length >= 3) {
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${value}`);
        const data = await res.json();
        const books = data.items?.slice(0, 5).map(item => ({
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.[0] || '',
          detail: item.volumeInfo.detail || ''
        })) || [];
        setSuggestions(books);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    } else if (name === 'title') {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setBook(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(book)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Book added successfully!');
        setBook({ title: '', author: '', detail: '' });
      } else {
        setMessage(data.error || 'Failed to add book.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error');
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={book.title}
          onChange={handleChange}
          required
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s)}>
                {s.title} by {s.author}
              </li>
            ))}
          </ul>
        )}

        <label>Author:</label>
        <input type="text" name="author" value={book.author} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="detail" value={book.detail} onChange={handleChange} required />

        <button type="submit">Add Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
