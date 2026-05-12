import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, LayoutDashboard, Menu, X } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const navItems = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'services', label: 'Services', to: '/services' },
  { key: 'live-activity', label: 'Live Activity', to: '/live-activity' },
  { key: 'about', label: 'About', to: '/about' },
  { key: 'contact', label: 'Contact', to: '/contact' },
];

const PublicSiteHeader = ({ activeKey }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="public-header">
      <div className="public-header-content">
        <Link to="/" className="public-brand">
          <span className="public-brand-icon" aria-hidden="true">
            <Globe size={15} />
            <span className="public-brand-icon-accent"><Heart size={7} /></span>
          </span>
          <span>DRRCS</span>
        </Link>

        <nav className="public-nav" aria-label="Public navigation">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`public-nav-link ${activeKey === item.key ? 'public-nav-link-active' : ''}`.trim()}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="public-auth-links">
          <div className="public-theme-toggle" aria-label="Theme toggle">
            <ThemeToggle />
          </div>
          <Link to="/track" className="public-auth-link">Track Request</Link>
          <Link to="/login" className="public-auth-link">Sign In</Link>
          <Link to="/register" className="public-auth-link">Sign Up</Link>
          <Link to="/dashboard" className="public-auth-link public-auth-link-dashboard">
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
          <Link to="/submit-emergency-request" className="public-auth-link public-auth-link-primary">
            Submit Request
          </Link>
        </div>

        <div className="public-mobile-actions">
          <Link to="/dashboard" className="public-dashboard-link-mobile" aria-label="Go to dashboard">
            <LayoutDashboard size={18} />
          </Link>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Toggle mobile navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((previous) => !previous)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="public-mobile-menu">
          <nav className="public-mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.key}`}
                to={item.to}
                className={`public-nav-link ${activeKey === item.key ? 'public-nav-link-active' : ''}`.trim()}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="public-mobile-auth">
            <div className="public-mobile-theme" aria-label="Theme toggle">
              <ThemeToggle />
            </div>
            <Link to="/track" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Track Request</Link>
            <Link to="/login" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="public-auth-link" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            <Link to="/submit-emergency-request" className="public-auth-link public-auth-link-primary" onClick={() => setMobileMenuOpen(false)}>
              Submit Request
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicSiteHeader;
