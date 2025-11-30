import React, { useState, useEffect } from 'react';
import { bookTypeService } from '../services/api';

const BookForm = ({ book, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: book?.name || '',
        count: book?.count || 1,
        bookType: book?.bookType || null
    });
    const [bookTypes, setBookTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookTypes();
    }, []);

    const loadBookTypes = async () => {
        try {
            const response = await bookTypeService.getAllBookTypes();
            setBookTypes(response.data);
        } catch (error) {
            console.error('Ошибка загрузки типов книг:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleBookTypeChange = (e) => {
        const selectedTypeId = parseInt(e.target.value);
        const selectedBookType = bookTypes.find(type => type.id === selectedTypeId);
        setFormData({...formData, bookType: selectedBookType});
    };

    if (loading) return <div>Загрузка типов книг...</div>;

    return (
        <div className="form-container">
            <h3>{book ? 'Редактирование книги' : 'Добавление книги'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Название книги"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        placeholder="Количество"
                        value={formData.count}
                        onChange={(e) => setFormData({...formData, count: parseInt(e.target.value)})}
                        className="form-input"
                        required
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <select
                        value={formData.bookType?.id || ''}
                        onChange={handleBookTypeChange}
                        className="form-input"
                        required
                    >
                        <option value="">Выберите тип книги</option>
                        {bookTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.type} (дней: {type.dayCount}, штраф: {type.fine})
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button type="submit" className="submit-button">
                        {book ? 'Сохранить' : 'Добавить'}
                    </button>
                    <button type="button" onClick={onCancel} className="nav-button">
                        Закрыть
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookForm;