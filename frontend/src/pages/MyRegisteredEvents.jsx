import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';

const MyRegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

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

  const handleCancel = async (registrationId) => {
    if (!window.confirm('Cancel this event registration?')) return;
    setCancelling(registrationId);
    try {
      await API.delete(`/api/events/registrations/${registrationId}`);
      setRegistrations(registrations.map(r =>
        r.id === registrationId ? { ...r, status: 'CANCELLED' } : r
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
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

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && registrations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎪</div>
          <p>No event registrations yet.</p>
          <Link to="/events" className="btn-primary" style={{ marginTop: 12 }}>Browse Events →</Link>
        </div>
      )}

      <div className="requests-list">
        {registrations.map(r => (
          <div className={`request-card reg-card ${r.status === 'CANCELLED' ? 'cancelled' : ''}`} key={r.id}>
            <div className="request-card-header">
              <div>
                <h3 className="request-product-title">🎉 {r.eventTitle}</h3>
                <span className={`request-status status-${(r.status || 'confirmed').toLowerCase()}`}>
                  {r.status || 'CONFIRMED'}
                </span>
              </div>
              {/* Real registration timestamp */}
              <span className="request-date" title={formatDateTime(r.registeredAt)}>
                Registered: {formatTimeAgo(r.registeredAt)}
              </span>
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
            {r.status !== 'CANCELLED' && (
              <div style={{ marginTop: 12 }}>
                <button
                  className="btn-danger"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  onClick={() => handleCancel(r.id)}
                  disabled={cancelling === r.id}
                >
                  {cancelling === r.id ? '⏳ Cancelling...' : '❌ Cancel Registration'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRegisteredEvents;
