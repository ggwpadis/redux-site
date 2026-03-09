import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faClock, 
  faGasPump,
  faCogs,
  faTachometerAlt,
  faUsers,
  faSearch,
  faFilter,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Catalog.css';

// Импортируем JSON данные
import carsData from '../data/cars.json';

const Catalog = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояния для фильтров
  const [filters, setFilters] = useState({
    brand: 'all',
    priceMin: '',
    priceMax: '',
    transmission: 'all',
    drive: 'all',
    seats: 'all',
    available: false
  });
  
  // Состояние для поиска
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояние для отображения фильтров на мобильных
  const [showFilters, setShowFilters] = useState(false);
  
  // Состояние для выбранного автомобиля (детальный просмотр)
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Состояние для бронирования
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState('hour');
  const [bookingHours, setBookingHours] = useState(1);
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  // Загрузка данных
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCars(carsData.cars);
        setFilteredCars(carsData.cars);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки автомобилей');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Применение фильтров
  useEffect(() => {
    let result = [...cars];

    // Поиск по названию
    if (searchTerm) {
      result = result.filter(car => 
        `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по бренду
    if (filters.brand !== 'all') {
      result = result.filter(car => car.brand === filters.brand);
    }

    // Фильтр по цене
    if (filters.priceMin) {
      result = result.filter(car => car.price_per_hour >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(car => car.price_per_hour <= parseInt(filters.priceMax));
    }

    // Фильтр по коробке передач
    if (filters.transmission !== 'all') {
      result = result.filter(car => car.transmission === filters.transmission);
    }

    // Фильтр по приводу
    if (filters.drive !== 'all') {
      result = result.filter(car => car.drive === filters.drive);
    }

    // Фильтр по количеству мест
    if (filters.seats !== 'all') {
      result = result.filter(car => car.seats === parseInt(filters.seats));
    }

    // Фильтр по доступности
    if (filters.available) {
      result = result.filter(car => car.available === true);
    }

    setFilteredCars(result);
  }, [cars, filters, searchTerm]);

  // Получить уникальные бренды для фильтра
  const brands = ['all', ...new Set(cars.map(car => car.brand))];

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      brand: 'all',
      priceMin: '',
      priceMax: '',
      transmission: 'all',
      drive: 'all',
      seats: 'all',
      available: false
    });
    setSearchTerm('');
  };

  // Выбор автомобиля для детального просмотра
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Возврат к списку
  const handleBackToList = () => {
    setSelectedCar(null);
  };

  // Бронирование
  const handleRentNow = (car) => {
    setSelectedCar(car);
    setBookingType('hour');
    setBookingHours(1);
    setShowBookingModal(true);
  };

  const handleSchedule = (car) => {
    setSelectedCar(car);
    setBookingType('day');
    setBookingDays(1);
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = `${String(now.getHours() + 1).padStart(2, '0')}:00`;
    setBookingDate(defaultDate);
    setBookingTime(defaultTime);
    setShowBookingModal(true);
  };

  const getHoursWord = (hours) => {
    if (hours % 10 === 1 && hours % 100 !== 11) return 'час';
    if ([2,3,4].includes(hours % 10) && ![12,13,14].includes(hours % 100)) return 'часа';
    return 'часов';
  };

  const getDaysWord = (days) => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if ([2,3,4].includes(days % 10) && ![12,13,14].includes(days % 100)) return 'дня';
    return 'дней';
  };

  const confirmBooking = () => {
    const totalPrice = bookingType === 'hour' 
      ? selectedCar.price_per_hour * bookingHours
      : selectedCar.price_per_day * bookingDays;
    
    const duration = bookingType === 'hour'
      ? `${bookingHours} ${getHoursWord(bookingHours)}`
      : `${bookingDays} ${getDaysWord(bookingDays)}`;
    
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

    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedBookings = [newBooking, ...existingBookings];
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

    setBookingMessage(
      `✅ Автомобиль ${selectedCar.brand} ${selectedCar.model} забронирован на ${duration}!\n` +
      `Сумма: ${totalPrice.toLocaleString()} ₽\n` +
      (bookingDate ? `Дата: ${bookingDate} ${bookingTime || ''}` : '')
    );
    
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingMessage('');
    }, 3000);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setBookingMessage('');
  };

  const LoadingSpinner = () => (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Загрузка автомобилей...</p>
    </div>
  );

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onRetry} className="retry-btn">Повторить</button>
    </div>
  );

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Каталог автомобилей</h1>
        <p>Выберите автомобиль для аренды</p>
      </div>

      {selectedCar ? (
        // Детальный просмотр
        <div className="car-detail-view">
          <button className="back-button" onClick={handleBackToList}>
            ← Назад к каталогу
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
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {selectedCar.location}
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
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span className="spec-label">Год</span>
                  <span className="spec-value">{selectedCar.year}</span>
                </div>
                <div className="spec-item">
                  <FontAwesomeIcon icon={faCogs} />
                  <span className="spec-label">КПП</span>
                  <span className="spec-value">{selectedCar.transmission}</span>
                </div>
                <div className="spec-item">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  <span className="spec-label">Мощность</span>
                  <span className="spec-value">{selectedCar.horsepower} л.с.</span>
                </div>
                <div className="spec-item">
                  <FontAwesomeIcon icon={faUsers} />
                  <span className="spec-label">Мест</span>
                  <span className="spec-value">{selectedCar.seats}</span>
                </div>
                <div className="spec-item">
                  <FontAwesomeIcon icon={faGasPump} />
                  <span className="spec-label">Топливо</span>
                  <span className="spec-value">{selectedCar.fuel_type}</span>
                </div>
                <div className="spec-item">
                  <FontAwesomeIcon icon={faClock} />
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
                  ⚠️ Автомобиль временно недоступен
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Список автомобилей с фильтрами
        <>
          {/* Поиск и фильтры */}
          <div className="catalog-controls">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Поиск по марке или модели..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} /> Фильтры
            </button>
          </div>

          <div className="catalog-content">
            {/* Фильтры */}
            <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
              <div className="filters-header">
                <h3>Фильтры</h3>
                <button className="close-filters" onClick={() => setShowFilters(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="filter-group">
                <label>Марка</label>
                <select 
                  value={filters.brand} 
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? 'Все марки' : brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Цена за час (₽)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="от"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="до"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Коробка передач</label>
                <select 
                  value={filters.transmission} 
                  onChange={(e) => setFilters({...filters, transmission: e.target.value})}
                >
                  <option value="all">Все</option>
                  <option value="Automatic">Автомат</option>
                  <option value="Manual">Механика</option>
                  <option value="Robot">Робот</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Привод</label>
                <select 
                  value={filters.drive} 
                  onChange={(e) => setFilters({...filters, drive: e.target.value})}
                >
                  <option value="all">Все</option>
                  <option value="AWD">Полный</option>
                  <option value="FWD">Передний</option>
                  <option value="RWD">Задний</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Количество мест</label>
                <select 
                  value={filters.seats} 
                  onChange={(e) => setFilters({...filters, seats: e.target.value})}
                >
                  <option value="all">Любое</option>
                  <option value="2">2 места</option>
                  <option value="4">4 места</option>
                  <option value="5">5 мест</option>
                  <option value="7">7 мест</option>
                </select>
              </div>

              <div className="filter-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.available}
                    onChange={(e) => setFilters({...filters, available: e.target.checked})}
                  />
                  Только доступные
                </label>
              </div>

              <button className="reset-filters" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            </div>

            {/* Результаты */}
            <div className="catalog-results">
              <div className="results-header">
                <p>Найдено автомобилей: <strong>{filteredCars.length}</strong></p>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage message={error} onRetry={() => window.location.reload()} />
              ) : filteredCars.length === 0 ? (
                <div className="no-results">
                  <FontAwesomeIcon icon={faSearch} />
                  <h3>Автомобили не найдены</h3>
                  <p>Попробуйте изменить параметры фильтрации</p>
                  <button className="reset-filters-btn" onClick={resetFilters}>
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <div className="cars-grid-catalog">
                  {filteredCars.map((car) => (
                    <div key={car.id} className="car-card-catalog">
                      <div className="car-image-container" onClick={() => handleSelectCar(car)}>
                        <img src={car.images[0]} alt={`${car.brand} ${car.model}`} />
                        {!car.available && (
                          <span className="out-of-stock">Недоступно</span>
                        )}
                        <div className="car-location-badge">
                          <FontAwesomeIcon icon={faMapMarkerAlt} /> {car.location}
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
                        <div className="car-features-mini">
                          <span><FontAwesomeIcon icon={faGasPump} /> {car.fuel_type}</span>
                          <span><FontAwesomeIcon icon={faCogs} /> {car.drive}</span>
                        </div>
                        <button 
                          className="car-btn"
                          onClick={() => handleRentNow(car)}
                          disabled={!car.available}
                        >
                          {car.available ? 'Забронировать' : 'Недоступно'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Модальное окно бронирования */}
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

export default Catalog;