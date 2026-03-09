import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserCabinet from '../components/UserCabinet';
import './CabinetPage.css';

const CabinetPage = () => {
  return (
    <div className="cabinet-page">
      <Header />
      <main className="cabinet-main">
        <div className="container">
          <UserCabinet />
        </div>
      </main>
    </div>
  );
};

export default CabinetPage;