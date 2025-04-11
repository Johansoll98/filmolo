import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ReviewsSection from '../components/ReviewsSection'; // Импортируем компонент отзывов
import { useAuth } from '../context/AuthContext';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const API_KEY = '297abb2aa4a2c8533a6ea80ed32d649f';
  const { user, isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Состояния для трейлера, актерского состава и рекомендаций
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Состояния для рейтинга
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(data.status_message);
        } else {
          setMovie(data);
        }
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    }

    async function fetchVideos() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
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
        console.error('Failed to fetch movie videos', err);
      }
    }

    async function fetchCast() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
        );
        const data = await res.json();
        if (data.cast) {
          setCast(data.cast);
        }
      } catch (err) {
        console.error('Failed to fetch cast', err);
      }
    }

    async function fetchRecommendations() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        if (data.results) {
          setRecommendations(data.results);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      }
    }

    async function fetchAverageRating() {
      try {
        const res = await fetch(
          `/api/ratings/average/movie/${id}`
        );
        const data = await res.json();
        if (data.success) {
          setAverageRating(data.average);
        }
      } catch (err) {
        console.error('Failed to fetch average rating', err);
      }
    }

    setError('');
    setLoading(true);

    fetchMovie();
    fetchVideos();
    fetchCast();
    fetchRecommendations();
    fetchAverageRating();
  }, [id, API_KEY]);

  const handleSubmitRating = () => {
    if (!isAuthenticated) {
      alert('Please log in to rate!');
      return;
    }
    const token = user.token;
    fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mediaId: parseInt(id, 10),
        mediaType: 'movie',
        rating: userRating
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          return fetch(`/api/ratings/average/movie/${id}`);
        }
      })
      .then((res) => res.json())
      .then((avgData) => {
        if (avgData.success) {
          setAverageRating(avgData.average);
        }
      })
      .catch((err) => {
        console.error('Error saving rating:', err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const genres = movie.genres ? movie.genres.map((g) => g.name).join(', ') : 'N/A';

  return (
    <div className="movie-detail-container">
      <main className="movie-detail">
        <div className="movie-detail-image">
          {posterUrl ? (
            <img src={posterUrl} alt={`${movie.title} Poster`} />
          ) : (
            <div className="no-poster">No Image Available</div>
          )}
        </div>
        <div className="movie-detail-info">
          <h2>
            {movie.title} <span className="year">({releaseYear})</span>
          </h2>
          {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
          <p>
            <strong>Runtime:</strong>{' '}
            {movie.runtime ? movie.runtime + ' min' : 'N/A'}
          </p>
          <p>
            <strong>Genres:</strong> {genres}
          </p>
          <p>
            <strong>TMDb Rating:</strong>{' '}
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </p>
          <p className="plot">
            <strong>Overview:</strong> {movie.overview}
          </p>
          {movie.production_companies && movie.production_companies.length > 0 && (
            <p>
              <strong>Production:</strong>{' '}
              {movie.production_companies.map((pc) => pc.name).join(', ')}
            </p>
          )}
          <p>
            <strong>Original Language:</strong>{' '}
            {movie.original_language.toUpperCase()}
          </p>

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

          {/* Рейтинг */}
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
              <Link
                key={rec.id}
                to={`/movie/${rec.id}`}
                className="recommendation-card-link"
              >
                <div className="recommendation-card">
                  {rec.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                      alt={rec.title}
                    />
                  ) : (
                    <div className="no-poster">No Image</div>
                  )}
                  <p className="rec-title">{rec.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Секция отзывов */}
      <ReviewsSection movieId={parseInt(id, 10)} />
    </div>
  );
}

export default MovieDetail;
