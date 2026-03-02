import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "./Home.css";

// Импортируем JSON данные (фейковые данные)
import carsData from '../data/cars.json';

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  
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
        // Загрузка автомобилей с задержкой
        setLoadingCars(true);
        await delay(1500); // Имитация задержки сети 1.5 секунды
        setCars(carsData.cars);
        setErrorCars(null);
      } catch (err) {
        setErrorCars('Ошибка загрузки автомобилей');
        console.error(err);
      } finally {
        setLoadingCars(false);
      }

      try {
        // Загрузка акций с задержкой
        setLoadingPromo(true);
        await delay(1000); // Имитация задержки сети 1 секунда
        setPromotions(carsData.promotions);
        setErrorPromo(null);
      } catch (err) {
        setErrorPromo('Ошибка загрузки акций');
        console.error(err);
      } finally {
        setLoadingPromo(false);
      }

      try {
        // Загрузка блога с задержкой
        setLoadingBlog(true);
        await delay(1200); // Имитация задержки сети 1.2 секунды
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

  // Функция для выбора автомобиля (для DETAIL)
  const handleSelectCar = (car) => {
    setSelectedCar(car);
    
    // Прокрутка к секции с автомобилями
    const carsSection = document.querySelector('.cars-section');
    if (carsSection) {
      carsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Функция для возврата к списку
  const handleBackToList = () => {
    setSelectedCar(null);
  };

  // Компонент загрузки
  const LoadingSpinner = () => (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>Загрузка...</p>
    </div>
  );

  // Компонент ошибки
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
              Ваш автомобиль премиум-класса — ближе, чем вы думаете
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Смотреть каталог</button>
              <button className="btn btn-outline">Записаться на тест-драйв</button>
            </div>
          </div>
        </section>

        {/* Секция с акциями (второй контент) */}
        <section className="promotions-section">
          <div className="container">
            <h2 className="section-title">Специальные</h2>
            
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
                      <span className="promo-valid">
                        До {new Date(promo.valid_until).toLocaleDateString('ru-RU')}
                      </span>
                      <button className="promo-btn">Подробнее</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Секция с автомобилями (LIST/DETAIL - первый контент) */}
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
                    <div className="image-thumbnails">
                      {selectedCar.images.map((img, index) => (
                        <div key={index} className="thumbnail">
                          <img src={img} alt={`${selectedCar.brand} ${selectedCar.model} ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="car-detail-info">
                    <h2>{selectedCar.brand} {selectedCar.model}</h2>
                    <div className="car-detail-price">
                      {selectedCar.price.toLocaleString()} ₽
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
                    </div>

                    <p className="car-description">{selectedCar.description}</p>

                    <h3>Комплектация</h3>
                    <ul className="features-list">
                      {selectedCar.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>

                    <div className="action-buttons">
                      <button className="btn-test-drive">Записаться на тест-драйв</button>
                      <button className="btn-consultation">Консультация</button>
                    </div>

                    {!selectedCar.in_stock && (
                      <div className="stock-warning">
                        ⚠️ Временно отсутствует. Свяжитесь с менеджером.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* LIST VIEW */
              <>
                <h2 className="section-title">Наш автопарк</h2>
                
                {loadingCars ? (
                  <LoadingSpinner />
                ) : errorCars ? (
                  <ErrorMessage 
                    message={errorCars} 
                    onRetry={() => window.location.reload()} 
                  />
                ) : (
                  <div className="cars-grid">
                    {cars.map((car) => (
                      <div 
                        key={car.id} 
                        className="car-card"
                        onClick={() => handleSelectCar(car)}
                      >
                        <div className="car-image-container">
                          <img 
                            src={car.images[0]} 
                            alt={`${car.brand} ${car.model}`} 
                            className="car-image"
                          />
                          {!car.in_stock && (
                            <span className="out-of-stock">Нет в наличии</span>
                          )}
                          <div className="car-overlay">
                            <span className="car-price">{car.price.toLocaleString()} ₽</span>
                          </div>
                        </div>
                        <div className="car-info">
                          <h3 className="car-name">{car.brand} {car.model}</h3>
                          <div className="car-specs">
                            <span className="car-spec">{car.year}</span>
                            <span className="car-spec">{car.horsepower} л.с.</span>
                            <span className="car-spec">{car.transmission}</span>
                          </div>
                          <button className="car-btn">Подробнее</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Секция с блогом (третий контент) */}
        <section className="blog-section">
          <div className="container">
            <h2 className="section-title">Последние новости</h2>
            
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


    </div>
  );
};

export default HomePage;