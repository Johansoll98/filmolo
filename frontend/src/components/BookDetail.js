import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetail.css'; // Ваши стили

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await res.json();
        if (data.id) {
          setBook(data);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to fetch book details');
      }
    }
    fetchBook();
  }, [id]);

  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  }
  if (!book) {
    return <p style={{ padding: '20px' }}>Loading book...</p>;
  }

  const volumeInfo = book.volumeInfo || {};
  const title = volumeInfo.title || 'No Title';
  const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
  const description = volumeInfo.description || 'No Description';
  const categories = volumeInfo.categories ? volumeInfo.categories.join(', ') : 'No Categories';
  const previewLink = volumeInfo.previewLink || '';
  const infoLink = volumeInfo.infoLink || '';
  const thumbnail = volumeInfo.imageLinks?.thumbnail || null;

  // Год выпуска
  const publishedDate = volumeInfo.publishedDate || 'N/A';
  // Если хотите только год, берём всё до первого дефиса
  const publishedYear = publishedDate.split('-')[0]; 

  return (
    <div className="book-detail-container">
      <div className="book-detail-image">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div className="no-book-cover">No Image</div>
        )}
      </div>

      <div className="book-detail-info">
        <h2>{title}</h2>
        <p>
          <strong>Author(s):</strong> {authors}
        </p>
        <p>
          <strong>Published:</strong> {publishedYear}
        </p>
        <p>
          <strong>Categories:</strong> {categories}
        </p>
        <div
          className="book-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="links-container">
          {previewLink && (
            <a href={previewLink} target="_blank" rel="noreferrer" className="book-link">
              Preview this book
            </a>
          )}
          {infoLink && (
            <a href={infoLink} target="_blank" rel="noreferrer" className="book-link">
              View on Google Books
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
