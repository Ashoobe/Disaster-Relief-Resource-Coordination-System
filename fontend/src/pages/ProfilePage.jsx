import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  submitRoleRequest,
  getUserRoleRequest,
} from '../services/roleRequestService';

const UPGRADEABLE_ROLES = [
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'organization_staff', label: 'Organization Staff' },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const [pendingRequest, setPendingRequest] = useState(null);
  const [requestedRole, setRequestedRole] = useState('coordinator');
  const [reason, setReason] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success'|'error', message }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setPendingRequest(getUserRoleRequest(user.id));
    }
  }, [user]);

  const handleRoleRequest = (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setSubmitStatus(null);
    const result = submitRoleRequest(user, requestedRole, reason);
    if (result.success) {
      setPendingRequest(result.request);
      setReason('');
      setSubmitStatus({ type: 'success', message: result.message });
    } else {
      setSubmitStatus({ type: 'error', message: result.message });
    }
    setSubmitting(false);
  };

  const canRequestUpgrade =
    user?.role === 'volunteer' || user?.role === 'organization_staff';

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>My Profile</h1>
      <p style={{ color: 'var(--color-muted-foreground)' }}>View your account details.</p>

      <div style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: 0, marginBottom: 12 }}>Account</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 8, columnGap: 12 }}>
            <div style={{ color: 'var(--color-muted-foreground)' }}>Full Name</div>
            <div>{user?.fullName}</div>
            <div style={{ color: 'var(--color-muted-foreground)' }}>Email</div>
            <div>{user?.email}</div>
            <div style={{ color: 'var(--color-muted-foreground)' }}>Role</div>
            <div style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_',' ')}</div>
          </div>
        </div>

        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: 0, marginBottom: 12 }}>Security</h3>
          <button style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-muted)', cursor: 'pointer' }}
            onClick={() => alert('Password reset flow will be implemented later.')}
          >Change Password</button>
        </div>

        {/* Role Upgrade Request */}
        {canRequestUpgrade && (
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }}>
            <h3 style={{ margin: 0, marginBottom: 4 }}>Request Role Upgrade</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
              Need higher access? Submit a request and an admin will review it.
            </p>

            {pendingRequest ? (
              <div style={{ background: 'var(--color-muted)', borderRadius: 6, padding: '12px 14px', fontSize: '0.875rem' }}>
                <strong>Pending request:</strong> Upgrade to{' '}
                <span style={{ textTransform: 'capitalize' }}>{pendingRequest.requestedRole.replace('_', ' ')}</span>
                <br />
                <span style={{ color: 'var(--color-muted-foreground)' }}>
                  Submitted on {new Date(pendingRequest.submittedAt).toLocaleDateString()} · Awaiting admin approval
                </span>
              </div>
            ) : (
              <form onSubmit={handleRoleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 600 }}>
                    Requested Role
                  </label>
                  <select
                    value={requestedRole}
                    onChange={(e) => setRequestedRole(e.target.value)}
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-background)', width: '100%', maxWidth: 320 }}
                    disabled={submitting}
                  >
                    {UPGRADEABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 600 }}>
                    Reason <span style={{ fontWeight: 400, color: 'var(--color-muted-foreground)' }}>(optional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly explain why you need this role…"
                    rows={3}
                    style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-background)', width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem' }}
                    disabled={submitting}
                  />
                </div>
                {submitStatus && (
                  <div style={{
                    padding: '8px 12px', borderRadius: 6, fontSize: '0.875rem',
                    background: submitStatus.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: submitStatus.type === 'success' ? '#166534' : '#991b1b',
                  }}>
                    {submitStatus.message}
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ padding: '8px 20px', borderRadius: 6, background: 'var(--color-primary, #2563eb)', color: '#fff', border: 'none', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
                  >
                    {submitting ? 'Submitting…' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
