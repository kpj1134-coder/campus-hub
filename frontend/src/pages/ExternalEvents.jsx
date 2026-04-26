import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const EVENT_TYPES = ['All', 'Hackathon', 'Workshop', 'Technical Fest', 'Seminar', 'Competition', 'Cultural Fest'];

const ExternalEvents = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCity, setFilterCity] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', eventType: 'Hackathon', collegeName: '', city: '', state: '',
    startDate: '', endDate: '', sourceName: 'Knowafest', sourceUrl: ''
  });

  const fetchEvents = async () => {
    try {
      const res = await API.get('/api/external-events');
      setEvents(res.data);
    } catch {
      setError('Failed to load external events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filtered = events.filter(e => {
    const matchType = filterType === 'All' || e.eventType === filterType;
    const matchCity = !filterCity || e.city.toLowerCase().includes(filterCity.toLowerCase());
    const matchDate = !filterDate || e.startDate >= filterDate;
    return matchType && matchCity && matchDate;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this external event?')) return;
    try {
      await API.delete(`/api/external-events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch { alert('Delete failed'); }
  };

  const handleAdd = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      const res = await API.post('/api/external-events', form);
      setEvents([res.data, ...events]);
      setShowModal(false);
      setForm({ title: '', eventType: 'Hackathon', collegeName: '', city: '', state: '', startDate: '', endDate: '', sourceName: 'Knowafest', sourceUrl: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add event');
    } finally {
      setSaving(false);
    }
  };

  const typeColors = {
    Hackathon: '#7c3aed',
    Workshop: '#2563eb',
    'Technical Fest': '#059669',
    Seminar: '#d97706',
    Competition: '#dc2626',
    'Cultural Fest': '#db2777',
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>🌐 External Events</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            Real-world events from colleges across India · Source: Knowafest
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Event</button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-row" style={{ marginBottom: 12 }}>
          {EVENT_TYPES.map(t => (
            <button key={t} className={`filter-btn ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            className="filter-input"
            placeholder="🏙️ Filter by city..."
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
          />
          <input
            type="date"
            className="filter-input"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            title="Show events starting from this date"
          />
          {(filterCity || filterDate) && (
            <button className="btn-secondary" style={{ padding: '8px 16px' }} onClick={() => { setFilterCity(''); setFilterDate(''); }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading events...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🌐</div>
          <p>No external events found</p>
        </div>
      )}

      <div className="cards-grid">
        {filtered.map(ev => (
          <div className="external-event-card" key={ev.id}>
            <div className="ext-event-header">
              <span
                className="ext-event-type-badge"
                style={{ background: typeColors[ev.eventType] || '#6b7280' }}
              >
                {ev.eventType}
              </span>
              <span className="knowafest-badge">
                🔗 {ev.sourceName}
              </span>
            </div>
            <h3 className="ext-event-title">{ev.title}</h3>
            <div className="ext-event-meta">
              <span>🏛️ {ev.collegeName}</span>
              <span>📍 {ev.city}, {ev.state}</span>
            </div>
            <div className="ext-event-dates">
              <span>📅 {ev.startDate}</span>
              {ev.endDate && ev.endDate !== ev.startDate && (
                <span> → {ev.endDate}</span>
              )}
            </div>
            <div className="ext-event-footer">
              <a
                href={ev.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-knowafest"
              >
                🔗 View on Knowafest
              </a>
              {isAdmin && (
                <button className="btn-delete" onClick={() => handleDelete(ev.id)}>
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <h2>+ Add External Event (Knowafest)</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group"><label>Event Title</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Type</label>
                  <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
                    {EVENT_TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>College Name</label>
                  <input required value={form.collegeName} onChange={e => setForm({ ...form, collegeName: e.target.value })} placeholder="IIT Bombay" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>City</label>
                  <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" />
                </div>
                <div className="form-group"><label>State</label>
                  <input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Date</label>
                  <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="form-group"><label>End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group"><label>Knowafest URL</label>
                <input required type="url" value={form.sourceUrl} onChange={e => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://www.knowafest.com/..." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Adding...' : '+ Add Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalEvents;
