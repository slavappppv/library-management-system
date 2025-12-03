import React, { useState, useEffect } from 'react';

const ClientForm = ({ client, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: client?.firstName || '',
        lastName: client?.lastName || '',
        fatherName: client?.fatherName || '',
        passportSeria: client?.passportSeria || '',
        passportNumber: client?.passportNumber || ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
        if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';

        if (!/^\d{4}$/.test(formData.passportSeria)) {
            newErrors.passportSeria = 'Серия паспорта - 4 цифры';
        }

        if (!/^\d{6}$/.test(formData.passportNumber)) {
            newErrors.passportNumber = 'Номер паспорта - 6 цифр';
        }

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
            [name]: value
        }));
        // Очищаем ошибку при изменении поля
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
            <h3>{client ? 'Редактирование клиента' : 'Добавление клиента'}</h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Фамилия *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.lastName ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.lastName && <div style={{ color: 'red', fontSize: '14px' }}>{errors.lastName}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Имя *</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.firstName ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.firstName && <div style={{ color: 'red', fontSize: '14px' }}>{errors.firstName}</div>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Отчество</label>
                    <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Серия паспорта * (4 цифры)</label>
                    <input
                        type="text"
                        name="passportSeria"
                        value={formData.passportSeria}
                        onChange={handleChange}
                        maxLength="4"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.passportSeria ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.passportSeria && <div style={{ color: 'red', fontSize: '14px' }}>{errors.passportSeria}</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Номер паспорта * (6 цифр)</label>
                    <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        maxLength="6"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: errors.passportNumber ? '1px solid red' : '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                    {errors.passportNumber && <div style={{ color: 'red', fontSize: '14px' }}>{errors.passportNumber}</div>}
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
                        {client ? 'Сохранить' : 'Добавить'}
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

export default ClientForm;