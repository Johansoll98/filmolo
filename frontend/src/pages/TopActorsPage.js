import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Popular (people)', value: 'popular' },
  { label: 'Trending People (day)', value: 'trending-day' },
  { label: 'Trending People (week)', value: 'trending-week' },
];

function TopActorsPage() {
  const [actors, setActors] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('popular');

  useEffect(() => {
    // При первом рендере загружаем «popular»
    fetchActors(selectedCategory, 1);
    // eslint-disable-next-line
  }, []);

  // Меняем категорию
  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    setPage(1);
    setActors([]);
    fetchActors(newCat, 1);
  };

  // Загружаем актеров (popular / trending)
  async function fetchActors(category, pageNum) {
    setError('');
    try {
      let url = '';
      if (category === 'popular') {
        url = `https://api.themoviedb.org/3/person/popular?api_key=297abb2aa4a2c8533a6ea80ed32d649f&language=en-US&page=${pageNum}`;
      } else if (category === 'trending-day') {
        url = `https://api.themoviedb.org/3/trending/person/day?api_key=297abb2aa4a2c8533a6ea80ed32d649f&page=${pageNum}`;
      } else if (category === 'trending-week') {
        url = `https://api.themoviedb.org/3/trending/person/week?api_key=297abb2aa4a2c8533a6ea80ed32d649f&page=${pageNum}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        if (pageNum === 1) {
          setActors(data.results);
        } else {
          setActors((prev) => [...prev, ...data.results]);
        }
        setTotalResults(data.total_results || 0);
      } else {
        setError(data.status_message || 'No actors found');
      }
    } catch (err) {
      setError('Failed to fetch actors');
    }
  }

  // Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchActors(selectedCategory, nextPage);
  };

  // Пример Random Picks
  const handleRandomPicks = () => {
    setError('');
    setActors([]);
    const cats = ['popular', 'trending-day', 'trending-week'];
    const randomCat = cats[Math.floor(Math.random() * cats.length)];
    const randomPage = Math.floor(Math.random() * 5) + 1;
    setSelectedCategory(randomCat);
    setPage(randomPage);
    fetchActors(randomCat, randomPage);
  };

  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  }

  return (
    <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h2>Top Actors</h2>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '8px' }}>Category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ padding: '5px' }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleRandomPicks}
          style={{ marginLeft: '10px', padding: '5px 15px', borderRadius: '4px' }}
        >
          Random Picks
        </button>
      </div>

      {actors.length === 0 ? (
        <p>Loading actors...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          }}
        >
          {actors.map((actor) => (
            // Оборачиваем карточку в Link, чтобы сделать её кликабельной
            // предположим, вы создадите маршрут /actor/:id для детальной
            <Link
              key={actor.id}
              to={`/actor/${actor.id}`} // <-- меняем при необходимости
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
              // Hover-эффект (увеличение)
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
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
                <h3 style={{ fontSize: '1rem', margin: '10px 0', color: '#fff' }}>
                  {actor.name}
                </h3>
                {actor.known_for && (
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    Known for:{' '}
                    {actor.known_for.map((kf) => kf.title || kf.name).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Кнопка Load More */}
      {actors.length > 0 && actors.length < totalResults && (
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

export default TopActorsPage;
