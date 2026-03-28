import React, { useState } from 'react';
import Card from '../common/Card';
import './SettingsPage.css';

const SettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Disaster Relief Resource Coordination System',
    contactEmail: 'admin@drrcs.org',
    timezone: 'America/Chicago',
    language: 'en',
    maxRequestsPerDay: '200',
  });
  const [notifSettings, setNotifSettings] = useState({
    emailOnCritical: true,
    emailOnAssigned: true,
    emailOnCompleted: false,
    smsOnCritical: true,
    digestFrequency: 'hourly',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>System Settings</h1>
        <p>Configure system-wide options and notification preferences</p>
      </div>

      {saved && (
        <div className="settings-alert success">
          ✅ Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* General Settings */}
        <Card elevation="default">
          <Card.Header>⚙️ General Configuration</Card.Header>
          <Card.Body>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="systemName">System Name</label>
                <input
                  id="systemName"
                  type="text"
                  className="form-input"
                  value={generalSettings.systemName}
                  onChange={e => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Admin Contact Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  className="form-input"
                  value={generalSettings.contactEmail}
                  onChange={e => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  className="form-select"
                  value={generalSettings.timezone}
                  onChange={e => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                >
                  <option value="America/New_York">Eastern (UTC-5)</option>
                  <option value="America/Chicago">Central (UTC-6)</option>
                  <option value="America/Denver">Mountain (UTC-7)</option>
                  <option value="America/Los_Angeles">Pacific (UTC-8)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="language">Default Language</label>
                <select
                  id="language"
                  className="form-select"
                  value={generalSettings.language}
                  onChange={e => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="maxRequests">Max Requests Per Day</label>
                <input
                  id="maxRequests"
                  type="number"
                  className="form-input"
                  min="1"
                  max="1000"
                  value={generalSettings.maxRequestsPerDay}
                  onChange={e => setGeneralSettings({ ...generalSettings, maxRequestsPerDay: e.target.value })}
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Notification Settings */}
        <Card elevation="default">
          <Card.Header>🔔 Notification Preferences</Card.Header>
          <Card.Body>
            <div className="settings-toggles">
              <div className="toggle-item">
                <div>
                  <div className="toggle-label">Email on Critical Requests</div>
                  <div className="toggle-desc">Receive email alerts for critical priority requests</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={notifSettings.emailOnCritical}
                  onChange={e => setNotifSettings({ ...notifSettings, emailOnCritical: e.target.checked })}
                />
              </div>
              <div className="toggle-item">
                <div>
                  <div className="toggle-label">Email on Assignment</div>
                  <div className="toggle-desc">Notify when a request is assigned to a volunteer</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={notifSettings.emailOnAssigned}
                  onChange={e => setNotifSettings({ ...notifSettings, emailOnAssigned: e.target.checked })}
                />
              </div>
              <div className="toggle-item">
                <div>
                  <div className="toggle-label">Email on Completion</div>
                  <div className="toggle-desc">Notify when a request is marked complete</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={notifSettings.emailOnCompleted}
                  onChange={e => setNotifSettings({ ...notifSettings, emailOnCompleted: e.target.checked })}
                />
              </div>
              <div className="toggle-item">
                <div>
                  <div className="toggle-label">SMS for Critical Alerts</div>
                  <div className="toggle-desc">Send SMS for critical emergency requests</div>
                </div>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={notifSettings.smsOnCritical}
                  onChange={e => setNotifSettings({ ...notifSettings, smsOnCritical: e.target.checked })}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label htmlFor="digest">Digest Frequency</label>
              <select
                id="digest"
                className="form-select"
                value={notifSettings.digestFrequency}
                onChange={e => setNotifSettings({ ...notifSettings, digestFrequency: e.target.value })}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </Card.Body>
        </Card>

        {/* Danger Zone */}
        <Card elevation="default">
          <Card.Header>⚠️ Danger Zone</Card.Header>
          <Card.Body>
            <div className="danger-zone">
              <div className="danger-item">
                <div>
                  <div className="danger-title">Clear All Completed Requests</div>
                  <div className="danger-desc">Permanently remove all requests with &ldquo;completed&rdquo; status. This cannot be undone.</div>
                </div>
                <button type="button" className="btn btn-danger" onClick={() => alert('This action is not yet implemented.')}>
                  Clear Data
                </button>
              </div>
              <div className="danger-item">
                <div>
                  <div className="danger-title">Reset System to Defaults</div>
                  <div className="danger-desc">Reset all settings to factory defaults. Users and requests are not affected.</div>
                </div>
                <button type="button" className="btn btn-danger" onClick={() => alert('This action is not yet implemented.')}>
                  Reset
                </button>
              </div>
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

export default SettingsPage;
