import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import API from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const res = await API.get('/api/notifications/unread-count');
        setUnreadCount(res.data.count || 0);
      } catch { /* non-critical */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const close = () => setMenuOpen(false);

  if (!user) return null;

  const navLinks = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/marketplace', label: '🛒 Marketplace' },
    { to: '/events', label: '🎉 Events' },
    { to: '/external-events', label: '🌐 Ext. Events' },
    { to: '/chatbot', label: '🤖 AI Chat' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand" onClick={close}>
          <span className="brand-icon">🎓</span>
          <span>Campus Hub</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={isActive(link.to)} onClick={close}>
              {link.label}
            </Link>
          ))}

          {/* Notifications with unread badge */}
          <Link to="/notifications" className={`nav-link notif-link ${location.pathname === '/notifications' ? 'active' : ''}`} onClick={close}>
            🔔 Alerts
            {unreadCount > 0 && (
              <span className="notif-count-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* User profile */}
          <Link to="/profile" className={`nav-user ${location.pathname === '/profile' ? 'nav-user-active' : ''}`} onClick={close}>
            <span className="user-badge">{user.role === 'admin' ? '👑' : '🎓'}</span>
            <span className="user-name">{user.name.split(' ')[0]}</span>
          </Link>

          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
