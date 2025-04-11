import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ReviewsSection(props) {
  // Используем movieId, если он передан, иначе showId
  const reviewId = props.movieId || props.showId;
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');

  // Загружаем отзывы по reviewId (TMDB ID фильма или сериала)
  useEffect(() => {
    if (!reviewId) return;
    fetch(`/api/reviews?showId=${reviewId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        } else {
          console.error('Error fetching reviews:', data.error);
        }
      })
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [reviewId]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to leave a review.');
      return;
    }
    const token = user.token;
    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        showId: reviewId,
        text: newReviewText
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Review created') {
          setReviews((prev) => [data.review, ...prev]);
          setNewReviewText('');
        } else {
          console.error('Error creating review:', data.error);
        }
      })
      .catch((err) => console.error('Error creating review:', err));
  };

  return (
    <div
      className="reviews-section"
      style={{ margin: '40px auto', maxWidth: '800px', width: '90%' }}
    >
      <h3 style={{ textAlign: 'center' }}>
        Have you seen it? Share your opinion!
      </h3>
      {isAuthenticated ? (
        <form onSubmit={handleReviewSubmit} style={{ marginBottom: '20px' }}>
          <textarea
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            rows="3"
            placeholder="Write your review..."
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit" className="submit-review-btn">
            Submit Review
          </button>
        </form>
      ) : (
        <p style={{ textAlign: 'center' }}>Please log in to leave a review.</p>
      )}
      <div className="reviews-list" style={{ marginTop: '20px' }}>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              style={{
                marginBottom: '15px',
                borderBottom: '1px solid #ccc',
                paddingBottom: '10px'
              }}
            >
              <p>
                <strong>{review.userId?.username || 'Anonymous'}:</strong>
              </p>
              <p>{review.text}</p>
              <small>{new Date(review.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;
