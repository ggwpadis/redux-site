import React, { useState } from 'react';
import './CarManagement.css';

const CarManagement = () => {
  // Состояние для списка автомобилей
  const [cars, setCars] = useState([
    { 
      id: 1, 
      brand: 'Mercedes-Benz', 
      model: 'S-Class', 
      year: 2024,
      price: 12000000,
      horsepower: 367,
      in_stock: true 
    },
    { 
      id: 2, 
      brand: 'BMW', 
      model: '7 Series', 
      year: 2024,
      price: 11500000,
      horsepower: 380,
      in_stock: true 
    },
    { 
      id: 3, 
      brand: 'Audi', 
      model: 'A8', 
      year: 2024,
      price: 10800000,
      horsepower: 340,
      in_stock: false 
    },
  ]);

  // Состояние для формы
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2024,
    price: '',
    horsepower: '',
    in_stock: true
  });

  // Состояние для редактирования
  const [editingId, setEditingId] = useState(null);

  // Обработка изменений в форме
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // CREATE - Добавить новый автомобиль
  const addCar = () => {
    if (formData.brand && formData.model && formData.price) {
      const newCar = {
        id: Date.now(), // временная генерация ID
        ...formData,
        price: Number(formData.price),
        horsepower: Number(formData.horsepower) || 0
      };
      setCars([...cars, newCar]);
      
      // Очистить форму
      setFormData({
        brand: '',
        model: '',
        year: 2024,
        price: '',
        horsepower: '',
        in_stock: true
      });
    } else {
      alert('Заполните обязательные поля: Марка, Модель, Цена');
    }
  };

  // UPDATE - Начать редактирование
  const startEdit = (car) => {
    setEditingId(car.id);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      horsepower: car.horsepower,
      in_stock: car.in_stock
    });
  };

  // UPDATE - Сохранить изменения
  const updateCar = () => {
    const updatedCars = cars.map(car => 
      car.id === editingId 
        ? { 
            ...car, 
            ...formData,
            price: Number(formData.price),
            horsepower: Number(formData.horsepower) 
          }
        : car
    );
    setCars(updatedCars);
    setEditingId(null);
    setFormData({
      brand: '',
      model: '',
      year: 2024,
      price: '',
      horsepower: '',
      in_stock: true
    });
  };

  // DELETE - Удалить автомобиль
  const deleteCar = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      setCars(cars.filter(car => car.id !== id));
    }
  };

  // Отмена редактирования
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      brand: '',
      model: '',
      year: 2024,
      price: '',
      horsepower: '',
      in_stock: true
    });
  };

  return (
    <div className="car-management">
      <h2>Управление автомобилями</h2>
      
      {/* Форма для создания/редактирования */}
      <div className="crud-form">
        <h3>{editingId ? 'Редактировать' : 'Добавить'} автомобиль</h3>
        
        <div className="form-row">
          <input
            type="text"
            name="brand"
            placeholder="Марка *"
            value={formData.brand}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="model"
            placeholder="Модель *"
            value={formData.model}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="year"
            placeholder="Год"
            value={formData.year}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Цена *"
            value={formData.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="horsepower"
            placeholder="Лошадиные силы"
            value={formData.horsepower}
            onChange={handleInputChange}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleInputChange}
            />
            В наличии
          </label>
        </div>

        <div className="form-actions">
          {editingId ? (
            <>
              <button className="btn-update" onClick={updateCar}>
                Обновить
              </button>
              <button className="btn-cancel" onClick={cancelEdit}>
                Отмена
              </button>
            </>
          ) : (
            <button className="btn-add" onClick={addCar}>
              Добавить автомобиль
            </button>
          )}
        </div>
      </div>

      {/* Список автомобилей */}
      <div className="cars-list">
        <h3>Список автомобилей</h3>
        <table className="cars-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Марка</th>
              <th>Модель</th>
              <th>Год</th>
              <th>Цена</th>
              <th>Л.с.</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.price.toLocaleString()} ₽</td>
                <td>{car.horsepower}</td>
                <td>
                  <span className={`status-badge ${car.in_stock ? 'in-stock' : 'out-stock'}`}>
                    {car.in_stock ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-edit" onClick={() => startEdit(car)}>
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => deleteCar(car.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarManagement;