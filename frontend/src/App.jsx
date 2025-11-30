// frontend/src/App.jsx
import { useState } from "react";
import BookList from "./components/BookList";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView("books");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("login");
  };

  return (
    <div className="app">
      <div className="app-container">
        {isAuthenticated && (
          <nav className="app-nav">
            <h1 className="app-title">📚 Управление Библиотекой</h1>
            <div className="nav-buttons">
              <button
                className="nav-button"
                onClick={() => setCurrentView("books")}
              >
                📖 Список книг
              </button>
              <button
                className="nav-button"
                onClick={handleLogout}
              >
                🚪 Выйти
              </button>
            </div>
          </nav>
        )}

        <main className="app-content">
          {!isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            currentView === "books" && <BookList />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;