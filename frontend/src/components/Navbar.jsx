import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const close = () => setMenuOpen(false);

  // Navbar is only rendered when user is logged in (handled in App.jsx)
  // but we still guard here just in case
  if (!user) return null;

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
          <Link to="/marketplace" className={isActive('/marketplace')} onClick={close}>
            🛒 Marketplace
          </Link>
          <Link to="/events" className={isActive('/events')} onClick={close}>
            🎉 Events
          </Link>
          <Link to="/external-events" className={isActive('/external-events')} onClick={close}>
            🌐 External Events
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={close}>
            📊 Dashboard
          </Link>
          <Link to="/notifications" className={isActive('/notifications')} onClick={close}>
            🔔 Notifications
          </Link>
          <Link to="/chatbot" className={isActive('/chatbot')} onClick={close}>
            🤖 Chatbot
          </Link>

          <div className="nav-user">
            <span className="user-badge">{user.role === 'admin' ? '👑' : '👤'}</span>
            <span className="user-name">{user.name}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
