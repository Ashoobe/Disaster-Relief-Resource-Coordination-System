/**
 * Resource Needs Section Component
 * Component for selecting and configuring resource needs with conditional fields
 */

import React from 'react';

const ResourceNeedsSection = ({ resourceNeeds, onChange, errors = {} }) => {
  const handleResourceCheck = (resource, checked) => {
    onChange({
      ...resourceNeeds,
      [resource]: {
        ...resourceNeeds[resource],
        needed: checked
      }
    });
  };

  const handleResourceChange = (resource, field, value) => {
    onChange({
      ...resourceNeeds,
      [resource]: {
        ...resourceNeeds[resource],
        [field]: value
      }
    });
  };

  const handleOtherResourcesChange = (value) => {
    onChange({
      ...resourceNeeds,
      other: value
    });
  };

  return (
    <div className="resource-needs-section">
      {/* Food & Water */}
      <div className="resource-item">
        <label className="resource-checkbox">
          <input
            type="checkbox"
            checked={resourceNeeds.food.needed}
            onChange={(e) => handleResourceCheck('food', e.target.checked)}
          />
          <span className="resource-label">🍞 Food & Water</span>
        </label>
        {resourceNeeds.food.needed && (
          <div className="resource-subfields">
            <input
              type="number"
              placeholder="Estimated number of people"
              min="1"
              value={resourceNeeds.food.people}
              onChange={(e) => handleResourceChange('food', 'people', e.target.value)}
              className="resource-input"
            />
            <textarea
              placeholder="Dietary requirements (e.g., vegetarian, gluten-free)"
              value={resourceNeeds.food.dietary}
              onChange={(e) => handleResourceChange('food', 'dietary', e.target.value)}
              className="resource-textarea"
              rows="3"
            />
          </div>
        )}
      </div>

      {/* Medical Supplies */}
      <div className="resource-item">
        <label className="resource-checkbox">
          <input
            type="checkbox"
            checked={resourceNeeds.medical.needed}
            onChange={(e) => handleResourceCheck('medical', e.target.checked)}
          />
          <span className="resource-label">⚕️ Medical Supplies</span>
        </label>
        {resourceNeeds.medical.needed && (
          <div className="resource-subfields">
            <div className="medical-supplies">
              <label>
                <input type="checkbox" defaultChecked />
                <span>First-aid kits</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>Antibiotics</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>Pain relievers</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>Bandages & dressings</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>IV fluids</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>Oxygen equipment</span>
              </label>
            </div>
            <div className="hospital-availability">
              <label className="radio-group">
                <input
                  type="radio"
                  name="hospital"
                  value="yes"
                  checked={resourceNeeds.medical.hospitalAvailable === true}
                  onChange={() => handleResourceChange('medical', 'hospitalAvailable', true)}
                />
                <span>Hospital available nearby</span>
              </label>
              <label className="radio-group">
                <input
                  type="radio"
                  name="hospital"
                  value="no"
                  checked={resourceNeeds.medical.hospitalAvailable === false}
                  onChange={() => handleResourceChange('medical', 'hospitalAvailable', false)}
                />
                <span>No hospital access</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Shelter */}
      <div className="resource-item">
        <label className="resource-checkbox">
          <input
            type="checkbox"
            checked={resourceNeeds.shelter.needed}
            onChange={(e) => handleResourceCheck('shelter', e.target.checked)}
          />
          <span className="resource-label">🏠 Shelter</span>
        </label>
        {resourceNeeds.shelter.needed && (
          <div className="resource-subfields">
            <input
              type="number"
              placeholder="Number of families needing shelter"
              min="1"
              value={resourceNeeds.shelter.families}
              onChange={(e) => handleResourceChange('shelter', 'families', e.target.value)}
              className="resource-input"
            />
            <textarea
              placeholder="Special requirements (e.g., families with children, elderly, disabilities)"
              value={resourceNeeds.shelter.requirements}
              onChange={(e) => handleResourceChange('shelter', 'requirements', e.target.value)}
              className="resource-textarea"
              rows="3"
            />
          </div>
        )}
      </div>

      {/* Search & Rescue */}
      <div className="resource-item">
        <label className="resource-checkbox">
          <input
            type="checkbox"
            checked={resourceNeeds.searchRescue.needed}
            onChange={(e) => handleResourceCheck('searchRescue', e.target.checked)}
          />
          <span className="resource-label">🚑 Search & Rescue</span>
        </label>
        {resourceNeeds.searchRescue.needed && (
          <div className="resource-subfields">
            <input
              type="number"
              placeholder="Number of people missing/trapped"
              min="0"
              value={resourceNeeds.searchRescue.missing}
              onChange={(e) => handleResourceChange('searchRescue', 'missing', e.target.value)}
              className="resource-input"
            />
            <textarea
              placeholder="Description of search area and conditions"
              value={resourceNeeds.searchRescue.description}
              onChange={(e) => handleResourceChange('searchRescue', 'description', e.target.value)}
              className="resource-textarea"
              rows="3"
            />
          </div>
        )}
      </div>

      {/* Other Resources */}
      <div className="resource-item">
        <label htmlFor="other-resources" className="resource-other-label">📦 Other Resources Needed:</label>
        <textarea
          id="other-resources"
          placeholder="List any other resources needed (e.g., generators, vehicles, communication equipment)"
          value={resourceNeeds.other}
          onChange={(e) => handleOtherResourcesChange(e.target.value)}
          className="resource-textarea"
          rows="3"
        />
      </div>
    </div>
  );
};

export default ResourceNeedsSection;
