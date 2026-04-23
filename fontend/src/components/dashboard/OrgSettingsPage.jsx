import React, { useState } from 'react';
import Card from '../common/Card';
import './OrgSettingsPage.css';

const OrgSettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [orgInfo, setOrgInfo] = useState({
    orgName: 'Relief Organization Inc.',
    contactEmail: 'contact@relief.org',
    phone: '+1-555-0300',
    address: '100 Aid Street, Houston, TX 77001',
    website: 'https://relief.org',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="org-settings-page">
      <div className="org-settings-header">
        <h1>Organization Settings</h1>
        <p>Update your organization profile and preferences</p>
      </div>

      {saved && (
        <div className="settings-alert success">✅ Settings saved successfully.</div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Card elevation="default">
          <Card.Header>🏢 Organization Profile</Card.Header>
          <Card.Body>
            <div className="settings-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="orgName">Organization Name</label>
                <input id="orgName" type="text" className="form-input" value={orgInfo.orgName} onChange={e => setOrgInfo({ ...orgInfo, orgName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="orgEmail">Contact Email</label>
                <input id="orgEmail" type="email" className="form-input" value={orgInfo.contactEmail} onChange={e => setOrgInfo({ ...orgInfo, contactEmail: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="orgPhone">Phone Number</label>
                <input id="orgPhone" type="tel" className="form-input" value={orgInfo.phone} onChange={e => setOrgInfo({ ...orgInfo, phone: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="orgAddress">Address</label>
                <input id="orgAddress" type="text" className="form-input" value={orgInfo.address} onChange={e => setOrgInfo({ ...orgInfo, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="orgWebsite">Website</label>
                <input id="orgWebsite" type="url" className="form-input" value={orgInfo.website} onChange={e => setOrgInfo({ ...orgInfo, website: e.target.value })} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card elevation="default">
          <Card.Header>🔔 Notification Preferences</Card.Header>
          <Card.Body>
            <div className="toggle-list">
              {[
                { id: 'notifCritical', label: 'Critical request alerts', desc: 'Get notified immediately for critical priority requests' },
                { id: 'notifAssigned', label: 'Assignment updates', desc: 'Receive updates when your requests are assigned or updated' },
                { id: 'notifComplete', label: 'Completion confirmations', desc: 'Get notified when a request is marked as completed' },
              ].map(item => (
                <div key={item.id} className="toggle-item">
                  <div>
                    <div className="toggle-label">{item.label}</div>
                    <div className="toggle-desc">{item.desc}</div>
                  </div>
                  <input type="checkbox" className="toggle-checkbox" defaultChecked />
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <div className="settings-footer">
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
};

export default OrgSettingsPage;
