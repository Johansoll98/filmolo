import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Добавьте правильный путь
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Перенаправление на главную после успеха
    } catch (err) {
      setMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          className="auth-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          className="auth-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button 
        type="submit" 
        className="auth-button"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Sign In'}
      </button>
      
      {message && <p className="form-error">{message}</p>}
    </form>
  );
}

export default LoginForm;