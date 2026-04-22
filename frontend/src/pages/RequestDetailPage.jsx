import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import {
  canAssignRequests,
  canUpdateAssignedRequest,
  canViewRequestDetails,
  getDefaultRouteForRole,
} from '../lib/permissions';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers, getVolunteers } from '../services/userService';
import { createRequestAssignedNotification, createRequestCompletedNotification } from '../services/notificationService';
import './RequestDetailPage.css';

const RequestDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [request, setRequest] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const requestPromise = api.getRequestById(id);
        const assigneePoolPromise = user?.role === 'admin'
          ? getAllUsers(token, { status: 'all' })
          : getVolunteers(token, { status: 'active' });

        const [requestData, assigneePoolResponse] = await Promise.all([
          requestPromise,
          assigneePoolPromise,
        ]);

        const loadedUsers = user?.role === 'admin'
          ? (assigneePoolResponse?.users || [])
          : (assigneePoolResponse?.volunteers || []);

        const activeUsers = loadedUsers.filter((candidate) => candidate.status !== 'inactive');
        const hasCurrentUser = activeUsers.some((candidate) => {
          return candidate.userId === user?.id || candidate.id === user?.id || candidate.email === user?.email;
        });

        const currentUserOption = user && user.role === 'volunteer'
          ? {
              id: user.id,
              userId: user.id,
              fullName: user.fullName || user.name || 'Current User',
              email: user.email,
              role: 'volunteer',
              status: 'active',
            }
          : null;

        const mergedAssignableUsers = hasCurrentUser || !currentUserOption
          ? activeUsers
          : [currentUserOption, ...activeUsers];

        const matchedAssignee = mergedAssignableUsers.find((candidate) => {
          return candidate.id === requestData?.assignedTo || candidate.userId === requestData?.assignedTo;
        });

        setRequest(
          matchedAssignee
            ? {
                ...requestData,
                assigneeName: requestData?.assigneeName || matchedAssignee.fullName,
                assigneeEmail: requestData?.assigneeEmail || matchedAssignee.email,
              }
            : requestData
        );
        setAssignableUsers(mergedAssignableUsers);
        setSelectedAssignee(matchedAssignee?.id || requestData?.assignedTo || '');
        setCompletionNotes(requestData?.completionNotes || '');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token, user]);

  if (loading) {
    return <div className="request-detail-page"><p>Loading request details...</p></div>;
  }

  if (!request) {
    return (
      <div className="request-detail-page">
        <div className="request-detail-card">
          <h1>Request Not Found</h1>
          <p>The request you are trying to view does not exist.</p>
          <Link to="/admin/requests" className="request-detail-back-link">Back to All Requests</Link>
        </div>
      </div>
    );
  }

  const canAssignCurrentRequest = canAssignRequests(user);
  const canUpdateCurrentRequest = canUpdateAssignedRequest(user, request);
  const canViewCurrentRequest = canViewRequestDetails(user, request);
  const backLinkPath = user?.role === 'admin' ? '/admin/requests' : getDefaultRouteForRole(user);

  if (!canViewCurrentRequest) {
    return (
      <div className="request-detail-page">
        <div className="request-detail-card">
          <h1>Access Restricted</h1>
          <p>Your role can only open requests that are assigned to you.</p>
          <Link to={backLinkPath} className="request-detail-back-link">Back to Your Dashboard</Link>
        </div>
      </div>
    );
  }

  const handleAssignRequest = async () => {
    if (!canAssignCurrentRequest) {
      setActionError('Your role is not allowed to assign requests.');
      return;
    }

    if (!selectedAssignee) {
      setActionError('Please select a user to assign this request.');
      return;
    }

    const assignee = assignableUsers.find((candidate) => candidate.id === selectedAssignee);
    if (!assignee) {
      setActionError('Selected user was not found.');
      return;
    }

    setActionError('');
    setActionLoading(true);
    try {
      const updated = await api.assignVolunteer(id, assignee.id, {
        assigneeName: assignee.fullName,
        assigneeEmail: assignee.email,
      });
      setRequest({
        ...updated,
        assignedTo: assignee.id,
        assigneeName: assignee.fullName,
        assigneeEmail: assignee.email,
      });
      createRequestAssignedNotification(updated, assignee);
    } catch {
      setActionError('Failed to assign the request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignToSelf = async () => {
    if (!canAssignCurrentRequest) {
      setActionError('Your role is not allowed to assign requests.');
      return;
    }

    if (!user) {
      setActionError('You need to be logged in to assign this request to yourself.');
      return;
    }

    const selfCandidate = assignableUsers.find((candidate) => {
      return candidate.userId === user.id || candidate.email === user.email;
    });

    if (!selfCandidate) {
      setActionError('Your account does not have a volunteer profile available for assignment.');
      return;
    }

    setSelectedAssignee(selfCandidate.id);
    setActionError('');
    setActionLoading(true);
    try {
      const updated = await api.assignVolunteer(id, selfCandidate.id, {
        assigneeName: selfCandidate.fullName,
        assigneeEmail: selfCandidate.email,
      });
      setRequest({
        ...updated,
        assignedTo: selfCandidate.id,
        assigneeName: selfCandidate.fullName,
        assigneeEmail: selfCandidate.email,
      });
      createRequestAssignedNotification(updated, selfCandidate);
    } catch {
      setActionError('Failed to assign this request to yourself. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartTask = async () => {
    if (!canUpdateCurrentRequest) {
      setActionError('Only the assigned volunteer or an admin can start this task.');
      return;
    }

    setActionError('');
    setActionLoading(true);

    try {
      const updated = await api.updateRequestStatus(id, 'in-progress');
      setRequest({
        ...updated,
        assignedTo: request.assignedTo || updated.assignedTo,
        assigneeName: request.assigneeName || updated.assigneeName || user?.fullName,
        assigneeEmail: request.assigneeEmail || updated.assigneeEmail || user?.email,
      });
    } catch {
      setActionError('Failed to start this task. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!canUpdateCurrentRequest) {
      setActionError('Only the assigned volunteer or an admin can complete this task.');
      return;
    }

    if (!completionNotes.trim()) {
      setActionError('Add a short completion description before marking complete.');
      return;
    }

    setActionError('');
    setActionLoading(true);
    try {
      const updated = await api.updateRequestStatus(id, 'completed', completionNotes.trim(), {
        completedBy: user?.fullName || request.assigneeName || 'Response Team',
      });
      setRequest(updated);
      createRequestCompletedNotification(updated, updated.completedBy || 'Response Team');
    } catch {
      setActionError('Failed to complete this task. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="request-detail-page">
      <div className="request-detail-header">
        <div>
          <h1>Request Details</h1>
          <p>Complete submitted request information</p>
        </div>
        <Link to={backLinkPath} className="request-detail-back-link">Back</Link>
      </div>

      <div className="request-detail-grid">
        <section className="request-detail-card">
          <h2>Request Summary</h2>
          <dl className="request-detail-list">
            <div><dt>Tracking Code</dt><dd>{request.trackingCode || 'Not available'}</dd></div>
            <div><dt>Database ID</dt><dd>{request.id}</dd></div>
            <div><dt>Status</dt><dd>{request.status}</dd></div>
            <div><dt>Assigned To</dt><dd>{request.assigneeName || 'Unassigned'}</dd></div>
            <div><dt>Priority</dt><dd>{request.priority}</dd></div>
            <div><dt>Disaster Type</dt><dd>{request.disasterType}</dd></div>
            <div><dt>Category</dt><dd>{request.category}</dd></div>
            <div><dt>Submitted</dt><dd>{new Date(request.timestamp).toLocaleString()}</dd></div>
            <div><dt>Completed At</dt><dd>{request.completedAt ? new Date(request.completedAt).toLocaleString() : 'Not completed yet'}</dd></div>
            <div><dt>Location</dt><dd>{request.location?.address || 'N/A'}</dd></div>
            <div><dt>Contact Name</dt><dd>{request.contactName || 'N/A'}</dd></div>
            <div><dt>Contact Phone</dt><dd>{request.contactPhone || 'N/A'}</dd></div>
          </dl>
        </section>

        <section className="request-detail-card">
          <h2>Description</h2>
          <p className="request-detail-description">{request.description || 'No description available.'}</p>
        </section>

        <section className="request-detail-card request-detail-full-width">
          <h2>Assignment & Task Progress</h2>

          <div className="request-detail-actions-grid">
            <div>
              <label className="request-detail-label" htmlFor="assignee">Assign To Available User</label>
              <select
                id="assignee"
                className="request-detail-select"
                value={selectedAssignee}
                onChange={(event) => setSelectedAssignee(event.target.value)}
                disabled={!canAssignCurrentRequest}
              >
                <option value="">Select a user</option>
                {assignableUsers.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.fullName} ({candidate.role})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="request-detail-btn"
                onClick={handleAssignRequest}
                disabled={actionLoading || !canAssignCurrentRequest}
              >
                Assign Request
              </button>
              <button
                type="button"
                className="request-detail-btn"
                onClick={handleAssignToSelf}
                disabled={actionLoading || !canAssignCurrentRequest}
              >
                Assign To Me
              </button>
              {!canAssignCurrentRequest && (
                <p className="request-detail-description">Only admins and coordinators can assign requests.</p>
              )}
            </div>

            <div>
              <label className="request-detail-label" htmlFor="completion-notes">Completion Description (what and how)</label>
              <textarea
                id="completion-notes"
                className="request-detail-textarea"
                value={completionNotes}
                onChange={(event) => setCompletionNotes(event.target.value)}
                placeholder="Example: Delivered medical kits to 18 families, coordinated with local clinic, and confirmed inventory handoff."
                rows={4}
              />
              <div className="request-detail-action-row">
                <button
                  type="button"
                  className="request-detail-btn"
                  onClick={handleStartTask}
                  disabled={actionLoading || !canUpdateCurrentRequest || request.status === 'in-progress' || request.status === 'completed'}
                >
                  Mark Active
                </button>
                <button
                  type="button"
                  className="request-detail-btn request-detail-btn-primary"
                  onClick={handleCompleteTask}
                  disabled={actionLoading || !canUpdateCurrentRequest || request.status === 'completed'}
                >
                  Mark Completed
                </button>
              </div>
              {!canUpdateCurrentRequest && (
                <p className="request-detail-description">Only the assigned volunteer or an admin can update task progress.</p>
              )}
            </div>
          </div>

          <dl className="request-detail-list">
            <div><dt>Current Worker</dt><dd>{request.assigneeName || 'No worker assigned yet'}</dd></div>
            <div><dt>Task Status</dt><dd>{request.status}</dd></div>
            <div><dt>Completion Details</dt><dd>{request.completionNotes || 'No completion details yet'}</dd></div>
          </dl>

          {actionError && <p className="request-detail-error">{actionError}</p>}
        </section>

      </div>
    </div>
  );
};

export default RequestDetailPage;
