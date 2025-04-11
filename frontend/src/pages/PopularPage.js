import React, { useEffect, useState, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import './PopularPage.css';

function PopularPage() {
  const [items, setItems] = useState([]); // Храним вместе фильмы и сериалы
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Для сортировки
  const [sortOption, setSortOption] = useState('pop-desc');

  // Ваш TMDb ключ
  const API_KEY = '297abb2aa4a2c8533a6ea80ed32d649f';

  // При первом рендере загрузим первую страницу
  useEffect(() => {
    loadMore(); 
    // eslint-disable-next-line
  }, []);

  /**
   * Загрузка популярных фильмов и сериалов для заданной страницы.
   * После получения объединяем, удаляем дубликаты и сохраняем в items.
   */
  async function loadPopular(pageNumber) {
    setLoading(true);
    setError('');

    try {
      // Запрос популярных фильмов
      const movieUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`;
      const movieRes = await fetch(movieUrl);
      const movieData = await movieRes.json();

      // Запрос популярных сериалов
      const tvUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`;
      const tvRes = await fetch(tvUrl);
      const tvData = await tvRes.json();

      if (!movieData.results || !tvData.results) {
        setError(movieData.status_message || tvData.status_message || 'No data found.');
        return;
      }

      // Проставим media_type для различения
      const movieResults = movieData.results.map((m) => ({ ...m, media_type: 'movie' }));
      const tvResults = tvData.results.map((t) => ({ ...t, media_type: 'tv' }));

      // Объединяем
      const combined = [...movieResults, ...tvResults];

      // Добавляем к старому списку и убираем дубли
      setItems((prev) => {
        // Все вместе
        const merged = [...prev, ...combined];

        // Удаляем дубли по (media_type + id)
        const uniqueMap = new Map();
        for (const item of merged) {
          const key = `${item.media_type}_${item.id}`;
          // Если такого ещё нет, добавляем
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        }
        // Возвращаем только уникальные
        return Array.from(uniqueMap.values());
      });

      setPage(pageNumber);
    } catch (err) {
      console.error('Error fetching popular data:', err);
      setError('Failed to load popular items.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * При клике "Load More" грузим следующую страницу.
   */
  function loadMore() {
    loadPopular(page + 1);
  }

  /**
   * Сортируем общий список items по выбранному критерию.
   */
  const sortedItems = useMemo(() => {
    const sorted = [...items];

    // Подготовим unifiedTitle, unifiedDate
    sorted.forEach((obj) => {
      obj.unifiedTitle = obj.title || obj.name || 'Untitled';
      obj.unifiedDate = obj.release_date || obj.first_air_date || '';
      obj.unifiedYear = obj.unifiedDate.slice(0, 4) || '0000';
    });

    switch (sortOption) {
      case 'pop-desc':
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'pop-asc':
        sorted.sort((a, b) => a.popularity - b.popularity);
        break;
      case 'year-desc':
        sorted.sort((a, b) => parseInt(b.unifiedYear) - parseInt(a.unifiedYear));
        break;
      case 'year-asc':
        sorted.sort((a, b) => parseInt(a.unifiedYear) - parseInt(b.unifiedYear));
        break;
      case 'title-az':
        sorted.sort((a, b) => a.unifiedTitle.localeCompare(b.unifiedTitle));
        break;
      case 'title-za':
        sorted.sort((a, b) => b.unifiedTitle.localeCompare(a.unifiedTitle));
        break;
      default:
        break;
    }
    return sorted;
  }, [items, sortOption]);

  return (
    <div className="popular-page">
      <h2>Popular Movies & TV Shows</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="sort-container">
        <label>Sort by: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="pop-desc">Popularity (desc)</option>
          <option value="pop-asc">Popularity (asc)</option>
          <option value="year-desc">Year (Newest first)</option>
          <option value="year-asc">Year (Oldest first)</option>
          <option value="title-az">Title (A–Z)</option>
          <option value="title-za">Title (Z–A)</option>
        </select>
      </div>

      <div className="popular-grid">
        {sortedItems.map((item) => (
          <MovieCard key={`${item.media_type}_${item.id}`} movie={item} />
        ))}
      </div>

      <div className="load-more-container">
        {!error && !loading && (
          <button onClick={loadMore} className="load-more">
            LOAD MORE
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default PopularPage;
