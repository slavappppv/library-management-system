import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Загрузка книг...</div>;

  return (
    <div>
      <h2>Список книг</h2>
      {books.map(book => (
        <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{book.name}</h3>
          <p>Количество: {book.count}</p>
          <p>ID типа: {book.typeId}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;