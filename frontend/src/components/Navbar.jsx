import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import API from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = () => API.get('/api/notifications/unread-count')
      .then(r => setUnread(r.data.count || 0))
      .catch(() => {});
    fetch();
    const t = setInterval(fetch, 30000);
    return () => clearInterval(t);
  }, [user, location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = path => location.pathname === path;
  const close = () => setMenuOpen(false);
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const studentLinks = [
    { to: '/dashboard',            label: '📊 Dashboard' },
    { to: '/marketplace',          label: '🛒 Market' },
    { to: '/events',               label: '🎉 Events' },
    { to: '/saved-products',       label: '❤️ Saved' },
    { to: '/my-registered-events', label: '🎟️ My Events' },
    { to: '/contact-requests',     label: '📬 Requests' },
    { to: '/chatbot',              label: '🤖 AI' },
  ];

  const adminLinks = [
    { to: '/dashboard',            label: '📊 Dashboard' },
    { to: '/marketplace',          label: '🛒 Market' },
    { to: '/events',               label: '🎉 Events' },
    { to: '/admin/event-requests', label: '🎓 Approvals' },
    { to: '/contact-requests',     label: '📬 Requests' },
    { to: '/chatbot',              label: '🤖 AI' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand" onClick={close}>
          <span className="brand-icon">🎓</span>
          <span>Campus Hub</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`} onClick={close}>
              {l.label}
            </Link>
          ))}

          {/* Notifications bell with badge */}
          <Link to="/notifications" className={`nav-link notif-link ${isActive('/notifications') ? 'active' : ''}`} onClick={close}>
            🔔
            {unread > 0 && <span className="notif-count-badge">{unread > 9 ? '9+' : unread}</span>}
          </Link>

          {/* User profile chip */}
          <Link to="/profile" className={`nav-user ${isActive('/profile') ? 'nav-user-active' : ''}`} onClick={close}>
            <span>{isAdmin ? '👑' : '🎓'}</span>
            <span className="user-name">{user.name.split(' ')[0]}</span>
          </Link>

          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
