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

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span>Campus Hub</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/marketplace" className={isActive('/marketplace')} onClick={() => setMenuOpen(false)}>
            🛒 Marketplace
          </Link>
          <Link to="/events" className={isActive('/events')} onClick={() => setMenuOpen(false)}>
            🎉 Events
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
                📊 Dashboard
              </Link>
              <Link to="/notifications" className={isActive('/notifications')} onClick={() => setMenuOpen(false)}>
                🔔 Notifications
              </Link>
              <div className="nav-user">
                <span className="user-badge">{user.role === 'admin' ? '👑' : '👤'}</span>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
