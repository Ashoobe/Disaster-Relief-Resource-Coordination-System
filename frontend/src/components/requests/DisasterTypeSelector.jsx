/**
 * Disaster Type Selector Component
 * Component for selecting disaster type with icons and descriptions
 */

import React from 'react';

const DISASTER_TYPES = [
  {
    id: 'earthquake',
    label: 'Earthquake',
    icon: '🏢',
    description: 'Ground shaking and structural damage'
  },
  {
    id: 'flood',
    label: 'Flood',
    icon: '💧',
    description: 'Water overflow and flooding'
  },
  {
    id: 'wildfire',
    label: 'Wildfire',
    icon: '🔥',
    description: 'Uncontrolled fire in vegetation'
  },
  {
    id: 'hurricane',
    label: 'Hurricane',
    icon: '🌪️',
    description: 'Tropical cyclone with strong winds'
  },
  {
    id: 'tornado',
    label: 'Tornado',
    icon: '⛈️',
    description: 'Violent rotating column of air'
  },
  {
    id: 'other',
    label: 'Other',
    icon: '⚠️',
    description: 'Other type of disaster'
  }
];

const DisasterTypeSelector = ({ value, onChange, error }) => {
  return (
    <div className="disaster-type-selector">
      <div className="disaster-types-grid">
        {DISASTER_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`disaster-type-button ${value === type.id ? 'active' : ''}`}
            onClick={() => onChange(type.id)}
            title={type.description}
          >
            <div className="disaster-type-icon">{type.icon}</div>
            <div className="disaster-type-label">{type.label}</div>
          </button>
        ))}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default DisasterTypeSelector;
