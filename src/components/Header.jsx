import React from 'react';
import './Header.css';

const Header = () => {
  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Сравнение', path: '/compare' },
    { name: 'Акции', path: '/offers' },
    { name: 'О нас', path: '/about' },
    { name: 'Блог', path: '/blog' },
    { name: 'Контакты', path: '/contacts' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/">
            <span className="logo-grand">Grand</span>
            <span className="logo-motors">Motors</span>
          </a>
        </div>

        <nav className="nav-menu">
          <ul className="nav-list">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <a href={link.path} className="nav-link">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="btn-test-drive">
            Запись на тест-драйв
          </button>
          <button className="btn-menu-mobile">
            <span className="hamburger-icon"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
