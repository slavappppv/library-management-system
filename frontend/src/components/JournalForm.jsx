import React, { useState, useEffect } from 'react';
import { bookService, clientService } from '../services/api';

const JournalForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        bookId: '',
        clientId: '',
        dateBeg: new Date().toISOString().split('T')[0],
        dateEnd: ''
    });

    const [books, setBooks] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [booksRes, clientsRes] = await Promise.all([
                bookService.getAllBooks(),
                clientService.getAllClients()
            ]);
            setBooks(booksRes.data);
            setClients(clientsRes.data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleBookChange = (e) => {
        const bookId = parseInt(e.target.value);
        const selectedBook = books.find(b => b.id === bookId);

        if (selectedBook && selectedBook.bookType) {
            const days = selectedBook.bookType.dayCount || 7;
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + days);

            setFormData({
                ...formData,
                bookId,
                dateEnd: endDate.toISOString().split('T')[0]
            });
        } else {
            setFormData({ ...formData, bookId });
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div style={{
            maxWidth: '500px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#f9f9f9'
        }}>
            <h3>📖 Добавить запись в журнал</h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Книга *
                    </label>
                    <select
                        value={formData.bookId}
                        onChange={handleBookChange}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Выберите книгу...</option>
                        {books.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.name} (тип: {book.bookType?.type}, в наличии: {book.count})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Клиент *
                    </label>
                    <select
                        value={formData.clientId}
                        onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Выберите клиента...</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.lastName} {client.firstName} (паспорт: {client.passportSeria} {client.passportNumber})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Дата выдачи *
                    </label>
                    <input
                        type="date"
                        value={formData.dateBeg}
                        onChange={(e) => setFormData({...formData, dateBeg: e.target.value})}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Вернуть до *
                    </label>
                    <input
                        type="date"
                        value={formData.dateEnd}
                        onChange={(e) => setFormData({...formData, dateEnd: e.target.value})}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Добавить
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JournalForm;