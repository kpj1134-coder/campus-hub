import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const EventCard = ({ event, onDelete, onRegister, registered }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(registered);
  const [regError, setRegError] = useState('');

  const handleRegister = async () => {
    if (!user) return alert('Please login to register for events');
    setLoading(true);
    setRegError('');
    try {
      await API.post(`/api/events/${event.id}/register`);
      setIsRegistered(true);
      if (onRegister) onRegister(event.id);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setRegError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <div className="event-date-badge">
          <span className="event-day">{event.date ? event.date.split('-')[2] : '--'}</span>
          <span className="event-month">
            {event.date ? new Date(event.date + 'T00:00:00').toLocaleString('default', { month: 'short' }) : ''}
          </span>
        </div>
        <div className="event-info">
          <h3 className="event-title">{event.title}</h3>
          <span className="event-organizer">by {event.organizer}</span>
        </div>
      </div>
      <p className="event-description">{event.description}</p>
      <div className="event-meta">
        <span>⏰ {event.time}</span>
        <span>📍 {event.location}</span>
      </div>

      {regError && (
        <div className="alert alert-error" style={{ marginTop: 8, fontSize: '0.85rem' }}>
          ⚠️ {regError}
        </div>
      )}

      <div className="event-footer">
        {user && !isAdmin && (
          <button
            className={isRegistered ? 'btn-registered' : 'btn-register'}
            onClick={handleRegister}
            disabled={isRegistered || loading}
          >
            {loading ? 'Registering...' : isRegistered ? '✅ Registered' : '🎟️ Register'}
          </button>
        )}
        {isAdmin && (
          <button className="btn-delete" onClick={() => onDelete(event.id)}>
            🗑️ Delete Event
          </button>
        )}
        {!user && (
          <span className="login-prompt">🔐 Login to register</span>
        )}
      </div>
    </div>
  );
};

export default EventCard;
