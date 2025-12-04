import React, { useState, useEffect } from 'react';
import { journalService } from '../services/api';
import GridView from './GridView';
import JournalForm from './JournalForm';

const JournalList = () => {
    const [journalRecords, setJournalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        status: 'all', // all, active, returned
        startDate: '',
        endDate: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        loadJournalRecords();
    }, []);

    const handleAdd = () => {
        setSelectedRecord(null);
        setShowForm(true);
    };

    const handleSave = async (journalData) => {
        try {
            if (selectedRecord) {
                await journalService.updateJournalRecord(selectedRecord.id, journalData);
            } else {
                await journalService.createJournalRecord(journalData);
            }
            setShowForm(false);
            setSelectedRecord(null);
            loadJournalRecords();
            alert('Запись успешно сохранена!');
        } catch (error) {
            console.error('Ошибка сохранения:', error);

            let errorMessage = 'Неизвестная ошибка';

            if (error.response?.data) {
                const errorText = error.response.data;
                if (errorText.includes('Книги закончились')) {
                    errorMessage = '❌ Книги закончились! Все экземпляры уже выданы.';
                } else if (errorText.includes('Нельзя удалить запись')) {
                    errorMessage = '❌ Нельзя удалить запись: книга еще не возвращена';
                } else if (errorText.includes('Книга недоступна')) {
                    errorMessage = '❌ Книга недоступна (нет свободных экземпляров)';
                } else if (errorText.includes('клиент уже взял эту книгу')) {
                    errorMessage = '❌ Клиент уже взял эту книгу';
                } else {
                    errorMessage = `Ошибка: ${errorText}`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        }
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить запись из журнала?')) return;

        try {
            await journalService.deleteJournalRecord(id);
            loadJournalRecords();
            alert('Запись удалена');
        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert(error.response?.data || 'Ошибка удаления записи');
        }
    };

    const loadJournalRecords = async () => {
        try {
            const response = await journalService.getAllJournalRecords();
            setJournalRecords(response.data);
            setError('');
        } catch (error) {
            console.error('Ошибка загрузки журнала:', error);
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (record) => {
        if (!record.dateRet) return '📖 Выдано';
        return '✅ Возвращено';
    };

    const getStatusStyle = (record) => {
        if (!record.dateRet) return { color: '#dc3545', fontWeight: 'bold' };
        return { color: '#28a745', fontWeight: 'bold' };
    };

    const filteredRecords = journalRecords.filter(record => {
        if (filter.status === 'active' && record.dateRet) return false;
        if (filter.status === 'returned' && !record.dateRet) return false;

        if (filter.startDate && record.dateBeg < filter.startDate) return false;
        if (filter.endDate && record.dateBeg > filter.endDate) return false;

        return true;
    });

    const columns = [
        { field: 'id', header: 'ID' },
        {
            field: 'book.name',
            header: 'Книга',
            accessor: (item) => item.book?.name || 'Не указана'
        },
        {
            field: 'client',
            header: 'Клиент',
            accessor: (item) =>
                item.client ?
                    `${item.client.lastName} ${item.client.firstName.charAt(0)}.${item.client.fatherName ? item.client.fatherName.charAt(0) + '.' : ''}`
                    : 'Не указан'
        },
        {
            field: 'dateBeg',
            header: 'Дата выдачи',
            accessor: (item) => new Date(item.dateBeg).toLocaleDateString('ru-RU')
        },
        {
            field: 'dateEnd',
            header: 'Вернуть до',
            accessor: (item) => item.dateEnd ? new Date(item.dateEnd).toLocaleDateString('ru-RU') : '-'
        },
        {
            field: 'dateRet',
            header: 'Дата возврата',
            accessor: (item) => item.dateRet ? new Date(item.dateRet).toLocaleDateString('ru-RU') : 'Еще не возвращена'
        },
        {
            field: 'status',
            header: 'Статус',
            accessor: (item) => (
                <span style={getStatusStyle(item)}>
                    {getStatus(item)}
                </span>
            )
        }
    ];

    if (loading) return <div>Загрузка журнала...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>📖 ЖУРНАЛ ВЫДАЧИ КНИГ</h2>

            {/* Фильтры */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Статус: </label>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    >
                        <option value="all">Все записи</option>
                        <option value="active">Только выданные</option>
                        <option value="returned">Только возвращенные</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>С: </label>
                    <input
                        type="date"
                        value={filter.startDate}
                        onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>По: </label>
                    <input
                        type="date"
                        value={filter.endDate}
                        onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
                    />
                </div>

                <div style={{ alignSelf: 'flex-end' }}>
                    <button
                        onClick={() => setFilter({ status: 'all', startDate: '', endDate: '' })}
                        style={{
                            padding: '8px 16px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Сбросить фильтры
                    </button>
                </div>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}


            <div style={{ marginTop: '20px' }}>
                <p>Всего записей: <strong>{filteredRecords.length}</strong></p>
                <p>Выдано сейчас: <strong style={{ color: '#dc3545' }}>
                    {journalRecords.filter(r => !r.dateRet).length}
                </strong></p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>📖 ЖУРНАЛ ВЫДАЧИ КНИГ</h2>
                <button
                    onClick={handleAdd}
                    style={{
                        padding: '10px 20px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ➕ Добавить запись
                </button>
            </div>

            {}
            {showForm && (
                <JournalForm
                    journal={selectedRecord}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedRecord(null);
                    }}
                />
            )}

            <GridView
                data={filteredRecords}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default JournalList;