class NotificationManager {
  constructor() {
    this.queue = [];
    this.isShowing = false;
    this.container = null;
    this.initContainer();
  }

  initContainer() {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          max-width: 400px;
          width: 90%;
      `;
      document.body.appendChild(this.container);
  }

  show(type, message, duration = 5000) {
    this.queue.push({ type, message, duration });
    this.processQueue();
  }

  processQueue() {
    if (this.isShowing || this.queue.length === 0) return;

    this.isShowing = true;
    const { type, message, duration } = this.queue.shift();
    this.createNotification(type, message, duration);
  }

  createNotification(type, message, duration) {
      const notification = document.createElement('div');

      const icon = this.getIcon(type);
      const styles = this.getStyles(type);

      notification.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); ${styles}">
              <span style="font-size: 18px; margin-top: 2px;">${icon}</span>
              <span style="flex: 1; font-size: 14px; line-height: 1.4;">${message}</span>
              <button style="background: none; border: none; font-size: 20px; cursor: pointer; opacity: 0.7; color: inherit;">×</button>
          </div>
      `;

      // Стили контейнера уведомления
      notification.style.cssText = `
          margin-bottom: 10px;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.3s, transform 0.3s;
      `;

      // Кнопка закрытия
      const closeBtn = notification.querySelector('button');
      closeBtn.onclick = () => this.removeNotification(notification);

      // Автозакрытие
      let timeout = setTimeout(() => this.removeNotification(notification), duration);

      // Пауза при наведении
      notification.addEventListener('mouseenter', () => clearTimeout(timeout));
      notification.addEventListener('mouseleave', () => {
          timeout = setTimeout(() => this.removeNotification(notification), duration);
      });

      this.container.appendChild(notification);

      // Показываем с анимацией
      setTimeout(() => {
          notification.style.opacity = '1';
          notification.style.transform = 'translateY(0)';
      }, 10);
  }

  removeNotification(notification) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';

      setTimeout(() => {
          if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
          }
          this.isShowing = false;
          this.processQueue();
      }, 300);
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  getStyles(type) {
    const styles = {
      success: 'background-color: rgba(212, 237, 218, 0.95); border-left: 4px solid #28a745; color: #155724;',
      error: 'background-color: rgba(248, 215, 218, 0.95); border-left: 4px solid #dc3545; color: #721c24;',
      warning: 'background-color: rgba(255, 243, 205, 0.95); border-left: 4px solid #ffc107; color: #856404;',
      info: 'background-color: rgba(209, 236, 241, 0.95); border-left: 4px solid #17a2b8; color: #0c5460;'
    };
    return styles[type] || styles.info;
  }
}

// Создаем глобальный экземпляр
const notificationManager = new NotificationManager();

// Экспортируем простую функцию
export const showNotification = (type, message, duration = 5000) => {
  notificationManager.show(type, message, duration);
};