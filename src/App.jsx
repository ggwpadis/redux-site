import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import "./App.css";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  const togglePage = () => {
    setShowAdmin(!showAdmin);
  };

  return (
    <>
      <Header />
      
      {/* Контент с отступом для фиксированного header */}
      <div style={{ marginTop: '80px' }}> {/* Уменьшил отступ до 80px */}
        {showAdmin ? <AdminPage /> : <Home />}
        
        {/* Кнопка теперь внизу, после контента */}
        <div style={{ 
          textAlign: 'center', 
          margin: '40px 0',
          padding: '20px',
          borderTop: '2px solid #FFD700',
          background: 'linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%)'
        }}>
          <button 
            onClick={togglePage}
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {showAdmin ? '🏠 Вернуться на главную' : '⚙️ Перейти в админку (CRUD)'}
          </button>
          <p style={{ marginTop: '15px', color: '#666' }}>
            {showAdmin 
              ? 'Вы находитесь в панели управления' 
              : 'Для администраторов: управление автомобилями'}
          </p>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default App;