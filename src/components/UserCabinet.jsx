import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Добавлен импорт Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
  faHourglassHalf,
  faMoneyBillWave,
  faCar,
  faStar,
  faTimesCircle,
  faCheckCircle,
  faHistory,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import './UserCabinet.css';

const UserCabinet = ({ userBookings, onCancelBooking }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Загружаем бронирования из localStorage
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Фильтруем бронирования
  const activeBookings = bookings.filter(b => b.status === 'active');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      );
      setBookings(updatedBookings);
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      
      if (onCancelBooking) {
        onCancelBooking(bookingId);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return (
          <span className="status-badge active">
            <FontAwesomeIcon icon={faClock} /> Активно
          </span>
        );
      case 'completed':
        return (
          <span className="status-badge completed">
            <FontAwesomeIcon icon={faCheckCircle} /> Завершено
          </span>
        );
      case 'cancelled':
        return (
          <span className="status-badge cancelled">
            <FontAwesomeIcon icon={faTimesCircle} /> Отменено
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-cabinet">
      <div className="cabinet-header">
        <h2>Личный кабинет</h2>
        <div className="user-info">
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="user-details">
            <h3>Зарылбеков Адис</h3>
            <p>zarylbekov_a@iuca.kg</p>
          </div>
        </div>
      </div>

      <div className="cabinet-tabs">
        <button 
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <FontAwesomeIcon icon={faClock} /> Активные ({activeBookings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <FontAwesomeIcon icon={faCheckCircle} /> Завершенные ({completedBookings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          <FontAwesomeIcon icon={faTimesCircle} /> Отмененные ({cancelledBookings.length})
        </button>
      </div>

      <div className="bookings-list">
        {activeTab === 'active' && (
          <>
            {activeBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FontAwesomeIcon icon={faCar} />
                </div>
                <h3>Нет активных бронирований</h3>
                <p>Перейдите в каталог, чтобы забронировать автомобиль</p>
                <Link to="/catalog" className="btn-catalog">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              activeBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-image">
                    <img src={booking.carImage} alt={`${booking.carBrand} ${booking.carModel}`} />
                  </div>
                  <div className="booking-info">
                    <div className="booking-header">
                      <h3>{booking.carBrand} {booking.carModel}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="booking-details">
                      <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                        <span className="detail-label">Локация:</span>
                        <span className="detail-value">{booking.location}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                        <span className="detail-label">Дата:</span>
                        <span className="detail-value">{formatDate(booking.startDate)}</span>
                      </p>
                      {booking.endDate && (
                        <p>
                          <FontAwesomeIcon icon={faClock} className="detail-icon" />
                          <span className="detail-label">Окончание:</span>
                          <span className="detail-value">{formatDate(booking.endDate)}</span>
                        </p>
                      )}
                      <p>
                        <FontAwesomeIcon icon={faHourglassHalf} className="detail-icon" />
                        <span className="detail-label">Длительность:</span>
                        <span className="detail-value">{booking.duration}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="detail-icon" />
                        <span className="detail-label">Стоимость:</span>
                        <span className="detail-value">{booking.price.toLocaleString()} ₽</span>
                      </p>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-extend">
                        <FontAwesomeIcon icon={faClock} /> Продлить
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} /> Отменить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FontAwesomeIcon icon={faHistory} />
                </div>
                <h3>Нет завершенных поездок</h3>
                <p>Ваши завершенные поездки будут отображаться здесь</p>
                <Link to="/catalog" className="btn-catalog">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              completedBookings.map(booking => (
                <div key={booking.id} className="booking-card completed">
                  <div className="booking-image">
                    <img src={booking.carImage} alt={`${booking.carBrand} ${booking.carModel}`} />
                  </div>
                  <div className="booking-info">
                    <div className="booking-header">
                      <h3>{booking.carBrand} {booking.carModel}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="booking-details">
                      <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                        <span className="detail-label">Локация:</span>
                        <span className="detail-value">{booking.location}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                        <span className="detail-label">Дата:</span>
                        <span className="detail-value">{formatDate(booking.startDate)}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faClock} className="detail-icon" />
                        <span className="detail-label">Окончание:</span>
                        <span className="detail-value">{formatDate(booking.endDate)}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="detail-icon" />
                        <span className="detail-label">Стоимость:</span>
                        <span className="detail-value">{booking.price.toLocaleString()} ₽</span>
                      </p>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-rent-again">
                        <FontAwesomeIcon icon={faCar} /> Арендовать снова
                      </button>
                      <button className="btn-review">
                        <FontAwesomeIcon icon={faStar} /> Оставить отзыв
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'cancelled' && (
          <>
            {cancelledBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <h3>Нет отмененных бронирований</h3>
                <Link to="/catalog" className="btn-catalog">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              cancelledBookings.map(booking => (
                <div key={booking.id} className="booking-card cancelled">
                  <div className="booking-image">
                    <img src={booking.carImage} alt={`${booking.carBrand} ${booking.carModel}`} />
                  </div>
                  <div className="booking-info">
                    <div className="booking-header">
                      <h3>{booking.carBrand} {booking.carModel}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="booking-details">
                      <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                        <span className="detail-label">Локация:</span>
                        <span className="detail-value">{booking.location}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faCalendarAlt} className="detail-icon" />
                        <span className="detail-label">Дата:</span>
                        <span className="detail-value">{formatDate(booking.startDate)}</span>
                      </p>
                      <p>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="detail-icon" />
                        <span className="detail-label">Стоимость:</span>
                        <span className="detail-value">{booking.price.toLocaleString()} ₽</span>
                      </p>
                    </div>
                    <div className="booking-actions">
                      <button className="btn-rent-again">
                        <FontAwesomeIcon icon={faCar} /> Забронировать снова
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      <div className="cabinet-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCar} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{bookings.length}</span>
            <span className="stat-label">Всего поездок</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {bookings.reduce((acc, b) => acc + (b.totalHours || 0), 0)}
            </span>
            <span className="stat-label">Часов за рулем</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="stat-info">
            <span className="stat-value">4.8</span>
            <span className="stat-label">Рейтинг</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCabinet;