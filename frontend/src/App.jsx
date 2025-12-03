import { useState, useEffect } from "react";
import BookList from "./components/BookList";
import Login from "./components/Login";
import ReaderDashboard from "./components/ReaderDashboard";
import ReportsPanel from './components/ReportsPanel';
import ReferencesPanel from './components/ReferencesPanel';
import JournalList from './components/JournalList';
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setCurrentView(role === "ROLE_READER" ? "reader-dashboard" : "books");
    }
  }, []);

  const handleLoginSuccess = (role) => {
      console.log('=== LOGIN SUCCESS ===');
      console.log('Role:', role);
      console.log('Is ROLE_READER?:', role === "ROLE_READER");

      setIsAuthenticated(true);
      setUserRole(role);

      const view = role === "ROLE_READER" ? "reader-dashboard" : "books";
      console.log('Setting view to:', view);

      setCurrentView(view);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    setCurrentView("login");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  return (
    <div className="app">
      <div className="app-container">
        {isAuthenticated && (
          <nav className="app-nav">
            <h1 className="app-title">📚 Библиотека</h1>
            <div className="nav-buttons">
              {}
              {userRole === "ROLE_READER" ? (
                <button
                  className="nav-button"
                  onClick={() => setCurrentView("reader-dashboard")}
                >
                  📚 Мой кабинет
                </button>
              ) : (
                <>
                  <button className="nav-button" onClick={() => setCurrentView("books")}>
                    📚 Книги
                  </button>
                  <button className="nav-button" onClick={() => setCurrentView("reference")}>
                    📋 СПРАВОЧНИКИ
                  </button>
                  <button className="nav-button" onClick={() => setCurrentView("journals")}>
                    📖 ЖУРНАЛЫ
                  </button>
                  <button className="nav-button" onClick={() => setCurrentView("reports")}>
                    📊 ОТЧЕТЫ
                  </button>
                </>
              )}
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
              {currentView === "reader-dashboard" && <ReaderDashboard />} {/* 🆕 */}
              {currentView === "reference" && <ReferencesPanel />}
              {currentView === "journals" && <JournalList />}
              {currentView === "reports" && <ReportsPanel />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;