import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import EventCard from '../components/EventCard';

const emptyEvent = { title: '', description: '', date: '', time: '', location: '' };

const Events = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await API.get('/api/events');
        setEvents(res.data);
        if (user) {
          const regRes = await API.get('/api/events/my-registrations');
          setRegisteredIds(new Set(regRes.data.map(r => r.eventId)));
        }
      } catch { setError('Failed to load events'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await API.delete(`/api/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch { alert('Delete failed'); }
  };

  const handleRegister = (eventId) => {
    setRegisteredIds(prev => new Set([...prev, eventId]));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.post('/api/events', form);
      setEvents([res.data, ...events]);
      setShowModal(false);
      setForm(emptyEvent);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header-row">
        <div><h1>🎉 Events Hub</h1><p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{events.length} upcoming events</p></div>
        {isAdmin && <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Event</button>}
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /><p>Loading events...</p></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && events.length === 0 && (
        <div className="empty-state"><div className="empty-icon">🎪</div><p>No events yet</p></div>
      )}

      <div className="cards-grid">
        {events.map(e => (
          <EventCard
            key={e.id}
            event={e}
            onDelete={handleDelete}
            onRegister={handleRegister}
            registered={registeredIds.has(e.id)}
          />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>+ Create New Event</h2>
            <form onSubmit={handleAddEvent}>
              <div className="form-group"><label>Event Title</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event name" /></div>
              <div className="form-group"><label>Description</label><textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Event details..." /></div>
              <div className="form-group"><label>Date</label><input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="form-group"><label>Time</label><input type="text" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM" /></div>
              <div className="form-group"><label>Location</label><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Venue / Room" /></div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
