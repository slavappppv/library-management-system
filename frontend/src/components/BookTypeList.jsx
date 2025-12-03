import React, { useState, useEffect } from 'react';
import { bookTypeService } from '../services/api';
import BookTypeForm from './BookTypeForm';
import GridView from './GridView';

const BookTypeList = () => {
    const [bookTypes, setBookTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBookType, setEditingBookType] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBookTypes();
    }, []);

    const loadBookTypes = async () => {
        try {
            const response = await bookTypeService.getAllBookTypes();
            setBookTypes(response.data);
            setError('');
        } catch (error) {
            console.error('Ошибка загрузки типов книг:', error);
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (bookTypeData) => {
        try {
            if (editingBookType) {
                await bookTypeService.updateBookType(editingBookType.id, bookTypeData);
            } else {
                await bookTypeService.createBookType(bookTypeData);
            }
            setShowForm(false);
            setEditingBookType(null);
            await loadBookTypes();
            setError('');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setError('Ошибка сохранения данных');
        }
    };

    const handleAdd = () => {
        setEditingBookType(null);
        setShowForm(true);
    };

    const handleEdit = (bookType) => {
        setEditingBookType(bookType);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить тип книги? Внимание: могут удалиться связанные книги!')) {
            try {
                await bookTypeService.deleteBookType(id);
                await loadBookTypes();
                setError('');
            } catch (error) {
                console.error('Ошибка удаления:', error);
                setError('Ошибка удаления типа книги');
            }
        }
    };

    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'type', header: 'Тип книги' },
        { field: 'dayCount', header: 'Дней на выдачу' },
        {
            field: 'fine',
            header: 'Штраф (руб/день)',
            accessor: (item) => `${item.fine} ₽`
        }
    ];

    if (loading) return <div>Загрузка типов книг...</div>;

    if (showForm) {
        return (
            <BookTypeForm
                bookType={editingBookType}
                onSave={handleSave}
                onCancel={() => {
                    setShowForm(false);
                    setEditingBookType(null);
                }}
            />
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Типы книг</h3>
                <button
                    onClick={handleAdd}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    + Добавить тип
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <GridView
                data={bookTypes}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default BookTypeList;