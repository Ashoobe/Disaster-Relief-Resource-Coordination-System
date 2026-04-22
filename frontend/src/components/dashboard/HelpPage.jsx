import React, { useState } from 'react';
import Card from '../common/Card';
import './HelpPage.css';

const faqs = [
  {
    q: 'How do I claim a request?',
    a: 'Go to Available Requests in the sidebar. Find a request that matches your skills and click "Claim Request". The request will be assigned to you.',
  },
  {
    q: 'How do I mark a task as complete?',
    a: 'In your My Tasks section, find the task and click "Mark Complete". You can add notes about the outcome before submitting.',
  },
  {
    q: 'What if I cannot complete a task I claimed?',
    a: 'Open the task in My Tasks and click "Release Task". The request will return to the available pool. Please do this as soon as possible so others can pick it up.',
  },
  {
    q: 'Who do I contact in an emergency?',
    a: 'Call 911 immediately for any life-threatening situation. For coordination support, contact your admin at admin@drrcs.org.',
  },
  {
    q: 'How do I update my skills or availability?',
    a: 'Visit your profile by clicking your name in the top-right corner, then go to Profile Settings.',
  },
  {
    q: 'Can I volunteer offline without internet access?',
    a: 'Yes — download the PDF offline guide from the Resources section below. Your task list is also cached for 24 hours after last sync.',
  },
];

const resources = [
  { title: 'Volunteer Handbook (PDF)', desc: 'Complete guide for disaster relief volunteers', icon: '📘' },
  { title: 'First Aid Quick Reference', desc: 'Basic first aid procedures and checklists', icon: '🩺' },
  { title: 'Evacuation Protocols', desc: 'Step-by-step procedures for evacuation scenarios', icon: '🚨' },
  { title: 'Communication Guidelines', desc: 'How to communicate with affected individuals', icon: '💬' },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help &amp; Documentation</h1>
        <p>Guides, FAQs, and resources for volunteers</p>
      </div>

      {/* Search hint */}
      <Card elevation="default">
        <Card.Body>
          <div className="help-contact">
            <span className="help-contact-icon">📧</span>
            <div>
              <div className="help-contact-title">Need more help?</div>
              <div className="help-contact-desc">Contact the admin team at <a href="mailto:admin@drrcs.org">admin@drrcs.org</a> or call the coordination hotline: <strong>1-800-DRRCS-01</strong></div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* FAQ */}
      <Card elevation="default">
        <Card.Header>❓ Frequently Asked Questions</Card.Header>
        <Card.Body>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-chevron">{openIndex === i ? '▲' : '▼'}</span>
                </button>
                {openIndex === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Resources */}
      <Card elevation="default">
        <Card.Header>📚 Resources &amp; Downloads</Card.Header>
        <Card.Body>
          <div className="resources-grid">
            {resources.map((res, i) => (
              <button key={i} className="resource-card" onClick={() => alert(`Download: ${res.title}`)}>
                <span className="resource-icon">{res.icon}</span>
                <div className="resource-info">
                  <div className="resource-title">{res.title}</div>
                  <div className="resource-desc">{res.desc}</div>
                </div>
                <span className="resource-arrow">↓</span>
              </button>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HelpPage;
