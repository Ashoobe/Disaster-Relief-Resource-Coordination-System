import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, LayoutDashboard, Menu, X } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const navItems = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'track-request', label: 'Track Request', to: '/track' },
  { key: 'live-activity', label: 'Live Activity', to: '/live-activity' },
  { key: 'services', label: 'Services', to: '/services' },
  { key: 'about', label: 'About', to: '/about' },
  { key: 'contact', label: 'Contact', to: '/contact' },
];

const actionItems = [
  {
    key: 'submit-request',
    label: 'Submit Request',
    to: '/submit-emergency-request',
    className: 'public-auth-link public-auth-link-primary',
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    className: 'public-auth-link public-auth-link-dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'sign-in',
    label: 'Sign In',
    to: '/login',
    className: 'public-auth-link',
  },
  {
    key: 'sign-up',
    label: 'Sign Up',
    to: '/register',
    className: 'public-auth-link',
  },
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
          {actionItems.map(({ key, label, to, className, icon: Icon }) => (
            <Link key={key} to={to} className={className}>
              {Icon ? <Icon size={15} /> : null}
              {label}
            </Link>
          ))}
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
          </nav>

          <div className="public-mobile-auth">
            <div className="public-mobile-theme">
              <ThemeToggle />
            </div>
            {actionItems.map(({ key, label, to, className, icon: Icon }) => (
              <Link
                key={`mobile-${key}`}
                to={to}
                className={className}
                onClick={() => setMobileMenuOpen(false)}
              >
                {Icon ? <Icon size={15} /> : null}
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicSiteHeader;
