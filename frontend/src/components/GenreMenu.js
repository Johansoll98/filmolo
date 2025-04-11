// GenreMenu.js
import React, { useEffect, useState } from 'react';

function GenreMenu({ onSelectGenre }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Загружаем список жанров
    async function fetchGenres() {
      const res = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=ВАШ_КЛЮЧ&language=en-US'
      );
      const data = await res.json();
      setGenres(data.genres || []);
    }
    fetchGenres();
  }, []);

  return (
    <div className="genre-menu">
      <h3>Genres</h3>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelectGenre(g.id)}
          style={{ display: 'block', margin: '5px 0' }}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}

export default GenreMenu;
