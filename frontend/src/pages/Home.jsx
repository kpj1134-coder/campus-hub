import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* HERO */}
      <section className="hero-section">
        
        <h1 className="hero-title">
          Virtual Campus<br />
          <span className="gradient-text">Marketplace & Events Hub</span>
        </h1>
        <p className="hero-subtitle">
          Buy, sell, discover events, and get AI-powered campus assistance — all in one place for students.
        </p>
        <div className="hero-btns">
          <Link to="/marketplace" className="btn-primary">🛒 Browse Marketplace</Link>
          <Link to="/events" className="btn-secondary">🎉 Explore Events</Link>
        </div>
      </section>

      {/* FEATURES */}
      <div className="features-grid">
        {[
          { icon: '🛒', title: 'Campus Marketplace', desc: 'Buy and sell textbooks, electronics, and more with fellow students.' },
          { icon: '🎉', title: 'Events Hub', desc: 'Discover and register for campus events, workshops, and fests.' },
          { icon: '🤖', title: 'AI Chatbot', desc: 'Get instant answers to campus queries with our smart AI assistant.' },
          { icon: '🔔', title: 'Notifications', desc: 'Stay updated with real-time alerts for events and marketplace activity.' },
        ].map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="cta-section">
        {user ? (
          <>
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Continue where you left off</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn-primary">📊 My Dashboard</Link>
              <Link to="/chatbot" className="btn-secondary">🤖 AI Chatbot</Link>
            </div>
          </>
        ) : (
          <>
            <h2>Get Started Today</h2>
            <p>Join thousands of students already using Campus Hub</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary">🚀 Create Account</Link>
              <Link to="/login" className="btn-secondary">🔐 Login</Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
