import React, { useState } from 'react';

const ReportsPanel = () => {
    const [reportContent, setReportContent] = useState('');

    const loadReport = async (endpoint) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/${endpoint}`);
            const text = await response.text();
            setReportContent(text);
        } catch (error) {
            console.error('Ошибка загрузки отчета:', error);
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