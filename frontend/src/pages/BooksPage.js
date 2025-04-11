import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BooksPage.css';

const CATEGORIES = [
  { label: 'Art', value: 'art' },
  { label: 'Comics', value: 'comics' },
  { label: 'Mystery', value: 'mystery' },
  { label: 'Romance', value: 'romance' },
  { label: 'Science', value: 'science' },
  { label: 'History', value: 'history' },
  { label: 'Computers', value: 'computers' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Fiction', value: 'fiction' },
  { label: 'Sci-Fi', value: 'science fiction' },
];

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('art');
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    // Сбрасываем startIndex при смене категории
    setStartIndex(0);
    fetchBooks(selectedCategory, 0);
    // eslint-disable-next-line
  }, [selectedCategory]);

  // Функция для загрузки книг по выбранной категории и стартовому индексу
  async function fetchBooks(category, index) {
    try {
      setError('');
      // Если меняется категория или старт, не обнуляем books, 
      // иначе при "Load More" пропадут старые результаты. 
      // Но если вы хотите обнулять, делайте setBooks([]) перед fetch.
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=20&startIndex=${index}`
      );
      const data = await res.json();

      if (data.items) {
        // Если index=0 (первая загрузка), заменяем книги
        // Иначе добавляем (Load More)
        if (index === 0) {
          setBooks(data.items);
        } else {
          setBooks((prev) => [...prev, ...data.items]);
        }
        setTotalItems(data.totalItems || 0);
      } else {
        setError('No books found');
      }
    } catch (err) {
      setError('Failed to fetch books');
    }
  }

  // Обработчик смены категории
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Кнопка Load More
  const handleLoadMore = () => {
    const newIndex = startIndex + 20;
    setStartIndex(newIndex);
    fetchBooks(selectedCategory, newIndex);
  };

  // Случайные книги
  const fetchRandomBooks = async () => {
    try {
      setError('');
      setBooks([]);
      // Случайная категория
      const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].value;
      // Случайный startIndex
      const randomIndex = Math.floor(Math.random() * 60);
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${randomCat}&maxResults=20&startIndex=${randomIndex}`
      );
      const data = await res.json();
      if (data.items) {
        setBooks(data.items);
        setTotalItems(data.totalItems || 0);
        setSelectedCategory(randomCat);
        setStartIndex(randomIndex);
      } else {
        setError('No random books found');
      }
    } catch (err) {
      setError('Failed to fetch random books');
    }
  };

  return (
    <div className="books-page">
      <h2>Books</h2>
      {/* Выпадающий список категорий */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-select">Category: </label>
        <select
          id="category-select"
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

        {/* Кнопка "Random Picks" */}
        <button
          onClick={fetchRandomBooks}
          style={{ marginLeft: '10px', padding: '5px 15px', borderRadius: '4px' }}
        >
          Random Picks
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Сетка книг */}
      <div className="books-container">
        {books.length === 0 && !error ? (
          <p>Loading books...</p>
        ) : (
          books.map((book) => {
            const volumeInfo = book.volumeInfo || {};
            const title = volumeInfo.title || 'No Title';
            const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
            const thumbnail = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : null;

            return (
              <Link
                to={`/book/${book.id}`}
                key={book.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="book-card">
                  {thumbnail ? (
                    <img className="book-cover" src={thumbnail} alt={title} />
                  ) : (
                    <div
                      className="book-cover"
                      style={{ backgroundColor: '#444', height: '220px' }}
                    >
                      No Image
                    </div>
                  )}
                  <div className="book-info">
                    <p className="book-title">{title}</p>
                    <p className="book-author">{authors}</p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Кнопка Load More (если есть ещё книги) */}
      {books.length > 0 && books.length < totalItems && (
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

export default BooksPage;
