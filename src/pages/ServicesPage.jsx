import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Droplets,
  Flame,
  Heart,
  Home,
  Package,
  Phone,
  Shield,
  Stethoscope,
  Truck,
  Users,
  Wind,
} from 'lucide-react';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './ServicesPage.css';

const primaryServices = [
  {
    title: 'Emergency Medical Services',
    description:
      'Our medical teams provide critical care and first aid to injured individuals during and after disasters. We deploy mobile medical units equipped with essential supplies and staffed by experienced healthcare professionals.',
    bullets: [
      'Triage and emergency medical assessment',
      'On-site first aid and stabilization',
      'Medical transport coordination',
      'Prescription medication assistance',
    ],
    icon: Stethoscope,
    tone: 'red',
    image:
      'https://images.unsplash.com/photo-1692176961746-e3b5aeb9669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZW1lcmdlbmN5JTIwcmVzY3VlfGVufDF8fHx8MTc3MjA2MDEyN3ww&ixlib=rb-4.1.0&q=80&w=1200',
    imageAlt: 'Emergency medical helicopter assisting in a disaster response',
    reverse: false,
  },
  {
    title: 'Search & Rescue Operations',
    description:
      'Our trained search and rescue teams utilize advanced equipment and techniques to locate and evacuate people trapped in disaster zones. We coordinate with local emergency services to ensure efficient operations.',
    bullets: [
      'Urban search and rescue in collapsed structures',
      'Water rescue operations during floods',
      'Wilderness rescue in remote areas',
      'Evacuation coordination and transport',
    ],
    icon: Shield,
    tone: 'blue',
    image:
      'https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWxwaW5nJTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NzIwNjAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1200',
    imageAlt: 'Volunteers supporting search and rescue operations in flood waters',
    reverse: true,
  },
  {
    title: 'Shelter & Housing Assistance',
    description:
      'We provide temporary shelter solutions for displaced families and assist with longer-term housing recovery. Our shelters are safe, clean, and equipped with essential amenities.',
    bullets: [
      'Emergency shelter setup and management',
      'Temporary housing placement',
      'Housing repair and rebuilding assistance',
      'Rent and utility payment support',
    ],
    icon: Home,
    tone: 'green',
    image:
      'https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNhc3RlciUyMHJlbGllZiUyMGh1bWFuaXRhcmlhbiUyMGFpZHxlbnwxfHx8fDE3NzIwNjAxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1200',
    imageAlt: 'Disaster response truck supporting housing and relief operations',
    reverse: false,
  },
];

const supportServices = [
  {
    title: 'Relief Supplies Distribution',
    description:
      'Distribution of food, water, clothing, hygiene products, and other essential supplies to affected communities.',
    bullets: [
      'Food and water provisions',
      'Hygiene kits and sanitation supplies',
      'Clothing and blankets',
      'Baby supplies and formula',
    ],
    icon: Package,
    tone: 'orange',
  },
  {
    title: '24/7 Emergency Hotline',
    description:
      'Round-the-clock emergency support line staffed by trained professionals ready to assist and dispatch resources.',
    bullets: [
      'Emergency request intake',
      'Crisis counseling support',
      'Resource coordination',
      'Multilingual support',
    ],
    icon: Phone,
    tone: 'purple',
  },
  {
    title: 'Logistics & Transportation',
    description:
      'Coordination of transportation for people, supplies, and equipment to and from disaster areas.',
    bullets: [
      'Evacuation transportation',
      'Supply delivery logistics',
      'Equipment transport',
      'Fleet management',
    ],
    icon: Truck,
    tone: 'blue',
  },
  {
    title: 'Community Support Programs',
    description:
      'Long-term recovery programs to help communities rebuild and become more resilient.',
    bullets: [
      'Rebuilding assistance',
      'Financial aid programs',
      'Job placement support',
      'Community counseling',
    ],
    icon: Users,
    tone: 'green',
  },
  {
    title: 'Psychological Support',
    description:
      'Mental health and emotional support services for disaster survivors and their families.',
    bullets: [
      'Crisis counseling',
      'Trauma support groups',
      'Child and family services',
      'Long-term therapy referrals',
    ],
    icon: Heart,
    tone: 'red',
  },
  {
    title: 'Disaster Preparedness Training',
    description:
      'Educational programs to help communities prepare for and respond to future disasters.',
    bullets: [
      'Emergency preparedness workshops',
      'First aid training',
      'Evacuation planning',
      'Community resilience programs',
    ],
    icon: AlertCircle,
    tone: 'yellow',
  },
];

