import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const fetch = () => API.get('/api/notifications/unread-count')
      .then(r => setUnread(r.data.count || 0)).catch(() => {});
    fetch();
    const t = setInterval(fetch, 30000);
    return () => clearInterval(t);
  }, [user, location.pathname]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidebarOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = path => location.pathname === path || location.pathname.startsWith(path + '/');
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const navLinks = isAdmin ? [
    { to: '/dashboard',            icon: '📊', label: 'Dashboard' },
    { to: '/marketplace',          icon: '🛒', label: 'Marketplace' },
    { to: '/events',               icon: '🎉', label: 'Campus Events' },
    { to: '/admin/event-requests', icon: '🎓', label: 'Event Requests' },
    { to: '/contact-requests',     icon: '📬', label: 'Contact Requests' },
    { to: '/notifications',        icon: '🔔', label: 'Notifications', badge: unread },
    { to: '/chatbot',              icon: '🤖', label: 'AI Chatbot' },
    { to: '/profile',              icon: '👤', label: 'Profile' },
  ] : [
    { to: '/dashboard',             icon: '📊', label: 'Dashboard' },
    { to: '/marketplace',           icon: '🛒', label: 'Marketplace' },
    { to: '/events',                icon: '🎉', label: 'Campus Events' },
    { to: '/saved-products',        icon: '❤️', label: 'Saved Products' },
    { to: '/my-registered-events',  icon: '🎟️', label: 'My Events' },
    { to: '/contact-requests',      icon: '📬', label: 'Contact Requests' },
    { to: '/notifications',         icon: '🔔', label: 'Notifications', badge: unread },
    { to: '/chatbot',               icon: '🤖', label: 'AI Chatbot' },
    { to: '/profile',               icon: '👤', label: 'Profile' },
  ];

  return (
    <>
      {/* ── Minimal Top Bar ─────────────────────────────────── */}
      <header className="topbar">
        <button
          className="topbar-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>

        <Link to="/dashboard" className="topbar-brand">
          🎓 <span>Campus Hub</span>
        </Link>

        <div className="topbar-right">
          {unread > 0 && (
            <Link to="/notifications" className="topbar-notif" title="Notifications">
              🔔 <span className="topbar-badge">{unread > 9 ? '9+' : unread}</span>
            </Link>
          )}
          <Link to="/profile" className="topbar-user">
            {isAdmin ? '👑' : '🎓'} {user.name.split(' ')[0]}
          </Link>
        </div>
      </header>

      {/* ── Sidebar Overlay ─────────────────────────────────── */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar Drawer ──────────────────────────────────── */}
      <aside className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">🎓</span>
            <div>
              <div className="sidebar-brand-name">Campus Hub</div>
              <div className="sidebar-brand-role">{isAdmin ? '👑 Administrator' : '🎓 Student'}</div>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {/* User chip */}
        <div className="sidebar-user-chip">
          <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`sidebar-link ${isActive(l.to) ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{l.icon}</span>
              <span className="sidebar-link-label">{l.label}</span>
              {l.badge > 0 && (
                <span className="sidebar-badge">{l.badge > 9 ? '9+' : l.badge}</span>
              )}
              {isActive(l.to) && <span className="sidebar-active-dot" />}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
