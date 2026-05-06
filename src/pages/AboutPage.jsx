import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, ShieldCheck, TimerReset, Users } from 'lucide-react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './AboutPage.css';

const pillars = [
  {
    title: 'Rapid coordination',
    description:
      'We connect affected communities, relief partners, and volunteers through a single response workflow designed to reduce delays.',
    icon: TimerReset,
  },
  {
    title: 'Trusted response',
    description:
      'Every request is reviewed with urgency, verified for context, and routed to the right people with clear status visibility.',
    icon: ShieldCheck,
  },
  {
    title: 'Community first',
    description:
      'We focus on people, not paperwork, by supporting organizations and individuals during the most critical hours after disaster strikes.',
    icon: HeartHandshake,
  },
];

const milestones = [
  { label: '24/7', detail: 'Emergency request intake and triage support' },
  { label: '500+', detail: 'Coordinated response operations across incidents' },
  { label: '10,000+', detail: 'People connected to relief resources and support' },
  { label: '3-part', detail: 'Workflow: request, coordinate, track resolution' },
];

const AboutPage = () => {
  return (
    <div className="home-page about-page">
      <PublicSiteHeader activeKey="about" />

      <main className="about-main">
        <section className="about-hero">
          <div className="about-shell about-hero-grid">
            <div className="about-hero-copy">
              <span className="about-eyebrow">About Disaster Relief Resource Coordination System</span>
              <h1>Built to help communities move from crisis to coordinated action.</h1>
              <p>
                Disaster Relief Resource Coordination System is a disaster relief resource coordination
                platform that helps emergency requests get seen, assessed, and acted on quickly. We
                support public request intake, operational visibility, and collaboration between relief
                teams and partner organizations.
              </p>
              <div className="about-hero-actions">
                <Link to="/submit-emergency-request" className="about-btn about-btn-primary">
                  Submit Emergency Request
                </Link>
                <Link to="/contact" className="about-btn about-btn-secondary">
                  Contact Our Team
                </Link>
              </div>
            </div>

            <aside className="about-hero-panel">
              <div className="about-hero-panel-inner">
                <Users size={28} />
                <h2>What we do</h2>
                <p>
                  We bring together requesters, responders, and coordinators in one system so that
                  needs are visible, response status is traceable, and support reaches the right place faster.
                  The platform helps teams intake emergency requests, prioritize actions, share updates,
                  and keep partner organizations aligned from first contact through follow-up.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="about-pillars-section">
          <div className="about-shell">
            <div className="about-section-heading">
              <h2>How Disaster Relief Resource Coordination System supports response work</h2>
              <p>
                The platform is designed around the parts of disaster response that fail most often:
                visibility, handoff speed, and accountability.
              </p>
            </div>

            <div className="about-pillars-grid">
              {pillars.map(({ title, description, icon: Icon }) => (
                <article key={title} className="about-pillar-card">
                  <span className="about-pillar-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-mission-section">
          <div className="about-shell about-mission-grid">
            <article className="about-story-card">
              <span className="about-card-label">Mission</span>
              <h2>Deliver faster relief through clearer coordination.</h2>
              <p>
                In fast-moving emergencies, disconnected communication creates delays and duplicated
                effort. Disaster Relief Resource Coordination System gives response teams a shared
                operating picture for incoming requests, field activity, and next actions.
              </p>
            </article>

            <article className="about-story-card about-story-card-accent">
              <span className="about-card-label">Approach</span>
              <h2>Simple workflows for high-pressure situations.</h2>
              <p>
                The experience is intentionally direct: submit a request, monitor response progress,
                and keep stakeholders aligned without forcing people through unnecessary admin work.
              </p>
            </article>
          </div>
        </section>

        <section className="about-metrics-section">
          <div className="about-shell">
            <div className="about-section-heading">
              <h2>Response model at a glance</h2>
            </div>

            <div className="about-metrics-grid">
              {milestones.map(({ label, detail }) => (
                <article key={label} className="about-metric-card">
                  <strong>{label}</strong>
                  <span>{detail}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta-section">
          <div className="about-shell about-cta-card">
            <div>
              <span className="about-card-label">Next step</span>
              <h2>Need support or want to coordinate with Disaster Relief Resource Coordination System?</h2>
              <p>
                Reach out to the team or submit an emergency request so we can route the situation
                to the appropriate response workflow.
              </p>
            </div>

            <div className="about-cta-actions">
              <Link to="/contact" className="about-btn about-btn-primary">
                Contact us
                <ArrowRight size={16} />
              </Link>
              <Link to="/track" className="about-btn about-btn-secondary">
                Track a request
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