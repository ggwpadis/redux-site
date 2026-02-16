import React, { useState, useEffect } from 'react';
import { fetchCars } from '../services/api';
import './CarList.css';

const CarList = ({ onSelectCar }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const data = await fetchCars();
        setCars(data);
      } catch (err) {
        setError('Не удалось загрузить автомобили');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка автомобилей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="car-list">
      <h2 className="car-list-title">Наш автопарк</h2>
      <div className="car-grid">
        {cars.map(car => (
          <div 
            key={car.id} 
            className="car-list-item"
            onClick={() => onSelectCar(car)}
          >
            <div className="car-list-image">
              <img src={car.images[0]} alt={`${car.brand} ${car.model}`} />
              {!car.in_stock && (
                <span className="stock-badge out">Нет в наличии</span>
              )}
            </div>
            <div className="car-list-info">
              <h3>{car.brand} {car.model}</h3>
              <p className="car-list-price">
                {car.price.toLocaleString()} ₽
              </p>
              <div className="car-list-specs">
                <span>{car.year} г.</span>
                <span>{car.horsepower} л.с.</span>
                <span>{car.transmission}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;