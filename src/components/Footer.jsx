import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { name: 'О нас', path: '/about' },
      { name: 'Блог', path: '/blog' },
      { name: 'Карьера', path: '/career' },
      { name: 'Контакты', path: '/contacts' }
    ],
    services: [
      { name: 'Каталог', path: '/catalog' },
      { name: 'Тест-драйв', path: '/test-drive' },
      { name: 'Trade-in', path: '/trade-in' },
      { name: 'Кредитование', path: '/credit' }
    ],
    support: [
      { name: 'FAQ', path: '/faq' },
      { name: 'Политика', path: '/privacy' },
      { name: 'Условия', path: '/terms' }
    ]
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">GrandMotors</h3>
            <p className="footer-description">
              Премиум-автосалон будущего. Ваш автомобиль премиум-класса — ближе, чем вы думаете.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Компания</h4>
            <ul className="footer-links">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.path}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Сервисы</h4>
            <ul className="footer-links">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.path}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Поддержка</h4>
            <ul className="footer-links">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.path}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} GrandMotors. Все права защищены.</p>
          <p>Разработано с ❤️ для премиум-клиентов</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;