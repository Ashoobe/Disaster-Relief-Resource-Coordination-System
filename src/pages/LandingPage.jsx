import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header / Navigation */}
      <header className="landing-header" role="banner">
        <div className="landing-header-inner container">
          <div className="landing-logo">
            <span className="landing-logo-icon" aria-hidden="true">🆘</span>
            <span className="landing-logo-text">DRRCS</span>
          </div>
          <nav className="landing-nav" aria-label="Primary navigation">
            <a href="#about" className="landing-nav-link">About</a>
            <a href="#services" className="landing-nav-link">Services</a>
            <a href="#how-it-works" className="landing-nav-link">How It Works</a>
            <button
              className="landing-btn landing-btn-outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              className="landing-btn landing-btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content">
        <section className="landing-hero" aria-labelledby="hero-heading">
          <div className="container">
            <div className="hero-content">
              <h1 id="hero-heading" className="hero-title">
                Coordinating Relief When It Matters Most
              </h1>
              <p className="hero-subtitle">
                The Disaster Relief Resource Coordination System connects communities,
                volunteers, and organizations to deliver aid faster and more effectively
                during emergencies.
              </p>
              <div className="hero-actions">
                <button
                  className="landing-btn landing-btn-primary landing-btn-lg"
                  onClick={() => navigate('/register')}
                >
                  Request Assistance
                </button>
                <button
                  className="landing-btn landing-btn-outline landing-btn-lg"
                  onClick={() => navigate('/login')}
                >
                  Volunteer / Sign In
                </button>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-icon-grid">
                <div className="hero-icon-card">🏥</div>
                <div className="hero-icon-card">🚑</div>
                <div className="hero-icon-card">🍽️</div>
                <div className="hero-icon-card">🏠</div>
                <div className="hero-icon-card">👥</div>
                <div className="hero-icon-card">📦</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="landing-stats" aria-label="Impact statistics">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Requests Fulfilled</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Active Volunteers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">30+</div>
                <div className="stat-label">Partner Organizations</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Emergency Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="landing-section" aria-labelledby="about-heading">
          <div className="container">
            <h2 id="about-heading" className="section-title">About DRRCS</h2>
            <p className="section-subtitle">
              We bridge the gap between those in need and the resources available during
              natural disasters and emergencies.
            </p>
            <div className="about-grid">
              <div className="about-card">
                <div className="about-icon" aria-hidden="true">🎯</div>
                <h3>Our Mission</h3>
                <p>
                  To provide a centralized platform that streamlines disaster relief
                  efforts, ensuring aid reaches affected communities as quickly as possible.
                </p>
              </div>
              <div className="about-card">
                <div className="about-icon" aria-hidden="true">🤝</div>
                <h3>Our Approach</h3>
                <p>
                  We connect individuals, volunteers, and relief organizations through
                  a unified system that tracks resources and needs in real time.
                </p>
              </div>
              <div className="about-card">
                <div className="about-icon" aria-hidden="true">🌍</div>
                <h3>Our Impact</h3>
                <p>
                  Since launch, DRRCS has helped coordinate hundreds of relief operations,
                  reaching thousands of people affected by disasters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="landing-section landing-section-alt" aria-labelledby="services-heading">
          <div className="container">
            <h2 id="services-heading" className="section-title">What We Offer</h2>
            <p className="section-subtitle">
              A full suite of tools to coordinate disaster relief for every stakeholder.
            </p>
            <div className="services-grid">
              {[
                {
                  icon: '📋',
                  title: 'Resource Requests',
                  description:
                    'Submit requests for food, shelter, medical aid, clothing, or other essentials quickly and easily.',
                },
                {
                  icon: '🗺️',
                  title: 'Real-Time Tracking',
                  description:
                    'Track the status of your requests and see resources being mobilized in your area.',
                },
                {
                  icon: '🤲',
                  title: 'Volunteer Matching',
                  description:
                    'Volunteers are matched to tasks based on skills, location, and availability.',
                },
                {
                  icon: '🏢',
                  title: 'Organization Hub',
                  description:
                    'NGOs and relief organizations can manage teams, inventory, and field operations from one place.',
                },
                {
                  icon: '📊',
                  title: 'Admin Dashboard',
                  description:
                    'System administrators get a comprehensive view of all ongoing relief activities and resource allocation.',
                },
                {
                  icon: '🔔',
                  title: 'Alerts & Notifications',
                  description:
                    'Stay informed with real-time updates on your requests, assigned tasks, and emergency alerts.',
                },
              ].map((service) => (
                <div key={service.title} className="service-card">
                  <div className="service-icon" aria-hidden="true">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="landing-section" aria-labelledby="how-heading">
          <div className="container">
            <h2 id="how-heading" className="section-title">How It Works</h2>
            <p className="section-subtitle">Get help or give help in three simple steps.</p>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number" aria-hidden="true">1</div>
                <h3 className="step-title">Create an Account</h3>
                <p className="step-description">
                  Register as an individual in need, a volunteer, or a relief organization.
                  It only takes a few minutes.
                </p>
              </div>
              <div className="step-connector" aria-hidden="true">→</div>
              <div className="step-card">
                <div className="step-number" aria-hidden="true">2</div>
                <h3 className="step-title">Submit or Accept a Request</h3>
                <p className="step-description">
                  Describe the resources you need, or browse available tasks and requests
                  you can help fulfill.
                </p>
              </div>
              <div className="step-connector" aria-hidden="true">→</div>
              <div className="step-card">
                <div className="step-number" aria-hidden="true">3</div>
                <h3 className="step-title">Coordinate & Deliver</h3>
                <p className="step-description">
                  Our platform connects you with the right people and organizations to
                  deliver aid efficiently and safely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="landing-cta" aria-labelledby="cta-heading">
          <div className="container">
            <h2 id="cta-heading" className="cta-title">Ready to Make a Difference?</h2>
            <p className="cta-subtitle">
              Join hundreds of volunteers and organizations already using DRRCS to
              coordinate disaster relief efforts in your community.
            </p>
            <div className="cta-actions">
              <button
                className="landing-btn landing-btn-white landing-btn-lg"
                onClick={() => navigate('/register')}
              >
                Sign Up for Free
              </button>
              <button
                className="landing-btn landing-btn-outline-white landing-btn-lg"
                onClick={() => navigate('/login')}
              >
                I Already Have an Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="landing-logo">
                <span aria-hidden="true">🆘</span>
                <span className="landing-logo-text">DRRCS</span>
              </div>
              <p className="footer-tagline">
                Disaster Relief Resource Coordination System
              </p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Account</h4>
              <ul>
                <li>
                  <button className="footer-link-btn" onClick={() => navigate('/login')}>
                    Sign In
                  </button>
                </li>
                <li>
                  <button className="footer-link-btn" onClick={() => navigate('/register')}>
                    Register
                  </button>
                </li>
                <li>
                  <button className="footer-link-btn" onClick={() => navigate('/forgot-password')}>
                    Forgot Password
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Disaster Relief Resource Coordination System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
