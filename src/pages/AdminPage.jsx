import React from 'react';
import CarManagement from '../components/CarManagement';
import './AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-main">
        <div className="container">
          <h1 className="admin-title">Панель управления GrandMotors</h1>
          <CarManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;