const disasterTypes = [
  {
    label: 'Floods',
    icon: Droplets,
    tone: 'blue',
    description: 'Swift-water rescue, temporary shelter, and clean-water distribution.',
  },
  {
    label: 'Wildfires',
    icon: Flame,
    tone: 'orange',
    description: 'Evacuation support, respiratory aid, and emergency supplies.',
  },
  {
    label: 'Hurricanes',
    icon: Wind,
    tone: 'purple',
    description: 'Storm response teams for evacuation, shelter, and recovery aid.',
  },
  {
    label: 'Tornadoes',
    icon: Wind,
    tone: 'gray',
    description: 'Immediate support for injuries, debris impacts, and displacement.',
  },
  {
    label: 'Earthquakes',
    icon: AlertCircle,
    tone: 'red',
    description: 'Search assistance, first aid coordination, and resource mobilization.',
  },
  {
    label: 'Other Emergencies',
    shortLabel: 'Other',
    secondaryLabel: 'Emergencies',
    icon: Shield,
    tone: 'green',
    description: 'Flexible disaster relief for complex and unexpected emergencies.',
  },
];

const ServicesPage = () => {
  return (
    <div className="services-page">
      <PublicSiteHeader activeKey="services" />

      <main className="services-main">
        <section className="services-hero">
          <div className="services-shell services-hero-copy">
            <h1>Our Services</h1>
            <p>
              Comprehensive disaster response and relief services available 24/7 to help
              communities in their time of greatest need.
            </p>
          </div>
        </section>

        <section className="services-primary-section">
          <div className="services-shell">
            <div className="services-primary-list">
              {primaryServices.map(
                ({ title, description, bullets, icon: Icon, tone, image, imageAlt, reverse }) => (
                  <article
                    key={title}
                    className={`services-primary-card ${reverse ? 'services-primary-card-reverse' : ''}`}
                  >
                    <div className="services-primary-media">
                      <img src={image} alt={imageAlt} />
                    </div>

                    <div className="services-primary-copy">
                      <span className={`services-icon-chip ${tone}`} aria-hidden="true">
                        <Icon size={28} />
                      </span>
                      <h2>{title}</h2>
                      <p>{description}</p>

                      <ul className="services-bullet-list">
                        {bullets.map((bullet) => (
                          <li key={bullet}>
                            <AlertCircle className={`services-bullet-icon ${tone}`} size={18} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        <section className="services-support-section">
          <div className="services-shell">
            <div className="services-section-heading">
              <h2>Additional Support Services</h2>
              <p>
                Beyond our core services, we provide comprehensive support to help communities
                recover and rebuild.
              </p>
            </div>

            <div className="services-support-grid">
              {supportServices.map(({ title, description, bullets, icon: Icon, tone }) => (
                <article key={title} className="services-support-card">
                  <span className={`services-icon-chip ${tone}`} aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ul>
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="coverage-section services-coverage-section">
          <div className="coverage-content services-shell">
            <div className="services-section-heading">
              <h2>Disaster Types We Respond To</h2>
              <p>
                Our teams are trained and equipped to respond to all types of natural and
                man-made disasters.
              </p>
            </div>

            <div className="coverage-grid services-coverage-grid">
              {disasterTypes.map(({ label, shortLabel, secondaryLabel, icon: Icon, tone, description }) => (
                <article key={label} className="coverage-card services-coverage-card" tabIndex="0">
                  <span className={`coverage-icon coverage-icon-${tone}`} aria-hidden="true">
                    <Icon size={30} />
                  </span>
                  <h3>
                    {shortLabel || label}
                    {secondaryLabel ? (
                      <>
                        <br />
                        {secondaryLabel}
                      </>
                    ) : null}
                  </h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="emergency-cta">
          <div className="emergency-cta-content services-shell">
            <h2>Need Emergency Assistance?</h2>
            <p>
              Our team is standing by 24/7 to respond to disaster emergencies. Don&apos;t
              hesitate to reach out.
            </p>

            <div className="emergency-cta-actions services-cta-actions">
              <Link
                to="/submit-emergency-request"
                className="emergency-btn emergency-btn-solid"
              >
                <AlertCircle size={18} />
                <span>Submit Emergency Request</span>
              </Link>
              <a href="tel:1-800-DISASTER" className="emergency-btn emergency-btn-outline">
                <Phone size={18} />
                <span>Call 1-800-DISASTER</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default ServicesPage;
