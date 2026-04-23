import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Clock,
  Users,
  Heart,
  Phone,
  Mail,
  Droplets,
  Flame,
  Wind,
  House,
  Shield,
} from 'lucide-react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <PublicSiteHeader activeKey="home" />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Rapid Response When Disaster Strikes</h1>
              <p>
                We provide coordinated emergency relief and support to communities affected by natural disasters. Available 24/7 to respond to your emergency needs.
              </p>
              <div className="hero-actions">
                <Link to="/submit-emergency-request" className="hero-btn hero-btn-primary">
                  <AlertCircle size={16} />
                  Submit Emergency Request
                </Link>
                <Link to="/track" className="hero-btn hero-btn-secondary">
                  <Clock size={16} />
                  Track Request
                </Link>
                <Link to="/live-activity" className="hero-btn hero-btn-secondary hero-btn-alert">
                  Live Activity
                </Link>
              </div>
            </div>

            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNhc3RlciUyMHJlbGllZiUyMGh1bWFuaXRhcmlhbiUyMGFpZHxlbnwxfHx8fDE3NzIwNjAxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Disaster relief workers assisting community members"
                className="hero-image"
              />
            </div>
          </div>
        </section>

        <section className="home-stats">
          <div className="home-stats-grid">
            <article className="home-stat-card">
              <span className="home-stat-icon home-stat-icon-blue"><Clock size={18} /></span>
              <h2 className="home-stat-value">24/7</h2>
              <p className="home-stat-label">Emergency Response</p>
            </article>
            <article className="home-stat-card">
              <span className="home-stat-icon home-stat-icon-green"><Users size={18} /></span>
              <h2 className="home-stat-value">10,000+</h2>
              <p className="home-stat-label">People Helped</p>
            </article>
            <article className="home-stat-card">
              <span className="home-stat-icon home-stat-icon-orange"><Shield size={18} /></span>
              <h2 className="home-stat-value">500+</h2>
              <p className="home-stat-label">Relief Operations</p>
            </article>
            <article className="home-stat-card">
              <span className="home-stat-icon home-stat-icon-red"><Heart size={18} /></span>
              <h2 className="home-stat-value">95%</h2>
              <p className="home-stat-label">Successful Outcomes</p>
            </article>
          </div>
        </section>

        <section className="services-section">
          <div className="services-content">
            <h2>Our Emergency Services</h2>
            <p>
              We provide comprehensive disaster response services to help communities during
              their most critical times.
            </p>

            <div className="services-grid">
              <article className="service-card">
                <span className="service-icon service-icon-blue"><Shield size={20} /></span>
                <h3>Search &amp; Rescue</h3>
                <p>
                  Rapid deployment of trained rescue teams to locate and evacuate people from disaster zones.
                </p>
              </article>

              <article className="service-card">
                <span className="service-icon service-icon-red"><Heart size={20} /></span>
                <h3>Medical Aid</h3>
                <p>
                  Emergency medical services and first aid for injured individuals during disasters.
                </p>
              </article>

              <article className="service-card">
                <span className="service-icon service-icon-green"><House size={20} /></span>
                <h3>Shelter &amp; Housing</h3>
                <p>
                  Temporary shelter and housing assistance for displaced families and individuals.
                </p>
              </article>

              <article className="service-card">
                <span className="service-icon service-icon-orange"><Users size={20} /></span>
                <h3>Relief Supplies</h3>
                <p>
                  Distribution of food, water, clothing, and essential supplies to affected communities.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="coverage-section">
          <div className="coverage-content">
            <h2>Disaster Response Coverage</h2>
            <p>Our team is trained and equipped to respond to all types of natural disasters.</p>
            <div className="coverage-grid">
              <article className="coverage-card" tabIndex="0">
                <span className="coverage-icon coverage-icon-blue"><Droplets size={18} /></span>
                <h3>Floods</h3>
                <p>Rapid rescue support, temporary shelter, and clean-water distribution.</p>
              </article>
              <article className="coverage-card" tabIndex="0">
                <span className="coverage-icon coverage-icon-orange"><Flame size={18} /></span>
                <h3>Wildfires</h3>
                <p>Evacuation coordination, respiratory aid, and emergency supply delivery.</p>
              </article>
              <article className="coverage-card" tabIndex="0">
                <span className="coverage-icon coverage-icon-purple"><Wind size={18} /></span>
                <h3>Hurricanes</h3>
                <p>Storm response teams for evacuation, shelter, and post-storm relief.</p>
              </article>
              <article className="coverage-card" tabIndex="0">
                <span className="coverage-icon coverage-icon-gray"><Wind size={18} /></span>
                <h3>Tornadoes</h3>
                <p>Immediate response for injuries, housing displacement, and debris impact.</p>
              </article>
              <article className="coverage-card" tabIndex="0">
                <span className="coverage-icon coverage-icon-red"><AlertCircle size={18} /></span>
                <h3>Earthquakes</h3>
                <p>Search assistance, first aid coordination, and urgent resource mobilization.</p>
              </article>
              <article className="coverage-card" tabIndex="0">
                <span className="coverage-icon coverage-icon-green"><Shield size={18} /></span>
                <h3>Other</h3>
                <p>Flexible emergency support for unexpected or complex disaster conditions.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="how-content">
            <h2>How Our System Works</h2>
            <p>Our streamlined process ensures rapid response to emergency situations.</p>
            <div className="how-grid">
              <article className="how-card">
                <span className="how-step">1</span>
                <h3>Submit Emergency Request</h3>
                <p>Report your emergency through our online form, phone hotline, or mobile app.</p>
              </article>
              <article className="how-card">
                <span className="how-step">2</span>
                <h3>Rapid Assessment</h3>
                <p>Our team evaluates the situation and assigns priority based on urgency and severity.</p>
              </article>
              <article className="how-card">
                <span className="how-step">3</span>
                <h3>Deploy Resources</h3>
                <p>Resources and response teams are dispatched immediately to provide assistance.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="emergency-cta">
          <div className="emergency-cta-content">
            <h2>Need Emergency Assistance?</h2>
            <p>Our team is standing by 24/7 to respond to disaster emergencies. Don't hesitate to reach out.</p>
            <div className="emergency-cta-actions">
              <Link to="/submit-emergency-request" className="emergency-btn emergency-btn-solid">
                <AlertCircle size={16} />
                Submit Emergency Request
              </Link>
              <a href="tel:1-800-DISASTER" className="emergency-btn emergency-btn-outline">
                <Phone size={16} />
                Call 1-800-DISASTER
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default HomePage;
