import React, { useState, useEffect } from 'react';
import { readerService } from '../services/api';

const ReaderDashboard = () => {
    const [activeTab, setActiveTab] = useState('my-books');
    const [currentBooks, setCurrentBooks] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [bookHistory, setBookHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fines, setFines] = useState([]);
    const [totalFine, setTotalFine] = useState(0);

    useEffect(() => {
        loadReaderData();
        loadFines();
    }, []);

    const loadFines = async () => {
        try {
            const response = await readerService.getMyFines();
            setFines(response.data.fines || []);
            setTotalFine(response.data.total || 0);
        } catch (error) {
            console.error('Ошибка загрузки штрафов:', error);
            setFines([]);
            setTotalFine(0);
        }
    };

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
        const response = await readerService.getCurrentBooks();
        setCurrentBooks(response.data);
    };

    const loadAvailableBooks = async () => {
        const response = await readerService.getAvailableBooks();
        setAvailableBooks(response.data);
    };

    const loadBookHistory = async () => {
        try {
            const response = await readerService.getBookHistory();

            if (Array.isArray(response.data)) {
                setBookHistory(response.data);
            } else {
                console.error('Ожидался массив, но получили:', response.data);
                setBookHistory([]);
            }
        } catch (error) {
            console.error('Ошибка загрузки истории:', error);
            setBookHistory([]);
        }
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
        if (!window.confirm('Вернуть книгу?')) return;

        try {
            const response = await readerService.returnBook(journalId);
            console.log("Book returned response:", response);

            await loadReaderData();
            await loadFines(); // Обновить штрафы после возврата
            alert('Книга успешно возвращена!');
        } catch (error) {
            console.error("Error returning book:", error);
            alert(error.response?.data || 'Ошибка при возврате книги');
        }
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
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    📋 История ({bookHistory.length})
                </button>
                {/* КНОПКА ШТРАФОВ - ДОБАВЛЕНО */}
                <button
                    onClick={() => setActiveTab('fines')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'fines' ? '#007bff' : 'transparent',
                        color: activeTab === 'fines' ? 'white' : 'black',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    ⚖️ Мои штрафы ({fines.length})
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
                    {!Array.isArray(bookHistory) || bookHistory.length === 0 ? (
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
                                    <h4>{journal.book?.name || 'Неизвестная книга'}</h4>
                                    <p>Тип: {journal.book?.bookType?.type || 'Не указан'}</p>
                                    <p>Дата взятия: {journal.dateBeg}</p>
                                    <p>Дата возврата: {journal.dateRet || 'Не возвращена'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ВКЛАДКА ШТРАФОВ - ДОБАВЛЕНО */}
            {activeTab === 'fines' && (
                <div>
                    <h3>⚖️ Мои штрафы</h3>

                    <div style={{
                        background: totalFine > 0 ? '#fff3cd' : '#d4edda',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <h4>Общая сумма штрафов: <span style={{color: totalFine > 0 ? '#dc3545' : '#28a745'}}>
                            {totalFine} ₽
                        </span></h4>
                        {totalFine > 0 && (
                            <p style={{color: '#856404'}}>
                                ⚠️ Пожалуйста, оплатите штрафы в ближайшее время
                            </p>
                        )}
                    </div>

                    {fines.length === 0 ? (
                        <p>У вас нет штрафов 🎉</p>
                    ) : (
                        <div>
                            <h4>Детализация штрафов:</h4>
                            {fines.map((fine, index) => (
                                <div key={index} style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '5px',
                                    background: fine.paid ? '#e8f5e8' : '#ffeaea'
                                }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>
                                            <h5 style={{margin: 0}}>{fine.bookName}</h5>
                                            <p style={{margin: '5px 0', color: '#666'}}>
                                                Дата просрочки: {fine.dueDate}
                                            </p>
                                            <p style={{margin: '5px 0'}}>
                                                Дней просрочки: <strong>{fine.daysLate}</strong>
                                            </p>
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            <p style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                color: fine.paid ? '#28a745' : '#dc3545'
                                            }}>
                                                {fine.amount} ₽
                                            </p>
                                            <span style={{
                                                padding: '3px 8px',
                                                background: fine.paid ? '#28a745' : '#ffc107',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {fine.paid ? 'Оплачен' : 'Не оплачен'}
                                            </span>
                                        </div>
                                    </div>
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