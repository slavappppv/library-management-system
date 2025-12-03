import React, { useState } from 'react';

const BookTypeForm = ({ bookType, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        type: bookType?.type || '',
        fine: bookType?.fine || 0,
        dayCount: bookType?.dayCount || 7
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.type.trim()) newErrors.type = 'Введите тип книги';
        if (formData.fine < 0) newErrors.fine = 'Штраф не может быть отрицательным';
        if (formData.dayCount <= 0) newErrors.dayCount = 'Должно быть больше 0 дней';

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            onSave(formData);
        } else {
            setErrors(validationErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'fine' || name === 'dayCount' ? parseInt(value) || 0 : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#f9f9f9'
        }}>
            <h3>{bookType ? 'Редактирование типа книги' : 'Добавление типа книги'}</h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Тип книги *</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Например: Художественная, Научная, Учебник"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.type ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.type && <div style={{ color: 'red', fontSize: '14px' }}>{errors.type}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Срок выдачи (дней) *
                    </label>
                    <input
                        type="number"
                        name="dayCount"
                        value={formData.dayCount}
                        onChange={handleChange}
                        min="1"
                        max="365"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.dayCount ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.dayCount && <div style={{ color: 'red', fontSize: '14px' }}>{errors.dayCount}</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        Штраф за просрочку (руб/день) *
                    </label>
                    <input
                        type="number"
                        name="fine"
                        value={formData.fine}
                        onChange={handleChange}
                        min="0"
                        step="10"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.fine ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.fine && <div style={{ color: 'red', fontSize: '14px' }}>{errors.fine}</div>}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        {bookType ? 'Сохранить' : 'Добавить'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookTypeForm;