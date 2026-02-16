import React, { useState, useEffect } from 'react';
import { fetchCarById } from '../services/api';
import './CarDetail.css';

const CarDetail = ({ carId, onBack }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);
        const data = await fetchCarById(carId);
        setCar(data);
      } catch (err) {
        setError('Не удалось загрузить информацию об автомобиле');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      loadCar();
    }
  }, [carId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка деталей...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="error-container">
        <p>{error || 'Автомобиль не найден'}</p>
        <button onClick={onBack}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="car-detail">
      <button className="back-button" onClick={onBack}>
        ← Назад к списку
      </button>

      <div className="car-detail-container">
        <div className="car-detail-gallery">
          <div className="main-image">
            <img src={car.images[currentImage]} alt={`${car.brand} ${car.model}`} />
          </div>
          <div className="image-thumbnails">
            {car.images.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              >
                <img src={img} alt={`${car.brand} ${car.model} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="car-detail-info">
          <h1>{car.brand} {car.model}</h1>
          <div className="price-section">
            <span className="price-label">Цена:</span>
            <span className="price-value">{car.price.toLocaleString()} ₽</span>
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Год</span>
              <span className="spec-value">{car.year}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Двигатель</span>
              <span className="spec-value">{car.engine}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Мощность</span>
              <span className="spec-value">{car.horsepower} л.с.</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Разгон 0-100</span>
              <span className="spec-value">{car.acceleration} с</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Макс. скорость</span>
              <span className="spec-value">{car.max_speed} км/ч</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Расход</span>
              <span className="spec-value">{car.fuel_consumption} л/100км</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Привод</span>
              <span className="spec-value">{car.drive}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">КПП</span>
              <span className="spec-value">{car.transmission}</span>
            </div>
          </div>

          <div className="color-section">
            <span className="color-label">Цвет:</span>
            <span className="color-value">{car.color}</span>
          </div>

          <div className="interior-section">
            <span className="interior-label">Салон:</span>
            <span className="interior-value">{car.interior}</span>
          </div>

          <p className="car-description">{car.description}</p>

          <div className="features-section">
            <h3>Комплектация</h3>
            <ul className="features-list">
              {car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="action-buttons">
            <button className="btn-test-drive-detail">
              Записаться на тест-драйв
            </button>
            <button className="btn-consultation">
              Получить консультацию
            </button>
          </div>

          {!car.in_stock && (
            <div className="stock-warning">
              ⚠️ Данный автомобиль временно отсутствует в наличии. Свяжитесь с менеджером для уточнения сроков поставки.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;