import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import Catalog from "./pages/Catalog";
import CabinetPage from "./pages/CabinetPage";
import "./App.css";

function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  const togglePage = () => {
    if (showAdmin) {
      navigate('/');
      setShowAdmin(false);
    } else {
      navigate('/admin');
      setShowAdmin(true);
    }
  };

  return (
    <>
      <Header setShowAdmin={setShowAdmin} showAdmin={showAdmin} />
      
      <div style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<Home setShowAdmin={setShowAdmin} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/catalog" element={<Catalog />} /> {/* Новый маршрут */}
          <Route path="/cabinet" element={<CabinetPage />} />
        </Routes>
        
        {/* Ваша кнопка переключения
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
        </div> */}
      </div>
      
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;