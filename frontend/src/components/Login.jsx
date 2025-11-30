import React, { useState } from 'react';
import { bookService } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await bookService.post(endpoint, { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        onLogin(response.data.role);
      } else {
        setError(response.data.error || 'Something went wrong');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Network error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
      >
        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
};

export default Login;