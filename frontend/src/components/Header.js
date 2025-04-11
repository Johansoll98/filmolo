import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import './Header.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Please enter the title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="header">
      <nav className="nav-container">
        {/* Слева: Логотип/Home */}
        <div className="left-nav">
          <Link to="/" className="nav-link logo">
            Filmolo
          </Link>
        </div>

        {/* По центру: Навигационные ссылки и поисковая строка */}
        <div className="center-nav">
          <Link to="/movies" className="nav-link">
            Films
          </Link>
          <Link to="/tv-shows" className="nav-link">
            Tv Shows
          </Link>
          <Link to="/popular" className="nav-link">
            Popular
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          {/* Поисковая строка */}
          <SearchBar />
        </div>

        {/* Справа: Блок авторизации / профиль */}
        <div className="right-nav">
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
