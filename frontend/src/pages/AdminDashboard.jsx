import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './adminDashboard.css';

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function AdminDashboard() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, totalUsers: 0, likes: 0, dislikes: 0 });

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reviews/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setReviews(data);

      let likes = 0, dislikes = 0;
      data.forEach(r => {
        likes += r.LikeCount || 0;
        dislikes += r.DislikeCount || 0;
      });

      setStats({
        totalReviews: data.length,
        totalUsers: new Set(data.map(r => r.UserID)).size,
        likes,
        dislikes
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (reviewId) => {
    const confirm = window.confirm('Are you sure you want to delete this review?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('Review deleted.');
        fetchData();
      } else {
        alert('Failed to delete review.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const chartData = {
    labels: reviews.map(r => `Review ${r.ReviewID}`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: reviews.map(r => r.SentimentScore),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, max: 1 }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="stat-box">Total Reviews: {stats.totalReviews}</div>
        <div className="stat-box">Unique Users: {stats.totalUsers}</div>
        <div className="stat-box">Likes: {stats.likes}</div>
        <div className="stat-box">Dislikes: {stats.dislikes}</div>
      </div>

      <h2>📈 Sentiment Analysis Chart</h2>
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <h2>🗑 Manage Reviews</h2>
      {reviews.map(r => (
        <div key={r.ReviewID} className="review-card">
          <p><strong>Book:</strong> {r.Title}</p>
          <p><strong>User:</strong> {r.Name}</p>
          <p><strong>Rating:</strong> {r.Rating}</p>
          <p><strong>Comment:</strong> {r.Comment}</p>
          <p><strong>Likes:</strong> {r.LikeCount || 0} | <strong>Dislikes:</strong> {r.DislikeCount || 0}</p>
          <p><strong>Sentiment Score:</strong> {r.SentimentScore}</p>
          <button onClick={() => handleDelete(r.ReviewID)} className="delete-btn">Delete</button>
        </div>
      ))}
    </div>
  );
}
