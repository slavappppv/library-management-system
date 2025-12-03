import React, { useState, useEffect } from 'react';
import { clientService } from '../services/api';
import ClientForm from './ClientForm';
import GridView from './GridView';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const response = await clientService.getAllClients();
            setClients(response.data);
            setError('');
        } catch (error) {
            console.error('Ошибка загрузки клиентов:', error);
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (clientData) => {
        try {
            if (editingClient) {
                await clientService.updateClient(editingClient.id, clientData);
            } else {
                await clientService.createClient(clientData);
            }
            setShowForm(false);
            setEditingClient(null);
            await loadClients();
            setError('');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            setError('Ошибка сохранения данных');
        }
    };

    const handleAdd = () => {
        setEditingClient(null);
        setShowForm(true);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить клиента?')) {
            try {
                await clientService.deleteClient(id);
                await loadClients();
                setError('');
            } catch (error) {
                console.error('Ошибка удаления:', error);
                setError('Ошибка удаления клиента');
            }
        }
    };

    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'lastName', header: 'Фамилия' },
        { field: 'firstName', header: 'Имя' },
        { field: 'fatherName', header: 'Отчество' },
        {
            field: 'passport',
            header: 'Паспорт',
            accessor: (item) => `${item.passportSeria} ${item.passportNumber}`
        }
    ];

    if (loading) return <div>Загрузка клиентов...</div>;

    if (showForm) {
        return (
            <ClientForm
                client={editingClient}
                onSave={handleSave}
                onCancel={() => {
                    setShowForm(false);
                    setEditingClient(null);
                }}
            />
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Клиенты</h3>
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
                    + Добавить клиента
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <GridView
                data={clients}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ClientList;