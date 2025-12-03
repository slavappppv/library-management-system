import axios from 'axios';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.reload();
    }
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