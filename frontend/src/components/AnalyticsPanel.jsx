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

        if (!clientId) {
            setClientStats(null);
            return;
        }

        try {
            const statsRes = await reportService.getClientStats(clientId);
            setClientStats(statsRes.data);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
            setClientStats(null);
        }
    };

    if (loading) return <div>Загрузка аналитики...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>📊 Аналитика библиотеки</h2>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {/* Самый большой штраф */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                color: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
                <h3 style={{ margin: 0, color: 'white' }}>💰 Самый большой штраф</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                    {maxFine !== null ? `${maxFine} ₽` : 'Нет данных'}
                </p>
            </div>

            {/* Поиск клиента - ТОЛЬКО ВЫБОР ИЗ СПИСКА */}
            <div style={{ marginBottom: '30px' }}>
                <h3>👤 Выбор клиента для статистики</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <select
                            value={selectedClientId}
                            onChange={(e) => handleClientSelect(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #667eea',
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Выберите клиента...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.lastName} {client.firstName}
                                    {client.fatherName ? ` ${client.fatherName}` : ''}
                                    {client.passportSeria ? ` (паспорт: ${client.passportSeria} ${client.passportNumber})` : ''}
                                </option>
                            ))}
                        </select>
                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                            Всего клиентов: {clients.length}
                        </p>
                    </div>
                </div>

                {/* Статистика клиента */}
                {clientStats && (
                    <div style={{
                        border: '2px solid #28a745',
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        <h4 style={{ color: '#28a745', marginBottom: '15px' }}>
                            📈 Статистика клиента
                        </h4>
                        <div style={{ display: 'flex', gap: '30px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <div style={{
                                background: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                flex: 1,
                                minWidth: '150px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                <p style={{ color: '#6c757d', fontSize: '14px' }}>Книг на руках:</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                                    {clientStats.activeBooksCount || 0}
                                </p>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                flex: 1,
                                minWidth: '150px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                <p style={{ color: '#6c757d', fontSize: '14px' }}>Общий штраф:</p>
                                <p style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: (clientStats.totalFine || 0) > 0 ? '#dc3545' : '#28a745'
                                }}>
                                    {clientStats.totalFine || 0} ₽
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
                                    border: 'none',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    flex: '1',
                                    minWidth: '200px',
                                    background: index === 0
                                        ? 'linear-gradient(135deg, #ffd700, #ffcc00)'
                                        : index === 1
                                            ? 'linear-gradient(135deg, #c0c0c0, #a9a9a9)'
                                            : 'linear-gradient(135deg, #cd7f32, #b87333)',
                                    color: index === 0 ? '#856404' : 'white',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{
                                    display: 'inline-block',
                                    background: index === 0 ? '#ffc107' :
                                               index === 1 ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    marginBottom: '15px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}>
                                    #{index + 1} место
                                </div>
                                <h4 style={{ margin: '10px 0', fontSize: '1.2rem' }}>{book.name}</h4>
                                <p style={{ color: 'inherit', opacity: 0.9 }}>
                                    Количество выдач: <strong style={{ fontSize: '1.3rem' }}>{book.borrowCount}</strong>
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