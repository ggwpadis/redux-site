import carsData from '../data/cars.json';

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Ключ для хранения в localStorage
const STORAGE_KEY = 'grandmotors_cars';

// Инициализация данных (если в localStorage пусто, загружаем из JSON)
const initializeData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carsData.cars));
  }
};

// Получить все автомобили (READ - все)
export const fetchCars = async () => {
  try {
    await delay(800); // Имитация загрузки
    initializeData();
    const data = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка загрузки автомобилей:', error);
    throw error;
  }
};

// Получить один автомобиль по ID (READ - один)
export const fetchCarById = async (id) => {
  try {
    await delay(500);
    const cars = await fetchCars();
    const car = cars.find(c => c.id === parseInt(id));
    if (!car) throw new Error('Автомобиль не найден');
    return car;
  } catch (error) {
    console.error('Ошибка загрузки автомобиля:', error);
    throw error;
  }
};

// Создать новый автомобиль (CREATE)
export const createCar = async (carData) => {
  try {
    await delay(1000);
    const cars = await fetchCars();
    
    // Генерируем новый ID
    const newId = Math.max(...cars.map(c => c.id), 0) + 1;
    
    const newCar = {
      id: newId,
      ...carData,
      in_stock: carData.in_stock || true
    };
    
    const updatedCars = [...cars, newCar];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCars));
    
    return newCar;
  } catch (error) {
    console.error('Ошибка создания автомобиля:', error);
    throw error;
  }
};

// Обновить автомобиль (UPDATE)
export const updateCar = async (id, carData) => {
  try {
    await delay(1000);
    const cars = await fetchCars();
    
    const index = cars.findIndex(c => c.id === parseInt(id));
    if (index === -1) throw new Error('Автомобиль не найден');
    
    const updatedCar = {
      ...cars[index],
      ...carData,
      id: parseInt(id)
    };
    
    cars[index] = updatedCar;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    
    return updatedCar;
  } catch (error) {
    console.error('Ошибка обновления автомобиля:', error);
    throw error;
  }
};

// Удалить автомобиль (DELETE)
export const deleteCar = async (id) => {
  try {
    await delay(800);
    const cars = await fetchCars();
    
    const filteredCars = cars.filter(c => c.id !== parseInt(id));
    
    if (filteredCars.length === cars.length) {
      throw new Error('Автомобиль не найден');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCars));
    
    return { success: true, id };
  } catch (error) {
    console.error('Ошибка удаления автомобиля:', error);
    throw error;
  }
};