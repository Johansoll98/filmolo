import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

export default function MediaRating({ mediaId, mediaType, onRatingUpdate }) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка рейтинга пользователя
  useEffect(() => {
    const loadRating = async () => {
      if (!user || !mediaId) return;
      try {
        const response = await fetch(`/api/ratings?userId=${user.id}&mediaId=${mediaId}&mediaType=${mediaType}`);
        const data = await response.json();
        setUserRating(data.rating || 0);
      } catch (error) {
        console.error('Error loading rating:', error);
      }
    };
    loadRating();
  }, [user, mediaId, mediaType]);

  // Отправка рейтинга
  const handleRate = async (rating) => {
    if (!user) {
      alert('Please login to rate!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          mediaId,
          mediaType,
          rating
        })
      });

      const data = await response.json();
      if (data.success) {
        setUserRating(rating);
        onRatingUpdate(); // Обновляем средний рейтинг
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="media-rating">
      <StarRating 
        currentRating={userRating} 
        onRatingSelect={handleRate}
        disabled={isLoading}
      />
      {userRating > 0 && <p>Your rating: {userRating}/10</p>}
    </div>
  );
}