import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Events from './pages/Events';
import ExternalEvents from './pages/ExternalEvents';
import Notifications from './pages/Notifications';
import Chatbot from './pages/Chatbot';
import ContactRequests from './pages/ContactRequests';
import MyRegisteredEvents from './pages/MyRegisteredEvents';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading Campus Hub...</p>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Navbar is only rendered when user is logged in */}
      {user && <Navbar />}

      <main className={user ? 'main-content' : 'main-content-auth'}>
        <Routes>
          {/* Public routes - only accessible when NOT logged in */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />

          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/external-events" element={<ProtectedRoute><ExternalEvents /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/contact-requests" element={<ProtectedRoute><ContactRequests /></ProtectedRoute>} />
          <Route path="/my-registered-events" element={<ProtectedRoute><MyRegisteredEvents /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>

      {user && (
        <footer className="footer">
          <p>🎓 Campus Hub &copy; 2024 | Virtual Campus Marketplace &amp; Events</p>
        </footer>
      )}
    </div>
  );
}

export default App;
