import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ type, message, onClose, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '';
        }
    };

    if (!visible) return null;

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-content">
                <span className="notification-icon">{getIcon()}</span>
                <span className="notification-message">{message}</span>
                <button
                    className="notification-close"
                    onClick={() => {
                        setVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;