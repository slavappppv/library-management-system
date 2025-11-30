import React, { useState } from 'react';

const BookForm = ({ book, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: book?.name || '',
    count: book?.count || 1,
    typeId: book?.typeId || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

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
            onChange={(e) => setFormData({...formData, count: e.target.value})}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="ID типа"
            value={formData.typeId}
            onChange={(e) => setFormData({...formData, typeId: e.target.value})}
            className="form-input"
            required
          />
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