import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { clientService } from '../services/api';

const AnalyticsPanel = () => {
    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [clientStats, setClientStats] = useState(null);
    const [maxFine, setMaxFine] = useState(null);
    const [popularBooks, setPopularBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [clientsRes, maxFineRes, popularRes] = await Promise.all([
                clientService.getAllClients(),
                reportService.getMaxSingleFine(),
                reportService.getTopPopularBooks(3)
            ]);

            setClients(clientsRes.data);
            setMaxFine(maxFineRes.data);
            setPopularBooks(popularRes.data);
            setError('');
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = async (clientId) => {
        setSelectedClientId(clientId);

        try {
            const statsRes = await reportService.getClientStats(clientId);
            setClientStats(statsRes.data);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
            setClientStats(null);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Можно добавить поиск по имени/фамилии
    };

    if (loading) return <div>Загрузка аналитики...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>📊 Аналитика библиотеки</h2>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {/* Самый большой штраф */}
            <div style={{
                background: '#e9ecef',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3>💰 Самый большой штраф</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                    {maxFine !== null ? `${maxFine} ₽` : 'Нет данных'}
                </p>
            </div>

            {/* Поиск клиента */}
            <div style={{ marginBottom: '30px' }}>
                <h3>🔍 Поиск клиента</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Поиск по имени или фамилии..."
                        onChange={handleSearch}
                        style={{
                            padding: '10px',
                            flex: 1,
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                        }}
                    />
                    <select
                        value={selectedClientId}
                        onChange={(e) => handleClientSelect(e.target.value)}
                        style={{
                            padding: '10px',
                            minWidth: '200px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Выберите клиента...</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.lastName} {client.firstName} (ID: {client.id})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Статистика клиента */}
                {clientStats && (
                    <div style={{
                        border: '2px solid #007bff',
                        padding: '15px',
                        borderRadius: '8px',
                        background: '#f8f9fa'
                    }}>
                        <h4>📈 Статистика клиента #{clientStats.clientId}</h4>
                        <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                            <div>
                                <p style={{ color: '#6c757d' }}>Книг на руках:</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {clientStats.activeBooksCount}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#6c757d' }}>Общий штраф:</p>
                                <p style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: clientStats.totalFine > 0 ? '#dc3545' : '#28a745'
                                }}>
                                    {clientStats.totalFine} ₽
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Популярные книги */}
            <div>
                <h3>📚 Самые популярные книги</h3>
                {popularBooks.length === 0 ? (
                    <p>Нет данных о популярных книгах</p>
                ) : (
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {popularBooks.map((book, index) => (
                            <div
                                key={book.id}
                                style={{
                                    border: '1px solid #dee2e6',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    flex: '1',
                                    minWidth: '200px',
                                    background: index === 0 ? '#fff3cd' : '#f8f9fa'
                                }}
                            >
                                <div style={{
                                    display: 'inline-block',
                                    background: index === 0 ? '#ffc107' :
                                               index === 1 ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    marginBottom: '10px',
                                    fontSize: '0.9rem'
                                }}>
                                    #{index + 1}
                                </div>
                                <h4 style={{ margin: '10px 0' }}>{book.name}</h4>
                                <p style={{ color: '#6c757d' }}>
                                    Выдач: <strong>{book.borrowCount}</strong>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPanel;