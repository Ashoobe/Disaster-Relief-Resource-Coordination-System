import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Shield } from 'lucide-react';

const PublicSiteFooter = () => {
  return (
    <footer className="public-footer">
      <div className="public-footer-content">
        <div className="public-footer-grid">
          <section className="public-footer-about">
            <Link to="/" className="public-footer-brand" aria-label="Go to home page">
              <span className="public-brand-icon public-footer-brand-icon" aria-hidden="true">
                <Shield size={18} />
              </span>
              <div>
                <h3>DRRCS</h3>
                <p>Relief &amp; Response</p>
              </div>
            </Link>
            <p className="public-footer-copy">
              Rapid disaster coordination, emergency support, and request tracking for communities that need help fast.
            </p>
          </section>

          <section>
            <h4>Explore</h4>
            <ul className="public-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/live-activity">Live Activity</Link></li>
              <li><Link to="/track">Track Request</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </section>

          <section>
            <h4>Legal</h4>
            <ul className="public-footer-links">
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
            </ul>
          </section>

          <section>
            <h4>Contact</h4>
            <ul className="public-footer-contact">
              <li>
                <Phone size={14} />
                <span>1-800-DISASTER</span>
              </li>
              <li>
                <Mail size={14} />
                <span>help@drrcs.org</span>
              </li>
              <li className="public-footer-contact-text">
                <span>1 University Pkwy, Romeoville, IL 60446</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="public-footer-bottom">
          <p>&copy; 2026 DRRCS. Built for disaster response coordination and public request support.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicSiteFooter;
