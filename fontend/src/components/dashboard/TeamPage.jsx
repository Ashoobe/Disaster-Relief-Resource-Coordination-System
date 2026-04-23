import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import './TeamPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TeamPage = () => {
  const { token } = useAuth();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/v1/users/allusers?size=200`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to load team (${res.status})`);
        const json = await res.json();
        const allUsers = json?.data?.content ?? json?.data ?? [];
        // Keep organization_staff and admin users as "team members"
        const members = allUsers.filter(u => {
          const roles = Array.isArray(u.role) ? u.role : [u.role];
          return roles.some(r => {
            const normalized = String(r).replace('ROLE_', '').toUpperCase();
            return normalized === 'ORGANIZATION_STAFF' || normalized === 'ADMIN';
          });
        }).map(u => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          username: u.username,
          status: u.enabled ? 'active' : 'inactive',
        }));
        setTeam(members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTeam();
  }, [token]);

  const handleInvite = (e) => {
    e.preventDefault();
    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInvite(false);
  };

  return (
    <div className="team-page">
      <div className="team-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage your organization&apos;s team and permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
          ✉️ Invite Member
        </button>
      </div>

      <Card elevation="elevated">
        <Card.Body>
          {loading ? (
            <div className="team-footer"><p>Loading team members…</p></div>
          ) : error ? (
            <div className="team-footer"><p className="text-danger">{error}</p></div>
          ) : team.length === 0 ? (
            <div className="team-footer"><p>No team members found in the database.</p></div>
          ) : (
            <div className="team-table-wrapper">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="team-member-info">
                          <div className="team-avatar">{member.fullName.charAt(0)}</div>
                          <div>
                            <div className="team-name">{member.fullName}</div>
                            <div className="team-email">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="team-role">{member.username}</td>
                      <td>
                        <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                          {member.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="team-actions">
                          <button className="btn-icon-action" title="Edit" onClick={() => alert(`Edit ${member.fullName}`)}>✏️</button>
                          <button className="btn-icon-action btn-icon-danger" title="Remove" onClick={() => alert(`Remove ${member.fullName}`)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="team-footer">
            <p className="team-count">{team.length} team members</p>
          </div>
        </Card.Body>
      </Card>

      {/* Invite modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite Team Member</h2>
              <button className="modal-close" onClick={() => setShowInvite(false)}>×</button>
            </div>
            <form onSubmit={handleInvite}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="inviteEmail">Email Address</label>
                  <input
                    id="inviteEmail"
                    type="email"
                    className="form-input"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                    placeholder="colleague@organization.org"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;

