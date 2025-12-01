import React, { useState } from 'react';
import { bookService } from '../services/api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [passportSeria, setPassportSeria] = useState('');
    const [passportNumber, setPassportNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const data = isLogin
                ? { username, password }
                : {
                    username,
                    password,
                    firstName,
                    lastName,
                    fatherName,
                    passportSeria,
                    passportNumber
                };

            const response = await bookService.post(endpoint, data);
            console.log('Login response:', response.data);
            console.log('Token:', response.data.token);
            console.log('Role:', response.data.role);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.role);
                onLogin(response.data.role);
            } else {
                setError(response.data.error || 'Something went wrong');
            }
        } catch (error) {
            console.log("Error details:", error);
            setError(error.response?.data || 'Network error');
        }
    };

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setFatherName('');
        setPassportSeria('');
        setPassportNumber('');
        setError('');
    };

    const handleToggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
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

                {/* НОВЫЕ ПОЛЯ ДЛЯ РЕГИСТРАЦИИ */}
                {!isLogin && (
                    <>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Имя"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Фамилия"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Отчество"
                                value={fatherName}
                                onChange={(e) => setFatherName(e.target.value)}
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Серия паспорта (4 цифры)"
                                value={passportSeria}
                                onChange={(e) => setPassportSeria(e.target.value)}
                                required
                                maxLength={4}
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Номер паспорта (6 цифр)"
                                value={passportNumber}
                                onChange={(e) => setPassportNumber(e.target.value)}
                                required
                                maxLength={6}
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>
                    </>
                )}

                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>

            <button
                onClick={handleToggleMode}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
            >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
        </div>
    );
};

export default Login;