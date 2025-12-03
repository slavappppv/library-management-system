import React, { useState } from 'react';
import BookList from './BookList';
import ClientList from './ClientList';
import BookTypeList from './BookTypeList';

const ReferencesPanel = () => {
    const [activeTab, setActiveTab] = useState('books');

    return (
        <div style={{ padding: '20px' }}>
            <h2>📋 СПРАВОЧНИКИ</h2>

            {/* Простые кнопки без сложных стилей */}
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('books')}
                    style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        background: activeTab === 'books' ? '#007bff' : '#e9ecef',
                        color: activeTab === 'books' ? 'white' : 'black',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    📚 Книги
                </button>

                <button
                    onClick={() => setActiveTab('clients')}
                    style={{
                        marginRight: '10px',
                        padding: '8px 16px',
                        background: activeTab === 'clients' ? '#007bff' : '#e9ecef',
                        color: activeTab === 'clients' ? 'white' : 'black',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    👥 Клиенты
                </button>

                <button
                    onClick={() => setActiveTab('book-types')}
                    style={{
                        padding: '8px 16px',
                        background: activeTab === 'book-types' ? '#007bff' : '#e9ecef',
                        color: activeTab === 'book-types' ? 'white' : 'black',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    📑 Типы книг
                </button>
            </div>

            {/* Контент */}
            <div>
                {activeTab === 'books' && <BookList />}
                {activeTab === 'clients' && <ClientList />}
                {activeTab === 'book-types' && <BookTypeList />}
            </div>
        </div>
    );
};

export default ReferencesPanel;