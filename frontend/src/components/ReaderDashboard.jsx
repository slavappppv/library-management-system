import React, { useState, useEffect } from 'react';
import { readerService } from '../services/api'; // 🆕 ИМПОРТ readerService

const ReaderDashboard = () => {
    const [activeTab, setActiveTab] = useState('my-books');
    const [currentBooks, setCurrentBooks] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [bookHistory, setBookHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReaderData();
    }, []);

    const loadReaderData = async () => {
        try {
            await Promise.all([
                loadCurrentBooks(),
                loadAvailableBooks(),
                loadBookHistory()
            ]);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentBooks = async () => {
        const response = await readerService.getCurrentBooks(); // 🆕
        setCurrentBooks(response.data);
    };

    const loadAvailableBooks = async () => {
        const response = await readerService.getAvailableBooks(); // 🆕
        setAvailableBooks(response.data);
    };

    const loadBookHistory = async () => {
        const response = await readerService.getBookHistory(); // 🆕
        setBookHistory(response.data);
    };

    const handleTakeBook = async (bookId) => {
        try {
            const response = await readerService.takeBook(bookId);
            console.log("Book taken response:", response);

            await loadReaderData();
            alert('Книга успешно взята!');
        } catch (error) {
            console.error("Error taking book:", error);
            alert(error.response?.data || 'Ошибка при взятии книги');
        }
    };

    const handleReturnBook = async (journalId) => {
        alert('Функционал возврата в разработке');
    };

    if (loading) return <div>Загрузка личного кабинета...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>📚 Мой личный кабинет</h2>

            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    onClick={() => setActiveTab('my-books')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'my-books' ? '#007bff' : 'transparent',
                        color: activeTab === 'my-books' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    📖 Мои книги ({currentBooks.length})
                </button>
                <button
                    onClick={() => setActiveTab('take-book')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'take-book' ? '#007bff' : 'transparent',
                        color: activeTab === 'take-book' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    ➕ Взять книгу ({availableBooks.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'history' ? '#007bff' : 'transparent',
                        color: activeTab === 'history' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    📋 История ({bookHistory.length})
                </button>
            </div>

            {activeTab === 'my-books' && (
                <div>
                    <h3>Книги, которые я читаю</h3>
                    {currentBooks.length === 0 ? (
                        <p>У вас нет взятых книг</p>
                    ) : (
                        <div>
                            {currentBooks.map(journal => (
                                <div key={journal.id} style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '5px'
                                }}>
                                    <h4>{journal.book.name}</h4>
                                    <p>Тип: {journal.book.bookType?.type}</p>
                                    <p>Дата взятия: {journal.dateBeg}</p>
                                    <p>Вернуть до: {journal.dateEnd}</p>
                                    <button
                                        onClick={() => handleReturnBook(journal.id)}
                                        style={{ background: '#28a745', color: 'white', padding: '5px 10px' }}
                                    >
                                        Вернуть книгу
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'take-book' && (
                <div>
                    <h3>Доступные книги</h3>
                    {availableBooks.length === 0 ? (
                        <p>Нет доступных книг</p>
                    ) : (
                        <div>
                            {availableBooks.map(book => (
                                <div key={book.id} style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '5px'
                                }}>
                                    <h4>{book.name}</h4>
                                    <p>Тип: {book.bookType?.type}</p>
                                    <p>В наличии: {book.count} шт.</p>
                                    <button
                                        onClick={() => handleTakeBook(book.id)}
                                        style={{ background: '#007bff', color: 'white', padding: '5px 10px' }}
                                    >
                                        Взять книгу
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div>
                    <h3>История чтения</h3>
                    {bookHistory.length === 0 ? (
                        <p>История пуста</p>
                    ) : (
                        <div>
                            {bookHistory.map(journal => (
                                <div key={journal.id} style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '5px'
                                }}>
                                    <h4>{journal.book.name}</h4>
                                    <p>Тип: {journal.book.bookType?.type}</p>
                                    <p>Дата взятия: {journal.dateBeg}</p>
                                    <p>Дата возврата: {journal.dateRet}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReaderDashboard;