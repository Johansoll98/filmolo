// TvShowsPage.js
import React, { useEffect, useState, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import './TvShowsPage.css';

function TvShowsPage() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0); // общее число найденных сериалов
  const [sortOption, setSortOption] = useState('year-desc');

  // Для категорий (жанров)
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // TMDb API
  const API_KEY = '297abb2aa4a2c8533a6ea80ed32d649f';
  const TV_POPULAR_URL = 'https://api.themoviedb.org/3/tv/popular';
  const TV_DISCOVER_URL = 'https://api.themoviedb.org/3/discover/tv';
  const INITIAL_PAGES = 3;

  // 1) Загружаем несколько страниц популярных сериалов
  async function loadInitialPages(numPages) {
    setLoading(true);
    setError('');
    let allResults = [];
    try {
      for (let p = 1; p <= numPages; p++) {
        const url = `${TV_POPULAR_URL}?api_key=${API_KEY}&language=en-US&page=${p}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          allResults = allResults.concat(data.results);
          // Если у API есть total_results, сохраняем
          if (data.total_results) {
            setTotalResults(data.total_results);
          }
        } else {
          setError(data.status_message || 'No TV shows found.');
          break;
        }
      }
      setShows(allResults);
      setPage(numPages); // после загрузки нескольких страниц, текущая страница = numPages
    } catch (err) {
      console.error('Error fetching TV shows:', err);
      setError('Failed to load TV shows');
    } finally {
      setLoading(false);
    }
  }

  // 2) Загрузка списка жанров (для Category)
  async function loadGenres() {
    try {
      const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.genres) {
        setGenres(data.genres);
      }
    } catch (err) {
      console.error('Error fetching TV genres:', err);
    }
  }

  // 3) Загрузка сериалов по жанру
  async function loadShowsByGenre(genreId) {
    setLoading(true);
    setError('');
    setShows([]);
    setPage(1); // начинаем с 1-й страницы
    try {
      const url = `${TV_DISCOVER_URL}?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        setShows(data.results);
        if (data.total_results) {
          setTotalResults(data.total_results);
        }
      } else {
        setError(data.status_message || 'No TV shows found for this genre.');
      }
      setSelectedGenre(genreId);
    } catch (err) {
      console.error('Error fetching shows by genre:', err);
      setError('Failed to load TV shows by genre.');
    } finally {
      setLoading(false);
    }
  }

  // 4) Load More (дозагрузка)
  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoading(true);
    setError('');

    // Если выбран жанр, грузим discover; иначе — popular
    const baseUrl = selectedGenre ? TV_DISCOVER_URL : TV_POPULAR_URL;
    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
    const url = `${baseUrl}?api_key=${API_KEY}&language=en-US&page=${nextPage}${genreParam}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        setShows((prev) => [...prev, ...data.results]);
        setPage(nextPage);
        if (data.total_results) {
          setTotalResults(data.total_results);
        }
      } else {
        setError(data.status_message || 'No more TV shows found.');
      }
    } catch (err) {
      console.error('Error fetching more shows:', err);
      setError('Failed to load more TV shows.');
    } finally {
      setLoading(false);
    }
  }

  // Вызовем loadInitialPages и loadGenres при первом рендере
  useEffect(() => {
    loadInitialPages(INITIAL_PAGES);
    loadGenres();
    // eslint-disable-next-line
  }, []);

  // 5) Сортировка
  const sortedShows = useMemo(() => {
    let sorted = [...shows];
    switch (sortOption) {
      case 'year-desc':
        sorted.sort((a, b) => {
          const yearA = a.first_air_date ? parseInt(a.first_air_date.slice(0, 4), 10) : 0;
          const yearB = b.first_air_date ? parseInt(b.first_air_date.slice(0, 4), 10) : 0;
          return yearB - yearA;
        });
        break;
      case 'year-asc':
        sorted.sort((a, b) => {
          const yearA = a.first_air_date ? parseInt(a.first_air_date.slice(0, 4), 10) : 0;
          const yearB = b.first_air_date ? parseInt(b.first_air_date.slice(0, 4), 10) : 0;
          return yearA - yearB;
        });
        break;
      case 'title-az':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'title-za':
        sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        break;
    }
    return sorted;
  }, [shows, sortOption]);

  if (loading && page === 0) {
    return (
      <div className="tv-shows-page">
        <h2>TV Shows</h2>
        <p>Loading TV shows...</p>
      </div>
    );
  }

  return (
    <div className="tv-shows-page">
      <h2>TV Shows</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="top-controls">
        <div className="sort-container">
          <label htmlFor="sort-select">Sort by: </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="year-desc">Year (Newest first)</option>
            <option value="year-asc">Year (Oldest first)</option>
            <option value="title-az">Title (A–Z)</option>
            <option value="title-za">Title (Z–A)</option>
          </select>
        </div>
        <div className="category-container">
          <button className="category-btn" onClick={() => setShowGenres((prev) => !prev)}>
            Category
          </button>
          {showGenres && (
            <div className="dropdown-menu">
              {genres.map((g) => (
                <div
                  key={g.id}
                  className="dropdown-item"
                  onClick={() => {
                    loadShowsByGenre(g.id);
                    setShowGenres(false);
                  }}
                >
                  {g.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="tv-shows-grid">
        {sortedShows.map((show) => (
          <MovieCard key={show.id} movie={{ ...show, media_type: 'tv' }} />
        ))}
      </div>

      {/* Блок Load More */}
      <div className="load-more-container">
        {!error && !loading && shows.length > 0 && shows.length < totalResults && (
          <button onClick={handleLoadMore} className="load-more">
            LOAD MORE
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default TvShowsPage;
