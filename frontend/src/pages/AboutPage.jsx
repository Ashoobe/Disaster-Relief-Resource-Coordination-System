import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './AboutPage.css';

const values = [
  {
    title: 'Fast Coordination',
    description:
      'We centralize urgent requests, track status changes, and reduce delays between intake and response.',
    icon: Target,
    tone: 'blue',
  },
  {
    title: 'Trusted Response',
    description:
      'We prioritize verified information, transparent request tracking, and clear communication with affected communities.',
    icon: ShieldCheck,
    tone: 'green',
  },
  {
    title: 'Community Support',
    description:
      'We connect responders, volunteers, and organizations so relief efforts stay aligned and people get help sooner.',
    icon: HeartHandshake,
    tone: 'orange',
  },
];

const operatingModel = [
  'Intake and validate emergency details quickly',
  'Prioritize requests by urgency, need, and location',
  'Coordinate organizations, staff, and volunteers in one workflow',
  'Provide visible tracking so requesters know what happens next',
];

const aboutStats = [
  { value: '24/7', label: 'Request visibility and response coordination' },
  { value: '3 Roles', label: 'Admin, volunteer, and organization workflows' },
  { value: '1 Hub', label: 'Single place for requests, tracking, and updates' },
];

const AboutPage = () => {
  return (
    <div className="home-page about-page">
      <PublicSiteHeader activeKey="about" />

      <main className="about-main">
        <section className="about-hero">
          <div className="about-shell about-hero-grid">
            <div className="about-hero-copy">
              <span className="about-eyebrow">About DRRCS</span>
              <h1>Built to coordinate disaster relief when every minute matters.</h1>
              <p>
                DRRCS is a disaster relief coordination platform focused on rapid intake,
                transparent tracking, and better alignment between the people requesting help
                and the teams responding to it.
              </p>
              <div className="about-hero-actions">
                <Link to="/submit-emergency-request" className="hero-btn hero-btn-primary">
                  <AlertCircle size={16} />
                  Submit Emergency Request
                </Link>
                <Link to="/contact" className="hero-btn hero-btn-secondary">
                  Contact Our Team
                </Link>
              </div>
            </div>

            <article className="about-hero-panel">
              <h2>What the platform supports</h2>
              <ul className="about-highlight-list">
                <li>Public emergency request submission</li>
                <li>Request tracking and status visibility</li>
                <li>Role-based workflows for response teams</li>
                <li>Operational visibility for ongoing activity</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="about-stats-band">
          <div className="about-shell">
            <div className="about-stats-grid">
              {aboutStats.map(({ value, label }) => (
                <article key={label} className="about-stat-card">
                  <h2>{value}</h2>
                  <p>{label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-story-section">
          <div className="about-shell about-story-grid">
            <div className="about-story-copy">
              <span className="about-section-kicker">Our Mission</span>
              <h2>Make disaster response more organized, visible, and accountable.</h2>
              <p>
                During emergencies, fragmented communication slows down relief. DRRCS is
                designed to reduce that friction by giving communities a clear way to submit
                urgent needs and giving response teams a shared operational view of requests,
                priorities, and progress.
              </p>
              <p>
                The platform supports coordination across administrators, volunteers, and
                organization staff so relief actions can move from intake to assignment with
                less confusion and better follow-through.
              </p>
            </div>

            <div className="about-story-card">
              <Users size={28} />
              <h3>People-first coordination</h3>
              <p>
                The goal is not just collecting requests. It is making sure the right people
                can see them, act on them, and communicate updates clearly.
              </p>
            </div>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-shell">
            <div className="about-section-heading">
              <span className="about-section-kicker">Core Focus</span>
              <h2>How the About page frames the platform</h2>
              <p>
                DRRCS centers on speed, clarity, and coordinated support for communities
                affected by disaster.
              </p>
            </div>

            <div className="about-values-grid">
              {values.map(({ title, description, icon: Icon, tone }) => (
                <article key={title} className="about-value-card">
                  <span className={`about-value-icon ${tone}`}>
                    <Icon size={22} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-model-section">
          <div className="about-shell about-model-grid">
            <div className="about-model-copy">
              <span className="about-section-kicker">How It Works</span>
              <h2>A simple operating model for urgent response.</h2>
              <p>
                The platform is structured to help requests move through intake, prioritization,
                coordination, and follow-up without losing visibility along the way.
              </p>
            </div>

            <div className="about-model-list">
              {operatingModel.map((item, index) => (
                <article key={item} className="about-model-step">
                  <span className="about-model-step-number">{index + 1}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="emergency-cta">
          <div className="emergency-cta-content about-shell">
            <h2>Need help or want to learn more?</h2>
            <p>
              Reach out to the DRRCS team, submit an emergency request, or review our public
              service information.
            </p>
            <div className="emergency-cta-actions">
              <Link to="/contact" className="emergency-btn emergency-btn-solid">
                <ArrowRight size={16} />
                Contact Us
              </Link>
              <Link to="/services" className="emergency-btn emergency-btn-outline">
                <ShieldCheck size={16} />
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default AboutPage;
