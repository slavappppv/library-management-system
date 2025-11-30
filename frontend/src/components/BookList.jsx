import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookForm from './BookForm';

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

  const handleSave = async (bookData) => {
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, bookData);
      } else {
        await bookService.createBook(bookData);
      }
      setShowForm(false);
      loadBooks();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

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

      {books.map(book => (
        <div key={book.id} className="book-card">
          <h3 className="book-title">{book.name}</h3>
          <p className="book-author">Количество: {book.count}</p>
          <p className="book-year">ID типа: {book.typeId}</p>
          <div style={{marginTop: '10px', display: 'flex', gap: '10px'}}>
            <button onClick={() => handleEdit(book)} style={{
              padding: '5px 10px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}>
              Изменить
            </button>
            <button onClick={() => handleDelete(book.id)} style={{
              padding: '5px 10px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}>
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;