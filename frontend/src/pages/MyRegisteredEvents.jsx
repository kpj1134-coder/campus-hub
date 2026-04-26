import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const MyRegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/api/events/my-registrations');
        setRegistrations(res.data);
      } catch {
        setError('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (dt) => {
    if (!dt) return '';
    return new Date(dt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>🎟️ My Registered Events</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {registrations.length} event{registrations.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link to="/events" className="btn-secondary">🎉 Browse Events</Link>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading registrations...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && registrations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎪</div>
          <p>No event registrations yet.</p>
          <Link to="/events" className="btn-primary" style={{ marginTop: 12 }}>Browse Events</Link>
        </div>
      )}

      <div className="requests-list">
        {registrations.map(r => (
          <div className="request-card reg-card" key={r.id}>
            <div className="request-card-header">
              <div>
                <h3 className="request-product-title">🎉 {r.eventTitle}</h3>
                <span className={`request-status status-${r.status?.toLowerCase()}`}>
                  {r.status || 'CONFIRMED'}
                </span>
              </div>
              <span className="request-date">Registered: {formatDate(r.registeredAt)}</span>
            </div>
            <div className="request-body">
              {r.eventDate && (
                <div className="request-info-row">
                  <span className="info-label">📅 Date</span>
                  <span className="info-value">{r.eventDate}</span>
                </div>
              )}
              {r.eventTime && (
                <div className="request-info-row">
                  <span className="info-label">⏰ Time</span>
                  <span className="info-value">{r.eventTime}</span>
                </div>
              )}
              {r.eventLocation && (
                <div className="request-info-row">
                  <span className="info-label">📍 Venue</span>
                  <span className="info-value">{r.eventLocation}</span>
                </div>
              )}
              <div className="request-info-row">
                <span className="info-label">👤 Name</span>
                <span className="info-value">{r.userName}</span>
              </div>
              {r.userEmail && (
                <div className="request-info-row">
                  <span className="info-label">📧 Email</span>
                  <span className="info-value">{r.userEmail}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegisteredEvents;
