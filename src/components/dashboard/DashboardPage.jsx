import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { getNotifications, notificationEvents } from '../../services/notificationService';
import Card from '../common/Card';
import { Badge } from '../common/Badge';
import { TrendingUp, FileText, Clock, AlertCircle, ArrowRight, Flame, Droplets, Wind, CheckCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const syncNotifications = () => {
      setRecentNotifications(getNotifications(user).slice(0, 5));
    };

    syncNotifications();
    window.addEventListener('storage', syncNotifications);
    window.addEventListener(notificationEvents.updated, syncNotifications);

    return () => {
      window.removeEventListener('storage', syncNotifications);
      window.removeEventListener(notificationEvents.updated, syncNotifications);
    };
  }, [user]);

  const loadData = async () => {
    try {
      const [statsData, requestsData] = await Promise.all([
        api.getDashboardStats(),
        api.getRequests(),
      ]);
      const sortedRequests = [...requestsData].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setStats(statsData);
      setRequests(sortedRequests);
      setRecentRequests(sortedRequests.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisasterIcon = (type) => {
    switch (type) {
      case 'flood': return <Droplets className="icon" />;
      case 'wildfire': return <Flame className="icon" />;
      case 'hurricane':
      case 'tornado': return <Wind className="icon" />;
      default: return <AlertCircle className="icon" />;
    }
  };

  const requestTrendData = requests.length
    ? Object.entries(requests.reduce((acc, request) => {
        const key = new Date(request.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})).map(([time, count]) => ({ time, requests: count }))
    : [];

  const categoryData = requests.length
    ? Object.entries(requests.reduce((acc, request) => {
        const key = request.category || 'other';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})).map(([name, value], index) => ({
        name: name.replace(/-/g, ' '),
        value,
        color: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#6b7280'][index % 6],
      }))
    : [];

  if (isLoading) {
    return (
      <div className="loading-placeholder">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h1>Dashboard Overview</h1>
        <p>Real-time emergency request monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <Card elevation="elevated">
          <Card.Body>
            <div className="stat-card">
              <div className="stat-icon"><FileText /></div>
              <div className="stat-content">
                <div className="stat-label">Total Requests</div>
                <div className="stat-value">{stats?.totalRequests ?? 0}</div>
                <div className="stat-meta">All time</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card elevation="elevated">
          <Card.Body>
            <div className="stat-card">
              <div className="stat-icon"><Clock /></div>
              <div className="stat-content">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats?.pendingRequests ?? 0}</div>
                <div className="stat-meta">Awaiting assignment</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card elevation="elevated">
          <Card.Body>
            <div className="stat-card">
              <div className="stat-icon"><TrendingUp /></div>
              <div className="stat-content">
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{stats?.inProgressRequests ?? 0}</div>
                <div className="stat-meta">Active responses</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card elevation="elevated">
          <Card.Body>
            <div className="stat-card">
              <div className="stat-icon"><AlertCircle /></div>
              <div className="stat-content">
                <div className="stat-label">Critical</div>
                <div className="stat-value">{stats?.criticalRequests ?? 0}</div>
                <div className="stat-meta">High priority</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts-grid">
        <Card elevation="default">
          <Card.Header>
            <h3>Requests by Category</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ width: '100%', height: 260 }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart">No data</div>
              )}
            </div>
          </Card.Body>
        </Card>

        <Card elevation="default">
          <Card.Header>
            <h3>Request Trend (24h)</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ width: '100%', height: 260 }}>
              {requestTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={requestTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#93c5fd" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-chart">No data</div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card elevation="default">
        <Card.Header>
          <div className="card-header-row">
            <h3>Latest Notifications</h3>
            <Link className="btn-link" to="/notifications">View All</Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {recentNotifications.length === 0 && (
              <div className="request-item">
                <p className="request-description">No notifications yet. New emergency submissions will show up here.</p>
              </div>
            )}
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="request-item">
                <div className="request-item-header">
                  <span className="request-id">{notification.requestId || 'Notice'}</span>
                  {!notification.read && <Badge variant="warning">new</Badge>}
                </div>
                <p className="request-description">{notification.title}</p>
                <p className="request-location">{notification.body}</p>
                <div className="request-item-footer">
                  <span className="request-contact">{new Date(notification.createdAt).toLocaleString()}</span>
                  {notification.actionPath && (
                    <Link className="btn-outline-sm" to={notification.actionPath}>Open</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card elevation="default">
        <Card.Header>
          <div className="card-header-row">
            <h3>Recent Emergency Requests</h3>
            <Link className="btn-link" to="/admin/requests">View All</Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-item-header">
                  <span className="request-id">{request.id}</span>
                  <div className="request-badges">
                    <Badge variant={request.priority}>{request.priority}</Badge>
                    <Badge variant={request.status}>{request.status}</Badge>
                  </div>
                </div>
                <div className="request-item-type">
                  <span className="disaster-icon">{getDisasterIcon(request.disasterType)}</span>
                  <span className="disaster-type">{request.disasterType}</span>
                  <span className="separator">•</span>
                  <span className="category">{request.category}</span>
                </div>
                <p className="request-description">{request.title || request.description?.slice(0, 100) || 'No description available.'}</p>
                <p className="request-location">{request.location?.address}</p>
                <div className="request-item-footer">
                  <span className="request-contact">{request.contactName}</span>
                  <Link className="btn-outline-sm" to={`/requests/${request.id}`}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardPage;
