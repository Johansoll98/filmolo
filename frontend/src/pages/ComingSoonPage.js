import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Можно определить несколько категорий (Movies vs. TV). 
// У TV нет точного "upcoming", но можно взять "airing_today" или "on_the_air" в TMDb.
const COMING_CATEGORIES = [
  { label: 'Movies', value: 'movies' },
  { label: 'TV Airing Today', value: 'airing' },
  { label: 'TV On The Air (soon)', value: 'on_the_air' },
];

function ComingSoonPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('movies'); // по умолчанию показываем фильмы

  // При первом рендере грузим фильмы
  useEffect(() => {
    fetchItems(selectedCategory, 1);
    // eslint-disable-next-line
  }, []);

  // При смене категории
  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    setPage(1);
    setItems([]);
    fetchItems(newCat, 1);
  };

  // Запрос
  async function fetchItems(category, pageNum) {
    setError('');
    try {
      let url = '';
      if (category === 'movies') {
        // Upcoming movies
        url = `https://api.themoviedb.org/3/movie/upcoming?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US&page=${pageNum}`;
      } else if (category === 'airing') {
        // TV - airing today
        url = `https://api.themoviedb.org/3/tv/airing_today?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US&page=${pageNum}`;
      } else if (category === 'on_the_air') {
        // TV - on the air
        url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US&page=${pageNum}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.results) {
        if (pageNum === 1) {
          setItems(data.results);
        } else {
          setItems((prev) => [...prev, ...data.results]);
        }
        setTotalResults(data.total_results || 0);
      } else {
        setError(data.status_message || 'No upcoming content found');
      }
    } catch (err) {
      setError('Failed to fetch upcoming content');
    }
  }

  // Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(selectedCategory, nextPage);
  };

  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  }

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h2>Coming Soon</h2>
      {/* Категории (movies / airing / on_the_air) */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="coming-category" style={{ marginRight: '8px' }}>
          Category:
        </label>
        <select
          id="coming-category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ padding: '5px' }}
        >
          {COMING_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <p>Loading upcoming titles...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          }}
        >
          {items.map((item) => {
            // Если category === 'movies', item - это movie
            // Если category === 'airing' or 'on_the_air', item - это tv
            const isMovie = selectedCategory === 'movies';
            const title = isMovie ? item.title : item.name;
            const poster = item.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : null;

            const overview = item.overview ? item.overview.slice(0, 80) + '...' : 'No summary';
            // mediaType, чтобы детальная страница знала, что открывать
            const mediaType = isMovie ? 'movie' : 'tv';

            return (
              <Link
                key={item.id}
                to={`/${mediaType}/${item.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {poster ? (
                  <img
                    src={poster}
                    alt={title}
                    style={{ width: '100%', objectFit: 'cover', height: '220px' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '220px',
                      backgroundColor: '#444',
                      color: '#ccc',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    No Image
                  </div>
                )}
                <div style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '1rem', margin: '10px 0', color: '#fff' }}>{title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{overview}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Кнопка Load More */}
      {items.length > 0 && items.length < totalResults && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button
            onClick={handleLoadMore}
            style={{ padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default ComingSoonPage;
