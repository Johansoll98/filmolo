import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NewsPage.css';

// Пример категорий Trending: media: "all", "movie", "tv" и timeWindow: "day", "week".
const CATEGORIES = [
  { label: 'All (day)', media: 'all', time: 'day' },
  { label: 'All (week)', media: 'all', time: 'week' },
  { label: 'Movies (day)', media: 'movie', time: 'day' },
  { label: 'Movies (week)', media: 'movie', time: 'week' },
  { label: 'TV (day)', media: 'tv', time: 'day' },
  { label: 'TV (week)', media: 'tv', time: 'week' },
];

function NewsPage() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({
    media: 'all',
    time: 'day',
  });
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Загружаем новости при монтировании и при смене категории
  useEffect(() => {
    // Сбрасываем страницу при выборе новой категории
    setPage(1);
    fetchNews(selectedCategory.media, selectedCategory.time, 1);
    // eslint-disable-next-line
  }, [selectedCategory]);

  // Функция загрузки новостей
  async function fetchNews(media, timeWindow, pageNum) {
    setError('');
    try {
      const url = `https://api.themoviedb.org/3/trending/${media}/${timeWindow}?api_key=297abb2aa4a2c8533a6ea80ed32d649f&page=${pageNum}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results) {
        if (pageNum === 1) {
          // Первая страница
          setNews(data.results);
        } else {
          // Добавляем к существующим при загрузке следующей страницы
          setNews((prev) => [...prev, ...data.results]);
        }
        setTotalResults(data.total_results || 0);
      } else {
        setError(data.status_message || 'No news found');
      }
    } catch (err) {
      setError('Failed to fetch news');
    }
  }

  // Обработчик смены категории
  const handleCategoryChange = (e) => {
    const [media, time] = e.target.value.split(':');
    setSelectedCategory({ media, time });
  };

  // Кнопка Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(selectedCategory.media, selectedCategory.time, nextPage);
  };

  // Пример: Random Picks (случайная категория)
  const handleRandomPicks = () => {
    setError('');
    setNews([]);
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setSelectedCategory(randomCat);
    setPage(1);
    fetchNews(randomCat.media, randomCat.time, 1);
  };

  return (
    <div className="news-container">
      <h2>Latest News</h2>

      {/* Выбор категории */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '8px' }}>Category: </label>
        <select
          value={`${selectedCategory.media}:${selectedCategory.time}`}
          onChange={handleCategoryChange}
          style={{ padding: '5px' }}
        >
          {CATEGORIES.map((cat) => (
            <option key={`${cat.media}:${cat.time}`} value={`${cat.media}:${cat.time}`}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Кнопка "Random Picks" (необязательно) */}
        <button
          onClick={handleRandomPicks}
          style={{ marginLeft: '10px', padding: '5px 15px' }}
        >
          Random Picks
        </button>
      </div>

      {/* Ошибка */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Сетка новостей */}
      {news.length === 0 && !error ? (
        <p>Loading news...</p>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div key={item.id} className="news-card">
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
                />
              ) : (
                <div className="news-no-image">No Image</div>
              )}
              <div className="news-content">
                <h3>{item.title || item.name}</h3>
                <p>
                  {item.overview
                    ? item.overview.slice(0, 100) + '...'
                    : 'No summary available.'}
                </p>
                {/* Используем media_type + id */}
                <Link
                  to={`/news/${item.media_type}/${item.id}`}
                  className="read-more"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Кнопка Load More, если ещё есть результаты */}
      {news.length > 0 && news.length < totalResults && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button onClick={handleLoadMore} className="load-more">
            Load More
          </button>

        </div>
      )}
    </div>
  );
}

export default NewsPage;
