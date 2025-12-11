import axios from 'axios';
import { showNotification } from '../utils/notification';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    // Обработка 401 (истекший токен)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Только если НЕ на странице логина
      if (!currentPath.includes('/login') && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        showNotification('error', 'Сессия истекла. Пожалуйста, войдите снова.', 3000);
        setTimeout(() => {
          window.location.href = '/'; // или '/login'
        }, 1500);
      }
      return Promise.reject(error);
    }

    // Извлекаем сообщение об ошибке
    let userMessage = 'Произошла ошибка';

    if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.userMessage && typeof errorData.userMessage === 'string') {
            userMessage = errorData.userMessage;
        }
        // Если это строка
        else if (typeof errorData === 'string') {
            userMessage = errorData;
        }
        // Если это объект с полем message/error
        else if (errorData.message && typeof errorData.message === 'string') {
            userMessage = errorData.message;
        }
        else if (errorData.error && typeof errorData.error === 'string') {
            userMessage = errorData.error;
        }
        // Если ничего не подошло, преобразуем в строку
        else {
            userMessage = JSON.stringify(errorData);
        }
    }
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('10 книг') ||
        lowerMessage.includes('больше нельзя') ||
        lowerMessage.includes('лимит')) {

        userMessage = '📚 Превышен лимит! У вас уже 10 книг.\nПожалуйста, верните некоторые книги прежде чем брать новые.';
    }

    showNotification('error', userMessage, 5000);

    return Promise.reject(error);
  }
);

export const bookService = {
  getAllBooks: () => api.get('/books'),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (book) => api.post('/books', book),
  updateBook: (id, book) => api.put(`/books/${id}`, book),
  deleteBook: (id) => api.delete(`/books/${id}`),
  post: (url, data) => api.post(url, data),
};

export const bookTypeService = {
  getAllBookTypes: () => api.get('/book-types'),
  getBookTypeById: (id) => api.get(`/book-types/${id}`),
  createBookType: (bookType) => api.post('/book-types', bookType),
  updateBookType: (id, bookType) => api.put(`/book-types/${id}`, bookType),
  deleteBookType: (id) => api.delete(`/book-types/${id}`),
};

export const journalService = {
  getAllJournalRecords: () => api.get('/journal'),
  getJournalRecordById: (id) => api.get(`/journal/${id}`),
  createJournalRecord: (journal) => api.post('/journal', journal),
  updateJournalRecord: (id, journal) => api.put(`/journal/${id}`, journal),
  deleteJournalRecord: (id) => api.delete(`/journal/${id}`),
};

export const readerService = {
    getAvailableBooks: () => api.get('/reader/available-books'),
    getCurrentBooks: () => api.get('/reader/current-books'),
    getBookHistory: () => api.get('/reader/book-history'),
    takeBook: (bookId) => api.post('/reader/take-book', { bookId }),
    returnBook: (journalId) => api.post('/reader/return-book', { journalId }),
    getMyFines: () => api.get('/reader/my-fines'),
    payFine: (fineId) => api.post(`/reader/pay-fine/${fineId}`),
};

export const clientService = {
    getAllClients: () => api.get('/clients'),
    getClientById: (id) => api.get(`/clients/${id}`),
    createClient: (client) => api.post('/clients', client),
    updateClient: (id, client) => api.put(`/clients/${id}`, client),
    deleteClient: (id) => api.delete(`/clients/${id}`),
};

export const reportService = {
    getClientActiveBooksCount: (clientId) => api.get(`/reports/client/${clientId}/active-books-count`),
    getClientTotalFine: (clientId) => api.get(`/reports/client/${clientId}/total-fine`),
    getClientStats: (clientId) => api.get(`/reports/client/${clientId}/stats`),
    getMaxSingleFine: () => api.get('/reports/max-single-fine'),
    getTopPopularBooks: (limit = 3) => api.get(`/reports/popular-books?limit=${limit}`),

    getBooksFullReport: () => api.get('/reports/books-full', { responseType: 'text' }),
    getBooksStatisticsReport: () => api.get('/reports/books-statistics', { responseType: 'text' }),
};

export default api;