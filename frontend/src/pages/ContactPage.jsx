import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './ContactPage.css';

const contactCards = [
  {
    title: 'Emergency Hotline',
    primary: '1-800-DISASTER',
    secondary: '(1-800-347-2783)',
    href: 'tel:1-800-DISASTER',
    icon: Phone,
    tone: 'blue',
  },
  {
    title: 'Email',
    primary: 'help@drrcs.org',
    secondary: 'info@drrcs.org',
    href: 'mailto:help@drrcs.org',
    icon: Mail,
    tone: 'green',
  },
  {
    title: 'Address',
    primary: '1 University Pkwy,',
    secondary: 'Romeoville, IL 60446',
    href: 'https://maps.google.com/?q=1+University+Pkwy+Romeoville+IL+60446',
    icon: MapPin,
    tone: 'orange',
  },
  {
    title: 'Hours',
    primary: '24/7',
    secondary: 'Always Available',
    href: null,
    icon: Clock3,
    tone: 'purple',
  },
];

const faqItems = [
  {
    question: 'How quickly do you respond to emergency requests?',
    answer:
      'We aim to respond to all emergency requests within 1-2 hours. Critical requests are prioritized and may receive immediate response. Our 24/7 hotline ensures someone is always available to take your call.',
  },
  {
    question: 'Is there a cost for your services?',
    answer:
      'No, all of our disaster relief services are provided free of charge to those in need. We are a non-profit organization funded by donations and grants dedicated to helping communities during disasters.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We provide services nationwide and have partnerships in over 50 countries worldwide. If we cannot directly serve your area, we will connect you with partner organizations that can assist.',
  },
  {
    question: 'How can I volunteer or donate?',
    answer:
      'We welcome volunteers and donations. Please email volunteer@drrcs.org for volunteer opportunities or donate@drrcs.org for information about supporting our mission financially.',
  },
];

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const ContactPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleFieldChange = (field) => (event) => {
    setSubmitted(false);
    setFormData((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData(initialFormState);
  };

  return (
    <div className="home-page contact-page">
      <PublicSiteHeader activeKey="contact" />

      <main className="contact-main">
        <section className="contact-hero-banner">
          <div className="contact-shell contact-hero-copy" data-animate="fade-up">
            <h1>Contact Us</h1>
            <p>
              Get in touch with our team. We&apos;re available 24/7 to respond to emergency requests
              and answer your questions.
            </p>
          </div>
        </section>

        <section className="contact-info-band">
          <div className="contact-shell">
            <div className="contact-info-grid">
              {contactCards.map(({ title, primary, secondary, href, icon: Icon, tone }, i) => {
                const content = (
                  <>
                    <span className={`contact-icon-chip ${tone}`}>
                      <Icon size={22} />
                    </span>
                    <h2>{title}</h2>
                    <p className="contact-card-primary">{primary}</p>
                    <p className="contact-card-secondary">{secondary}</p>
                  </>
                );

                return href ? (
                  <a key={title} href={href} className={`contact-info-card ${tone}`} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} data-animate="fade-up" data-delay={i * 100}>
                    {content}
                  </a>
                ) : (
                  <article key={title} className={`contact-info-card ${tone}`} data-animate="fade-up" data-delay={i * 100}>
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="contact-shell">
            <div className="contact-section-heading" data-animate="fade-up">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and our team will get back to you as soon as possible.</p>
            </div>

            <div className="contact-form-card" data-animate="fade-up" data-delay="100">
              <h3>Contact Form</h3>

              {submitted && (
                <div className="contact-form-success" role="status">
                  Your message has been queued. Our team will follow up shortly.
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <label className="contact-field">
                  <span>Full Name *</span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleFieldChange('fullName')}
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleFieldChange('email')}
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleFieldChange('phone')}
                  />
                </label>

                <label className="contact-field">
                  <span>Subject *</span>
                  <input
                    type="text"
                    placeholder="General Inquiry"
                    value={formData.subject}
                    onChange={handleFieldChange('subject')}
                    required
                  />
                </label>

                <label className="contact-field contact-field-full">
                  <span>Message *</span>
                  <textarea
                    rows="5"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleFieldChange('message')}
                    required
                  />
                </label>

                <div className="contact-emergency-note contact-field-full">
                  <strong>For emergencies:</strong> Please call our 24/7 hotline at{' '}
                  <a href="tel:1-800-DISASTER">1-800-DISASTER</a> or submit an emergency request through our{' '}
                  <Link to="/submit-emergency-request">emergency request form</Link>.
                </div>

                <button type="submit" className="contact-submit-btn contact-field-full">
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="contact-faq-section">
          <div className="contact-shell">
            <div className="contact-section-heading" data-animate="fade-up">
              <h2>Frequently Asked Questions</h2>
              <p>Quick answers to common questions about our services.</p>
            </div>

            <div className="contact-faq-list">
              {faqItems.map(({ question, answer }, i) => (
                <article key={question} className="contact-faq-card" data-animate="fade-up" data-delay={i % 2 * 100}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default ContactPage;
