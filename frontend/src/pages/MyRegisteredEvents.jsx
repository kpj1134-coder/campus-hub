import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import API from '../api/axios';
import { formatTimeAgo, formatDateTime } from '../utils/dateUtils';

const statusConfig = {
  PENDING:   { label: 'Pending Review', color: 'var(--warning)',  bg: 'rgba(245,158,11,0.15)', icon: '⏳' },
  APPROVED:  { label: 'Approved ✓',     color: 'var(--success)',  bg: 'rgba(16,185,129,0.15)', icon: '✅' },
  REJECTED:  { label: 'Rejected',       color: 'var(--danger)',   bg: 'rgba(239,68,68,0.15)',  icon: '❌' },
  CANCELLED: { label: 'Cancelled',      color: 'var(--text-dim)', bg: 'rgba(107,114,128,0.15)', icon: '🚫' },
};

const QRPass = ({ reg }) => {
  const canvasRef = useRef(null);
  const qrData = JSON.stringify({
    passId: reg.id,
    event: reg.eventTitle,
    attendee: reg.userName,
    date: reg.eventDate,
    time: reg.eventTime,
    venue: reg.eventLocation,
  });

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${reg.id}`);
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-hub-pass-${reg.eventTitle.replace(/\s+/g, '-')}.png`;
    a.click();
  };

  return (
    <div className="qr-pass-box">
      <div className="qr-header">
        <span>🎟️ Your Event Pass</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Show this at entry</span>
      </div>
      <div className="qr-code-wrapper">
        <QRCodeCanvas
          id={`qr-${reg.id}`}
          value={qrData}
          size={150}
          level="H"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#0f0f1a"
        />
      </div>
      <div className="qr-info">
        <p><strong>{reg.eventTitle}</strong></p>
        {reg.eventDate && <p>📅 {reg.eventDate}</p>}
        {reg.eventTime && <p>⏰ {reg.eventTime}</p>}
        {reg.eventLocation && <p>📍 {reg.eventLocation}</p>}
        <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Pass ID: {reg.id}</p>
      </div>
      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }} onClick={downloadQR}>
        ⬇️ Download Pass
      </button>
    </div>
  );
};

const MyRegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    API.get('/api/events/my-registrations')
      .then(r => setRegistrations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    setCancelling(id);
    try {
      await API.delete(`/api/events/registrations/${id}`);
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  const filters = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
  const displayed = filter === 'ALL' ? registrations : registrations.filter(r => r.status === filter);

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading registrations...</p></div>;

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>🎟️ My Registered Events</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/events" className="btn-secondary">🎉 Browse Events</Link>
      </div>

      {/* Status legend */}
      <div className="info-banner">
        ⏳ <strong>Pending</strong> = waiting for admin approval &nbsp;|&nbsp;
        ✅ <strong>Approved</strong> = QR pass is ready &nbsp;|&nbsp;
        ❌ <strong>Rejected</strong> = not approved
      </div>

      {/* Filter tabs */}
      <div className="filter-row" style={{ marginBottom: 24 }}>
        {filters.map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? `All (${registrations.length})` : `${statusConfig[f]?.icon} ${f} (${registrations.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {displayed.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎪</div>
          <p>No {filter !== 'ALL' ? filter.toLowerCase() : ''} registrations yet.</p>
          <Link to="/events" className="btn-primary" style={{ marginTop: 12 }}>Browse Events →</Link>
        </div>
      )}

      <div className="regs-grid">
        {displayed.map(r => {
          const cfg = statusConfig[r.status] || statusConfig.PENDING;
          return (
            <div key={r.id} className={`reg-detail-card ${r.status.toLowerCase()}`}>
              <div className="reg-card-header">
                <h3>🎉 {r.eventTitle}</h3>
                <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <div className="reg-card-meta">
                {r.eventDate && <div>📅 {r.eventDate}</div>}
                {r.eventTime && <div>⏰ {r.eventTime}</div>}
                {r.eventLocation && <div>📍 {r.eventLocation}</div>}
                <div className="reg-time">Registered: {formatTimeAgo(r.registeredAt)}</div>
              </div>

              {/* QR Pass — only for APPROVED */}
              {r.status === 'APPROVED' && <QRPass reg={r} />}

              {/* Cancel button — only for PENDING */}
              {r.status === 'PENDING' && (
                <button
                  className="btn-danger"
                  style={{ marginTop: 12, fontSize: '0.82rem' }}
                  onClick={() => handleCancel(r.id)}
                  disabled={cancelling === r.id}
                >
                  {cancelling === r.id ? '⏳ Cancelling...' : '❌ Cancel Registration'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRegisteredEvents;
