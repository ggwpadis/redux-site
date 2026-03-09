import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Добавляем импорт для навигации
import Header from '../components/Header';
import Footer from '../components/Footer';
import "./Home.css";

// Импортируем JSON данные
import carsData from '../data/cars.json';

const HomePage = ({ setShowAdmin }) => {
  const [cars, setCars] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Состояния для бронирования
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState('hour'); // 'hour' или 'day'
  const [bookingHours, setBookingHours] = useState(1);
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  
  // Состояния загрузки
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingPromo, setLoadingPromo] = useState(true);
  const [loadingBlog, setLoadingBlog] = useState(true);
  
  // Состояния ошибок
  const [errorCars, setErrorCars] = useState(null);
  const [errorPromo, setErrorPromo] = useState(null);
  const [errorBlog, setErrorBlog] = useState(null);

  // Функция для имитации задержки
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCars(true);
        await delay(1500);
        setCars(carsData.cars);
        setErrorCars(null);
      } catch (err) {
        setErrorCars('Ошибка загрузки автомобилей');
        console.error(err);
      } finally {
        setLoadingCars(false);
      }

      try {
        setLoadingPromo(true);
        await delay(1000);
        setPromotions(carsData.promotions);
        setErrorPromo(null);
      } catch (err) {
        setErrorPromo('Ошибка загрузки акций');
        console.error(err);
      } finally {
        setLoadingPromo(false);
      }

      try {
        setLoadingBlog(true);
        await delay(1200);
        setBlogPosts(carsData.blog);
        setErrorBlog(null);
      } catch (err) {
        setErrorBlog('Ошибка загрузки блога');
        console.error(err);
      } finally {
        setLoadingBlog(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    const carsSection = document.querySelector('.cars-section');
    if (carsSection) {
      carsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToList = () => {
    setSelectedCar(null);
  };

  // Функция для бронирования сейчас
  const handleRentNow = (car) => {
    setSelectedCar(car);
    setBookingType('hour');
    setBookingHours(1);
    setShowBookingModal(true);
  };

  // Функция для выбора времени
  const handleSchedule = (car) => {
    setSelectedCar(car);
    setBookingType('day');
    setBookingDays(1);
    // Устанавливаем текущую дату и время + 1 час по умолчанию
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = `${String(now.getHours() + 1).padStart(2, '0')}:00`;
    setBookingDate(defaultDate);
    setBookingTime(defaultTime);
    setShowBookingModal(true);
  };

  // Функция склонения слова "час"
  const getHoursWord = (hours) => {
    if (hours % 10 === 1 && hours % 100 !== 11) return 'час';
    if ([2,3,4].includes(hours % 10) && ![12,13,14].includes(hours % 100)) return 'часа';
    return 'часов';
  };

  // Функция склонения слова "день"
  const getDaysWord = (days) => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if ([2,3,4].includes(days % 10) && ![12,13,14].includes(days % 100)) return 'дня';
    return 'дней';
  };

  // Подтверждение бронирования
  const confirmBooking = () => {
    const totalPrice = bookingType === 'hour' 
      ? selectedCar.price_per_hour * bookingHours
      : selectedCar.price_per_day * bookingDays;
    
    const duration = bookingType === 'hour'
      ? `${bookingHours} ${getHoursWord(bookingHours)}`
      : `${bookingDays} ${getDaysWord(bookingDays)}`;
    
    // Создаем объект бронирования
    const newBooking = {
      id: Date.now(),
      carBrand: selectedCar.brand,
      carModel: selectedCar.model,
      carImage: selectedCar.images[0],
      location: selectedCar.location,
      startDate: bookingDate ? `${bookingDate}T${bookingTime}` : new Date().toISOString(),
      endDate: bookingType === 'day' && bookingDays ? 
        new Date(new Date(`${bookingDate}T${bookingTime}`).getTime() + bookingDays * 24 * 60 * 60 * 1000).toISOString() 
        : null,
      duration: duration,
      price: totalPrice,
      status: 'active',
      totalHours: bookingType === 'hour' ? bookingHours : bookingDays * 24
    };

    // Получаем существующие бронирования
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    
    // Добавляем новое
    const updatedBookings = [newBooking, ...existingBookings];
    
    // Сохраняем
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

    setBookingMessage(
      `✅ Автомобиль ${selectedCar.brand} ${selectedCar.model} забронирован на ${duration}!\n` +
      `Сумма: ${totalPrice.toLocaleString()} ₽\n` +
      (bookingDate ? `Дата: ${bookingDate} ${bookingTime || ''}` : '')
    );
    
    // Скрываем модальное окно через 3 секунды
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingMessage('');
    }, 3000);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowBookingModal(false);
    setBookingMessage('');
  };

  const LoadingSpinner = () => (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onRetry} className="retry-btn">Повторить</button>
    </div>
  );

  return (
    <div className="home-page">
      <Header />
      
      <main className="main-content">
        {/* Hero секция */}
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-title-small">Добро пожаловать в</span>
              <span className="hero-title-large">GrandMotors</span>
            </h1>
            <p className="hero-subtitle">
              Автомобили премиум-класса в аренду — от 2000 ₽/час
            </p>
            <div className="hero-buttons">
              <Link to="/catalog" className="btn btn-primary">
                Найти автомобиль
              </Link>
              <button className="btn btn-outline">Как это работает</button>
            </div>
          </div>
        </section>

       

        {/* Секция с акциями */}
        <section className="promotions-section">
          <div className="container">
            <h2 className="section-title">Специальные предложения</h2>
            
            {loadingPromo ? (
              <LoadingSpinner />
            ) : errorPromo ? (
              <ErrorMessage 
                message={errorPromo} 
                onRetry={() => window.location.reload()} 
              />
            ) : (
              <div className="promotions-grid">
                {promotions.map((promo) => (
                  <div key={promo.id} className="promo-card">
                    <div className="promo-image">
                      <img src={promo.image} alt={promo.title} />
                    </div>
                    <div className="promo-content">
                      <h3>{promo.title}</h3>
                      <p>{promo.description}</p>
                      <span className="promo-code">{promo.code}</span>
                      <span className="promo-valid">
                        До {new Date(promo.valid_until).toLocaleDateString('ru-RU')}
                      </span>
                      <button className="promo-btn">Активировать</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Секция с автомобилями */}
        <section className="cars-section">
          <div className="container">
            {selectedCar ? (
              /* DETAIL VIEW */
              <div className="car-detail-view">
                <button className="back-button" onClick={handleBackToList}>
                  ← Назад к списку
                </button>
                
                <div className="car-detail-container">
                  <div className="car-detail-gallery">
                    <div className="main-image">
                      <img src={selectedCar.images[0]} alt={`${selectedCar.brand} ${selectedCar.model}`} />
                    </div>
                  </div>

                  <div className="car-detail-info">
                    <h2>{selectedCar.brand} {selectedCar.model}</h2>
                    <div className="car-location-detail">
                      📍 {selectedCar.location}
                    </div>
                    
                    <div className="car-price-row-detail">
                      <div className="price-option">
                        <span className="price-label">1 час</span>
                        <span className="price-value">{selectedCar.price_per_hour?.toLocaleString()} ₽</span>
                      </div>
                      <div className="price-option">
                        <span className="price-label">1 день</span>
                        <span className="price-value">{selectedCar.price_per_day?.toLocaleString()} ₽</span>
                      </div>
                    </div>
                    
                    <div className="car-detail-specs">
                      <div className="spec-item">
                        <span className="spec-label">Год</span>
                        <span className="spec-value">{selectedCar.year}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Двигатель</span>
                        <span className="spec-value">{selectedCar.engine}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Мощность</span>
                        <span className="spec-value">{selectedCar.horsepower} л.с.</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Привод</span>
                        <span className="spec-value">{selectedCar.drive}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Топливо</span>
                        <span className="spec-value">{selectedCar.fuel_type}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Расход</span>
                        <span className="spec-value">{selectedCar.fuel_consumption} л</span>
                      </div>
                    </div>

                    <p className="car-description">{selectedCar.description}</p>

                    <h3>Комплектация</h3>
                    <ul className="features-list">
                      {selectedCar.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>

                    <div className="action-buttons">
                      <button 
                        className="btn-rent"
                        onClick={() => handleRentNow(selectedCar)}
                      >
                        Забронировать сейчас
                      </button>
                      <button 
                        className="btn-schedule"
                        onClick={() => handleSchedule(selectedCar)}
                      >
                        Выбрать время
                      </button>
                    </div>

                    {!selectedCar.available && (
                      <div className="stock-warning">
                        ⚠️ Автомобиль временно недоступен. Попробуйте позже.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* LIST VIEW */
              <>
                <h2 className="section-title">Доступные автомобили</h2>
                
                {loadingCars ? (
                  <LoadingSpinner />
                ) : errorCars ? (
                  <ErrorMessage 
                    message={errorCars} 
                    onRetry={() => window.location.reload()} 
                  />
                ) : (
                  <>
                    <div className="cars-grid">
                      {/* Отображаем только первые 6 автомобилей */}
                      {cars.slice(0, 6).map((car) => (
                        <div 
                          key={car.id} 
                          className="car-card"
                        >
                          <div className="car-image-container" onClick={() => handleSelectCar(car)}>
                            <img 
                              src={car.images[0]} 
                              alt={`${car.brand} ${car.model}`} 
                              className="car-image"
                            />
                            {!car.available && (
                              <span className="out-of-stock">Недоступно</span>
                            )}
                            <div className="car-location-badge">
                              📍 {car.location}
                            </div>
                          </div>
                          <div className="car-info">
                            <h3 className="car-name">{car.brand} {car.model}</h3>
                            <div className="car-price-row">
                              <span className="car-price-label">от</span>
                              <span className="car-price-value">{car.price_per_hour?.toLocaleString()} ₽/час</span>
                            </div>
                            <div className="car-specs">
                              <span className="car-spec">{car.year}</span>
                              <span className="car-spec">{car.seats} мест</span>
                              <span className="car-spec">{car.transmission}</span>
                            </div>
                            <button 
                              className="car-btn"
                              onClick={() => handleRentNow(car)}
                            >
                              Забронировать
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Секция: Как это работает */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">Как это работает</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Найдите авто</h3>
                <p>Выберите автомобиль рядом с вами на карте</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Забронируйте</h3>
                <p>Забронируйте авто на нужное время</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Откройте и поезжайте</h3>
                <p>Откройте авто через приложение и отправляйтесь в путь</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Завершите поездку</h3>
                <p>Оставьте авто в любой зоне завершения</p>
              </div>
            </div>
          </div>
        </section>

        {/* Секция с блогом */}
        <section className="blog-section">
          <div className="container">
            <h2 className="section-title">Полезные статьи</h2>
            
            {loadingBlog ? (
              <LoadingSpinner />
            ) : errorBlog ? (
              <ErrorMessage 
                message={errorBlog} 
                onRetry={() => window.location.reload()} 
              />
            ) : (
              <div className="blog-grid">
                {blogPosts.map((post) => (
                  <div key={post.id} className="blog-card">
                    <div className="blog-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="blog-content">
                      <span className="blog-date">
                        {new Date(post.date).toLocaleDateString('ru-RU')}
                      </span>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="blog-footer">
                        <span className="blog-author">{post.author}</span>
                        <span className="blog-read-time">{post.read_time} мин</span>
                      </div>
                      <button className="blog-btn">Читать далее</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Модальное окно для бронирования */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {bookingMessage ? (
              <div className="booking-success">
                <div className="success-icon">✅</div>
                <h3>Бронирование подтверждено!</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{bookingMessage}</p>
              </div>
            ) : (
              <>
                <h3>Бронирование {selectedCar?.brand} {selectedCar?.model}</h3>
                
                <div className="booking-type-selector">
                  <button 
                    className={`booking-type-btn ${bookingType === 'hour' ? 'active' : ''}`}
                    onClick={() => setBookingType('hour')}
                  >
                    Почасовая
                  </button>
                  <button 
                    className={`booking-type-btn ${bookingType === 'day' ? 'active' : ''}`}
                    onClick={() => setBookingType('day')}
                  >
                    Посменная
                  </button>
                </div>

                {bookingType === 'hour' ? (
                  <div className="booking-form">
                    <label>
                      Количество часов:
                      <input 
                        type="number" 
                        min="1" 
                        max="24" 
                        value={bookingHours}
                        onChange={(e) => setBookingHours(parseInt(e.target.value) || 1)}
                      />
                    </label>
                    <div className="booking-price">
                      Итого: {(selectedCar?.price_per_hour * bookingHours).toLocaleString()} ₽
                    </div>
                  </div>
                ) : (
                  <div className="booking-form">
                    <label>
                      Количество дней:
                      <input 
                        type="number" 
                        min="1" 
                        max="30" 
                        value={bookingDays}
                        onChange={(e) => setBookingDays(parseInt(e.target.value) || 1)}
                      />
                    </label>
                    <label>
                      Дата начала:
                      <input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </label>
                    <label>
                      Время:
                      <input 
                        type="time" 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      />
                    </label>
                    <div className="booking-price">
                      Итого: {(selectedCar?.price_per_day * bookingDays).toLocaleString()} ₽
                    </div>
                  </div>
                )}

                <button 
                  className="booking-confirm-btn"
                  onClick={confirmBooking}
                >
                  Подтвердить бронирование
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;