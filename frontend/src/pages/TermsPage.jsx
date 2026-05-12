import React from 'react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './LegalPage.css';

const sections = [
  {
    title: 'Use of the Platform',
    body:
      'DRRCS is intended to help individuals, volunteers, organizations, and coordinators communicate disaster-related needs and response activity. You agree to use the platform honestly, lawfully, and only for legitimate relief coordination purposes.',
  },
  {
    title: 'Emergency Information',
    body:
      'You are responsible for submitting accurate request details, location data, and contact information. False, misleading, or abusive submissions may delay emergency response and may result in access restrictions.',
  },
  {
    title: 'Availability',
    body:
      'We work to keep the platform available at all times, but uninterrupted service cannot be guaranteed. During outages or severe incidents, users should still contact emergency services or the hotline when immediate help is needed.',
  },
  {
    title: 'Third-Party Data',
    body:
      'Some pages may display data from third-party feeds, maps, or public alert systems. Those sources remain responsible for their own accuracy, timeliness, and availability.',
  },
  {
    title: 'Contact',
    body:
      'Questions about these terms can be directed to help@drrcs.org or through the public contact page.',
  },
];

const TermsPage = () => {
  return (
    <div className="legal-page">
      <PublicSiteHeader activeKey={null} />
      <main className="legal-main">
        <div className="legal-shell">
          <article className="legal-card" data-animate="fade-up">
            <span className="legal-eyebrow">Legal</span>
            <h1>Terms &amp; Conditions</h1>
            <p className="legal-intro">
              These terms describe the basic rules for using the DRRCS public website and response coordination tools.
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

export default TermsPage;
