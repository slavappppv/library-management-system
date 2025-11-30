import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookForm from './BookForm';
import GridView from './GridView';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await bookService.getAllBooks();
            setBooks(response.data);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBook(null);
        setShowForm(true);
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить книгу?')) {
            try {
                await bookService.deleteBook(id);
                loadBooks();
            } catch (error) {
                console.error('Ошибка удаления:', error);
            }
        }
    };

    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Название книги' },
        { field: 'count', header: 'Количество' },
        {
            field: 'bookType.type',
            header: 'Тип книги',
            accessor: (item) => item.bookType?.type || 'Не указан'
        }
    ];

    if (loading) return <div>Загрузка книг...</div>;

    if (showForm) {
        return (
            <BookForm
                book={editingBook}
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
            />
        );
    }

    return (
        <div>
            <div className="books-header">
                <h2>Список книг</h2>
                <button className="add-book-button" onClick={handleAdd}>
                    📖 Добавить книгу
                </button>
            </div>

            <GridView
                data={books}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default BookList;