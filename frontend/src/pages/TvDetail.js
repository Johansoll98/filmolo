import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetail.css'; // Используем те же стили
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ReviewsSection from '../components/ReviewsSection'; // <-- Импортируем секцию отзывов

function TvDetail() {
  const { id } = useParams();
  const API_KEY = '297abb2aa4a2c8533a6ea80ed32d649f';

  // Получаем данные о пользователе и статус авторизации
  const { user, isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Состояния для актёров и рекомендаций
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Состояния для рейтинга
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // 1) Получение деталей сериала
  useEffect(() => {
    async function fetchShow() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(data.status_message);
        } else {
          setShow(data);
        }
      } catch (err) {
        setError('Failed to fetch TV show details');
      } finally {
        setLoading(false);
      }
    }
    setError('');
    setLoading(true);
    fetchShow();
  }, [id, API_KEY]);

  // 2) Получение трейлера
  useEffect(() => {
    async function fetchTrailer() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        if (data.results) {
          const trailer = data.results.find(
            (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
      } catch (err) {
        console.error('Failed to fetch TV show videos', err);
      }
    }
    fetchTrailer();
  }, [id, API_KEY]);

  // 3) Получение актёров
  useEffect(() => {
    async function fetchCast() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`
        );
        const data = await res.json();
        if (data.cast) {
          setCast(data.cast);
        }
      } catch (err) {
        console.error('Failed to fetch cast', err);
      }
    }
    fetchCast();
  }, [id, API_KEY]);

  // 4) Получение рекомендаций
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        if (data.results) {
          setRecommendations(data.results);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      }
    }
    fetchRecommendations();
  }, [id, API_KEY]);

  // 5) Получение среднего рейтинга (из нашего бэкенда)
  useEffect(() => {
    async function fetchAverageRating() {
      try {
        const res = await fetch(`/api/ratings/average/tv/${id}`);
        const data = await res.json();
        if (data.success) {
          setAverageRating(data.average);
        }
      } catch (err) {
        console.error('Failed to fetch average rating for TV show', err);
      }
    }
    fetchAverageRating();
  }, [id]);

  // Обработка отправки рейтинга
  const handleSubmitRating = () => {
    if (!isAuthenticated) {
      alert('Please log in to rate!');
      return;
    }
    const token = user?.token;
    fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mediaId: parseInt(id, 10),
        mediaType: 'tv',
        rating: userRating
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Перезапрашиваем средний рейтинг
          return fetch(`/api/ratings/average/tv/${id}`);
        } else {
          throw new Error(data.error || 'Error saving rating');
        }
      })
      .then(res => res.json())
      .then(avgData => {
        if (avgData.success) {
          setAverageRating(avgData.average);
        }
      })
      .catch(err => {
        console.error('Error saving rating (TV):', err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message" style={{ color: 'red' }}>{error}</p>;

  // Подготовка данных для отображения
  const posterUrl = show?.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null;
  const releaseYear = show?.first_air_date
    ? show.first_air_date.slice(0, 4)
    : 'N/A';
  const genres = show?.genres
    ? show.genres.map((g) => g.name).join(', ')
    : 'N/A';

  return (
    <div className="movie-detail-container">
      <main className="movie-detail">
        <div className="movie-detail-image">
          {posterUrl ? (
            <img src={posterUrl} alt={`${show.name} Poster`} />
          ) : (
            <div className="no-poster">No Image Available</div>
          )}
        </div>
        <div className="movie-detail-info">
          <h2>
            {show.name} <span className="year">({releaseYear})</span>
          </h2>
          {show.tagline && <p className="tagline">"{show.tagline}"</p>}
          <p>
            <strong>Episode Runtime:</strong>{' '}
            {show.episode_run_time && show.episode_run_time.length
              ? show.episode_run_time[0] + ' min'
              : 'N/A'}
          </p>
          <p><strong>Genres:</strong> {genres}</p>
          <p>
            <strong>TMDb Rating:</strong>{' '}
            {show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}
          </p>
          <p className="plot">
            <strong>Overview:</strong> {show.overview}
          </p>
          {show.production_companies && show.production_companies.length > 0 && (
            <p>
              <strong>Production:</strong>{' '}
              {show.production_companies.map(pc => pc.name).join(', ')}
            </p>
          )}
          <p><strong>Original Language:</strong> {show.original_language.toUpperCase()}</p>

          {trailerKey && (
            <div className="trailer-container">
              <h3>Trailer</h3>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Рейтинг для сериалов */}
          <div className="rating-section">
            <h3>Your Rating</h3>
            <StarRating
              maxRating={10}
              currentRating={userRating}
              onRatingSelect={(rating) => setUserRating(rating)}
            />
            <button className="rate-btn" onClick={handleSubmitRating}>Rate</button>
            <p>Average Rating: {averageRating.toFixed(1)} / 10</p>
          </div>
        </div>
      </main>

      {/* Секция актерского состава */}
      {cast.length > 0 && (
        <section className="cast-section">
          <h3>Cast</h3>
          <div className="cast-container">
            {cast.slice(0, 5).map((actor) => (
              <div key={actor.id} className="cast-card">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                  />
                ) : (
                  <div className="no-actor-image">No Image</div>
                )}
                <p className="actor-name">{actor.name}</p>
                <p className="character">as {actor.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Секция рекомендаций */}
      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <h3>Recommendations</h3>
          <div className="recommendations-container">
            {recommendations.slice(0, 5).map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <Link to={`/tv/${rec.id}`}>
                  {rec.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                      alt={rec.name}
                    />
                  ) : (
                    <div className="no-poster">No Image</div>
                  )}
                </Link>
                <p className="rec-title">{rec.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Секция отзывов (по аналогии с MovieDetail) */}
      <ReviewsSection showId={parseInt(id, 10)} />
    </div>
  );
}

export default TvDetail;
