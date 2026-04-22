import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import './VolunteerTasksPage.css';

const priorityVariant = { critical: 'danger', high: 'warning', medium: 'info', low: 'success' };
const statusVariant = { 'in-progress': 'warning', assigned: 'info', completed: 'success', pending: 'default' };

const VolunteerTasksPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const requests = await api.getRequests();
      const mine = requests.filter((request) => {
        if (!request.assignedTo && !request.assigneeEmail) return false;
        return request.assignedTo === user?.id || request.assigneeEmail === user?.email;
      });

      const sorted = [...mine].sort(
        (a, b) => new Date(b.updatedAt || b.timestamp).getTime() - new Date(a.updatedAt || a.timestamp).getTime()
      );
      setTasks(sorted);
    } catch (error) {
      console.error('Failed to load assigned tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user?.id, user?.email]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    if (filter === 'pending') return tasks.filter((task) => task.status === 'assigned');
    if (filter === 'active') return tasks.filter((task) => task.status === 'in-progress');
    if (filter === 'completed') return tasks.filter((task) => task.status === 'completed');
    return tasks;
  }, [filter, tasks]);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>Assigned emergency work with status and completion tracking</p>
        </div>
      </div>

      {/* Summary */}
      <div className="tasks-summary">
        <button className={`summary-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All ({tasks.length})
        </button>
        <button className={`summary-chip ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
          Pending ({tasks.filter(t => t.status === 'assigned').length})
        </button>
        <button className={`summary-chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
          Active ({tasks.filter(t => t.status === 'in-progress').length})
        </button>
        <button className={`summary-chip ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      {/* Task list */}
      <div className="tasks-list">
        {loading && (
          <Card elevation="default">
            <Card.Body>
              <div className="tasks-empty">
                <h3>Loading tasks...</h3>
              </div>
            </Card.Body>
          </Card>
        )}
        {!loading && filteredTasks.length === 0 && (
          <Card elevation="default">
            <Card.Body>
              <div className="tasks-empty">
                <div className="empty-icon">✅</div>
                <h3>No tasks</h3>
                <p>No tasks match the selected filter.</p>
              </div>
            </Card.Body>
          </Card>
        )}
        {filteredTasks.map(task => (
          <Card key={task.id} elevation="default">
            <Card.Body>
              <div className="task-card">
                <div className="task-card-header">
                  <div className="task-card-title">{task.disasterType} response - {task.category}</div>
                  <div className="task-card-badges">
                    <Badge variant={priorityVariant[task.priority] || 'default'}>{task.priority}</Badge>
                    <Badge variant={statusVariant[task.status] || 'default'}>{task.status}</Badge>
                  </div>
                </div>
                <p className="task-card-desc">{task.description}</p>
                <div className="task-card-meta">
                  <span>📍 {task.location?.address}</span>
                  <span>👷 Working: {task.assigneeName || user?.fullName || 'Unassigned'}</span>
                  <span className="task-card-id">{task.id}</span>
                </div>
                {!!task.completionNotes && (
                  <p className="task-card-desc"><strong>Completed:</strong> {task.completionNotes}</p>
                )}
                <div className="task-card-actions">
                  <Link className="btn btn-secondary btn-sm" to={`/requests/${task.id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VolunteerTasksPage;
