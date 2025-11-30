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

export default api;