import React, { useEffect, useState, useMemo } from 'react';
import MovieCard from '../components/MovieCard';
import './FilmPage.css';

function FilmPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0); // Общее число результатов
  const [sortOption, setSortOption] = useState('year-desc');

  // Для жанров
  const [genres, setGenres] = useState([]);
  const [showGenres, setShowGenres] = useState(false); // флаг открытия меню
  const [selectedGenre, setSelectedGenre] = useState(null);

  const API_KEY = '297abb2aa4a2c8533a6ea80ed32d649f';
  const BASE_URL = 'https://api.themoviedb.org/3/movie/popular';
  const DISCOVER_URL = 'https://api.themoviedb.org/3/discover/movie';
  const INITIAL_PAGES = 3;

  // ============= ИНИЦИАЛЬНАЯ ЗАГРУЗКА ФИЛЬМОВ =============
  async function loadInitialPages(numPages) {
    setLoading(true);
    setError('');
    let allResults = [];
    try {
      for (let p = 1; p <= numPages; p++) {
        const url = `${BASE_URL}?api_key=${API_KEY}&language=en-US&page=${p}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          allResults = allResults.concat(data.results);
          // Сохраняем общее число результатов (если API вернуло)
          if (data.total_results) {
            setTotalResults(data.total_results);
          }
        } else {
          setError(data.status_message || 'No movies found.');
          break;
        }
      }
      setMovies(allResults);
      setPage(numPages); // после цикла мы загрузили numPages, значит следующая будет numPages+1
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  }

  // ============= ЗАГРУЗКА ЖАНРОВ =============
  async function loadGenres() {
    try {
      const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.genres) {
        setGenres(data.genres);
      }
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  }

  // ============= ЗАГРУЗКА ФИЛЬМОВ ПО ЖАНРУ =============
  async function loadMoviesByGenre(genreId) {
    setLoading(true);
    setError('');
    setMovies([]);
    setPage(1); // начинаем с 1-й страницы для данного жанра
    try {
      const url = `${DISCOVER_URL}?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        setMovies(data.results);
        // Если API вернуло общее число результатов, сохраняем
        if (data.total_results) {
          setTotalResults(data.total_results);
        }
      } else {
        setError(data.status_message || 'No movies found.');
      }
      setSelectedGenre(genreId);
    } catch (err) {
      console.error('Error fetching by genre:', err);
      setError('Failed to load movies by genre.');
    } finally {
      setLoading(false);
    }
  }

  // ============= ДОГРУЗКА (LOAD MORE) =============
  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoading(true);
    setError('');

    // Если выбран жанр, грузим discover, иначе popular
    const base = selectedGenre ? DISCOVER_URL : BASE_URL;
    const extraParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
    const url = `${base}?api_key=${API_KEY}&language=en-US&page=${nextPage}${extraParam}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        setMovies((prev) => [...prev, ...data.results]);
        setPage(nextPage);
        // обновляем totalResults, если нужно
        if (data.total_results) {
          setTotalResults(data.total_results);
        }
      } else {
        setError(data.status_message || 'No more movies found.');
      }
    } catch (err) {
      console.error('Error fetching more movies:', err);
      setError('Failed to load more movies.');
    } finally {
      setLoading(false);
    }
  }

  // ============= useEffect =============
  useEffect(() => {
    loadInitialPages(INITIAL_PAGES);
    loadGenres();
    // eslint-disable-next-line
  }, []);

  // ============= СОРТИРОВКА =============
  const sortedMovies = useMemo(() => {
    let sorted = [...movies];
    switch (sortOption) {
      case 'year-desc':
        sorted.sort((a, b) => {
          const yearA = a.release_date ? parseInt(a.release_date.slice(0, 4), 10) : 0;
          const yearB = b.release_date ? parseInt(b.release_date.slice(0, 4), 10) : 0;
          return yearB - yearA;
        });
        break;
      case 'year-asc':
        sorted.sort((a, b) => {
          const yearA = a.release_date ? parseInt(a.release_date.slice(0, 4), 10) : 0;
          const yearB = b.release_date ? parseInt(b.release_date.slice(0, 4), 10) : 0;
          return yearA - yearB;
        });
        break;
      case 'title-az':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-za':
        sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default:
        break;
    }
    return sorted;
  }, [movies, sortOption]);

  // ============= RENDER =============
  return (
    <div className="film-page">
      <h2>All Films</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Блок сортировки и категорий, аналогичный TvShowsPage */}
      <div className="top-controls">
        {/* Сортировка слева */}
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

        {/* Кнопка "Category" справа */}
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
                    loadMoviesByGenre(g.id);
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

      {/* Сетка фильмов */}
      <div className="film-grid">
        {sortedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Кнопка Load More */}
      {movies.length > 0 && movies.length < totalResults && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more">
            LOAD MORE
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default FilmPage;
