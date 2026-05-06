import React from 'react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './LegalPage.css';

const sections = [
  {
    title: 'Information We Collect',
    body:
      'When you submit a request or contact the team, we may collect your name, email address, phone number, organization details, location information, and message content needed to coordinate support.',
  },
  {
    title: 'How We Use Information',
    body:
      'We use submitted information to review requests, communicate updates, coordinate assistance, improve the platform, and maintain operational safety during disaster response activities.',
  },
  {
    title: 'Information Sharing',
    body:
      'We only share information with authorized responders, administrators, partner organizations, or service providers when it is necessary to support legitimate disaster relief coordination or platform operations.',
  },
  {
    title: 'Data Protection',
    body:
      'We use reasonable administrative and technical safeguards to protect submitted data. However, no online system can guarantee absolute security, especially during emergency response conditions.',
  },
  {
    title: 'Your Questions',
    body:
      'If you have privacy questions or want clarification about how information is handled, contact us at help@drrcs.org.',
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-page">
      <PublicSiteHeader activeKey={null} />
      <main className="legal-main">
        <div className="legal-shell">
          <article className="legal-card" data-animate="fade-up">
            <span className="legal-eyebrow">Legal</span>
            <h1>Privacy Policy</h1>
            <p className="legal-intro">
              This page explains the types of information DRRCS may collect and how that information is used to support emergency coordination.
            </p>

            {sections.map((section, i) => (
              <section key={section.title} className="legal-section" data-animate="fade-up" data-delay={i % 3 * 100}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </article>
        </div>
      </main>
      <PublicSiteFooter />
    </div>
  );
};

export default PrivacyPolicyPage;
