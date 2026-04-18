import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const futureNavItems = ['About'];

const navItems = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'services', label: 'Services', to: '/services' },
  { key: 'live-activity', label: 'Live Activity', to: '/live-activity' },
  { key: 'track-request', label: 'Track Request', to: '/track' },
  { key: 'contact', label: 'Contact', to: '/contact' },
];

const PublicSiteHeader = ({ activeKey }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="public-header">
      <div className="public-header-content">
        <Link to="/" className="public-brand">
          <span className="public-brand-icon" aria-hidden="true">
            <Shield size={18} />
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
          {futureNavItems.map((item) => (
            <button
              key={item}
              type="button"
              className="public-nav-link public-nav-link-disabled"
              aria-disabled="true"
              title="Coming soon"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="public-auth-links">
          <div className="public-theme-toggle" aria-label="Theme toggle">
            <ThemeToggle />
          </div>
          <Link to="/login" className="public-auth-link">Sign In</Link>
          <Link to="/register" className="public-auth-link">Sign Up</Link>
          <Link to="/submit-emergency-request" className="public-auth-link public-auth-link-primary">
            Submit Request
          </Link>
        </div>

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
            {futureNavItems.map((item) => (
              <button
                key={`mobile-${item}`}
                type="button"
                className="public-nav-link public-nav-link-disabled"
                aria-disabled="true"
                title="Coming soon"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="public-mobile-auth">
            <div className="public-mobile-theme">
              <span>Theme</span>
              <ThemeToggle />
            </div>
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
