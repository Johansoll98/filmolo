import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
  const title = movie.title || movie.name || 'Untitled';
  const date = movie.release_date || movie.first_air_date || '';
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : null;

  // Формируем ссылку в зависимости от типа
  const detailLink = movie.media_type === 'tv' 
    ? `/tv/${movie.id}` 
    : `/movie/${movie.id}`;

  return (
    <Link to={detailLink} className="movie-card-link">
      <div className="movie-card">
        {posterUrl ? (
          <img src={posterUrl} alt={title} />
        ) : (
          <div className="no-poster">No Image Available</div>
        )}
        <h3>{title}</h3>
        <p>{date ? date.slice(0, 4) : 'N/A'}</p>
      </div>
    </Link>
  );
}

export default MovieCard;
