// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Загрузка данных из JSON
export const fetchCars = async () => {
  try {
    // Имитация задержки сети (1-2 секунды)
    await delay(Math.random() * 1000 + 1000);
    
    // Импортируем JSON данные
    const response = await import('../data/cars.json');
    return response.default.cars;
  } catch (error) {
    console.error('Ошибка загрузки автомобилей:', error);
    throw error;
  }
};

export const fetchCarById = async (id) => {
  try {
    await delay(800); // Задержка для детальной страницы
    const response = await import('../data/cars.json');
    const car = response.default.cars.find(c => c.id === parseInt(id));
    if (!car) throw new Error('Автомобиль не найден');
    return car;
  } catch (error) {
    console.error('Ошибка загрузки автомобиля:', error);
    throw error;
  }
};

export const fetchPromotions = async () => {
  try {
    await delay(600);
    const response = await import('../data/cars.json');
    return response.default.promotions;
  } catch (error) {
    console.error('Ошибка загрузки акций:', error);
    throw error;
  }
};

export const fetchBlogPosts = async () => {
  try {
    await delay(700);
    const response = await import('../data/cars.json');
    return response.default.blog;
  } catch (error) {
    console.error('Ошибка загрузки блога:', error);
    throw error;
  }
};

export const fetchBlogPostById = async (id) => {
  try {
    await delay(500);
    const response = await import('../data/cars.json');
    const post = response.default.blog.find(p => p.id === parseInt(id));
    if (!post) throw new Error('Пост не найден');
    return post;
  } catch (error) {
    console.error('Ошибка загрузки поста:', error);
    throw error;
  }
};