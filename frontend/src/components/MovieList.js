import React from 'react';
import MovieCard from './MovieCard';

function MovieList({ movies }) {
  return (
    <div>
      <h2>Movie List</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}

export default MovieList;
