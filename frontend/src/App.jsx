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
            <h1 className="app-title">📚 Библиотека</h1>
            <div className="nav-buttons">
              <button className="nav-button" onClick={() => setCurrentView("reference")}>
                📋 СПРАВОЧНИКИ
              </button>
              <button className="nav-button" onClick={() => setCurrentView("journals")}>
                📖 ЖУРНАЛЫ
              </button>
              <button className="nav-button" onClick={() => setCurrentView("reports")}>
                📊 ОТЧЕТЫ
              </button>
              <button className="nav-button" onClick={handleLogout}>
                🚪 Выйти
              </button>
            </div>
          </nav>
        )}

        <main className="app-content">
          {!isAuthenticated ? (
            <Login onLogin={handleLoginSuccess} />
          ) : (
            <>
              {currentView === "books" && <BookList />}
              {currentView === "reference" && <div>Раздел СПРАВОЧНИКИ</div>}
              {currentView === "journals" && <div>Раздел ЖУРНАЛЫ</div>}
              {currentView === "reports" && <div>Раздел ОТЧЕТЫ</div>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;