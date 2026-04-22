import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers } from '../../services/userService';
import './TeamPage.css';

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
        const response = await getAllUsers(token, { size: 200 });
        if (!response.success) {
          throw new Error(response.message || 'Failed to load team.');
        }
        const members = (response.users || []).filter(
          (candidate) => candidate.role === 'organization_staff' || candidate.role === 'admin'
        );
        setTeam(members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTeam();
    }
  }, [token]);

  const handleInvite = (event) => {
    event.preventDefault();
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
          Invite Member
        </button>
      </div>

      <Card elevation="elevated">
        <Card.Body>
          {loading ? (
            <div className="team-footer">
              <p>Loading team members...</p>
            </div>
          ) : error ? (
            <div className="team-footer">
              <p className="text-danger">{error}</p>
            </div>
          ) : team.length === 0 ? (
            <div className="team-footer">
              <p>No team members found in the database.</p>
            </div>
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
                  {team.map((member) => (
                    <tr key={member.id}>
                      <td data-label="Member">
                        <div className="team-member-info">
                          <div className="team-avatar">{member.fullName.charAt(0)}</div>
                          <div>
                            <div className="team-name">{member.fullName}</div>
                            <div className="team-email">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="team-role" data-label="Username">{member.username}</td>
                      <td data-label="Status">
                        <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                          {member.status}
                        </Badge>
                      </td>
                      <td data-label="Actions">
                        <div className="team-actions">
                          <button className="btn-icon-action" title="Edit" onClick={() => alert(`Edit ${member.fullName}`)}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn-icon-action btn-icon-danger" title="Remove" onClick={() => alert(`Remove ${member.fullName}`)}>
                            <Trash2 size={16} />
                          </button>
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

      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite Team Member</h2>
              <button className="modal-close" onClick={() => setShowInvite(false)}>
                X
              </button>
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
                    onChange={(event) => setInviteEmail(event.target.value)}
                    required
                    placeholder="colleague@organization.org"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInvite(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
