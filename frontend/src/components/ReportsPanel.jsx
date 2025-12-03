import React, { useState } from 'react';
import api from '../services/api';  // ← Использовать axios

const ReportsPanel = () => {
    const [reportContent, setReportContent] = useState('');

    const loadReport = async (endpoint) => {
        try {
            const response = await api.get(`/reports/${endpoint}`, {
                responseType: 'text'  // ← Для текстового ответа
            });
            setReportContent(response.data);
        } catch (error) {
            console.error('Ошибка загрузки отчета:', error);
            setReportContent(`Ошибка: ${error.response?.data || error.message}`);
        }
    };

    return (
        <div>
            <h2>📊 Отчеты</h2>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => loadReport('books-full')}>
                    Полный список книг (TXT)
                </button>
                <button onClick={() => loadReport('books-statistics')}>
                    Статистика по типам (TXT)
                </button>
            </div>
            <pre style={{ background: '#f5f5f5', padding: '15px' }}>
                {reportContent}
            </pre>
        </div>
    );
};

export default ReportsPanel;