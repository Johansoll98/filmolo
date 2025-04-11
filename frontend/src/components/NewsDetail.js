import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetail.css';

function NewsDetail() {
  const { mediaType, id } = useParams(); // маршруты: /news/:mediaType/:id
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDetail() {
      try {
        const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success === false || data.status_code) {
          setError('Content not found');
        } else {
          setDetail(data);
        }
      } catch (err) {
        setError('Failed to fetch details');
      }
    }
    fetchDetail();
  }, [mediaType, id]);

  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  }
  if (!detail) {
    return <p style={{ padding: '20px', color: '#fff' }}>Loading details...</p>;
  }

  // Определяем, фильм или сериал
  const isMovie = mediaType === 'movie';

  // Постер
  const posterPath = detail.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : null;
  // Заголовок и год выпуска
  const title = isMovie ? detail.title : detail.name;
  const releaseDate = isMovie ? detail.release_date : detail.first_air_date;
  const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';

  // Дополнительная информация
  const tagline = detail.tagline || '';
  const genres = detail.genres ? detail.genres.map((g) => g.name).join(', ') : 'N/A';
  const status = detail.status || 'N/A';
  const popularity = detail.popularity || 'N/A';
  const voteAverage = detail.vote_average ? detail.vote_average.toFixed(1) : 'N/A';
  const voteCount = detail.vote_count || 'N/A';
  const homepage = detail.homepage || '';

  const overview = detail.overview || 'No overview available.';

  return (
    <div className="news-detail-container">
      {/* Левая колонка: постер */}
      <div className="news-detail-image">
        {posterPath ? (
          <img src={posterPath} alt={title} />
        ) : (
          <div className="no-news-poster">No Image</div>
        )}
      </div>

      {/* Правая колонка: информация */}
      <div className="news-detail-info">
        <h2>{title} {year !== 'N/A' && `(${year})`}</h2>
        {tagline && <p className="news-tagline">"{tagline}"</p>}
        <p><strong>Genres:</strong> {genres}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Overview:</strong> {overview}</p>
        <p><strong>Popularity:</strong> {popularity}</p>
        <p><strong>Vote Average:</strong> {voteAverage} / 10</p>
        <p><strong>Vote Count:</strong> {voteCount}</p>
        {homepage && (
          <p>
            <strong>Homepage:</strong>{' '}
            <a href={homepage} target="_blank" rel="noreferrer" className="news-link">
              {homepage}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default NewsDetail;
