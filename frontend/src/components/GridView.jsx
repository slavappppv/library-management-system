import React, { useState } from 'react';

const GridView = ({ data, columns, onEdit, onDelete }) => {
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortField) return 0;

        const aValue = getNestedValue(a, sortField);
        const bValue = getNestedValue(b, sortField);

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="grid-view">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                        {columns.map(col => (
                            <th
                                key={col.field}
                                onClick={() => handleSort(col.field)}
                                style={{
                                    padding: '12px',
                                    textAlign: 'left',
                                    borderBottom: '2px solid #dee2e6',
                                    cursor: 'pointer'
                                }}
                            >
                                {col.header} {sortField === col.field && (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                        ))}
                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            {columns.map(col => (
                                <td key={col.field} style={{ padding: '12px' }}>
                                    {col.accessor ? col.accessor(item) : getNestedValue(item, col.field)}
                                </td>
                            ))}
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => onEdit(item)}
                                    style={{ marginRight: '8px', padding: '4px 8px' }}
                                >
                                    Изменить
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    style={{ padding: '4px 8px', background: '#dc3545', color: 'white' }}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GridView;