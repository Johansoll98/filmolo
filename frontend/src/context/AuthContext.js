import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user from localStorage
  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('user');
      }
    };
    initializeUser();
  }, []);

  // Common function to handle auth responses
  const handleAuthResponse = async (response) => {
    const rawData = await response.text();
    console.log('Server raw response:', rawData);

    let data;
    try {
      data = JSON.parse(rawData);
    } catch (err) {
      throw new Error(`Сервер вернул некорректные данные: ${rawData.slice(0, 100)}`);
    }

    if (!response.ok) {
      const serverMessage = data?.message || data?.error || `Ошибка ${response.status}`;
      throw new Error(serverMessage);
    }

    // Ожидаем объект вида: { user: { id, username, email, ... }, token: "<JWT>" }
    const userData = data.user || data;
    if (!userData?.id || !userData?.email) {
      throw new Error('Отсутствуют обязательные данные пользователя');
    }

    // Берем токен из data.token
    const normalizedUser = {
      id: userData.id,
      username: userData.username || 'Новый пользователь',
      email: userData.email,
      createdAt: userData.createdAt,
      token: data.token || null,
    };

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  // Registration function
  const register = async (username, email, password) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      return await handleAuthResponse(response);
    } catch (error) {
      throw new Error(error.message || 'Ошибка регистрации');
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await handleAuthResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Неверный email или пароль');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
