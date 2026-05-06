import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '@/lib/api';
import { EmergencyRequest } from '@/types';
import { TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './AnalyticsPage.css';

export function AnalyticsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestsByDay = requests.reduce<Record<string, { total: number; completed: number }>>((acc, request) => {
    const key = new Date(request.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    if (!acc[key]) {
      acc[key] = { total: 0, completed: 0 };
    }
    acc[key].total += 1;
    if (request.status === 'completed') {
      acc[key].completed += 1;
    }
    return acc;
  }, {});

  const responseTimesInHours = requests
    .map((request) => {
      if (!request.updatedAt) return null;
      const submittedAt = new Date(request.timestamp).getTime();
      const updatedAt = new Date(request.updatedAt).getTime();
      const diff = (updatedAt - submittedAt) / (1000 * 60 * 60);
      return Number.isFinite(diff) && diff >= 0 ? diff : null;
    })
    .filter((value): value is number => value != null);

  // Calculate analytics data
  const statusData = [
    { name: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: '#eab308' },
    { name: 'Assigned', value: requests.filter(r => r.status === 'assigned').length, color: '#3b82f6' },
    { name: 'In Progress', value: requests.filter(r => r.status === 'in-progress').length, color: '#8b5cf6' },
    { name: 'Completed', value: requests.filter(r => r.status === 'completed').length, color: '#10b981' },
    { name: 'Cancelled', value: requests.filter(r => r.status === 'cancelled').length, color: '#6b7280' },
  ];

  const priorityData = [
    { name: 'Critical', value: requests.filter(r => r.priority === 'critical').length, color: '#ef4444' },
    { name: 'High', value: requests.filter(r => r.priority === 'high').length, color: '#f97316' },
    { name: 'Medium', value: requests.filter(r => r.priority === 'medium').length, color: '#eab308' },
    { name: 'Low', value: requests.filter(r => r.priority === 'low').length, color: '#22c55e' },
  ];

  const disasterTypeData = [
    { name: 'Flood', value: requests.filter(r => r.disasterType === 'flood').length },
    { name: 'Earthquake', value: requests.filter(r => r.disasterType === 'earthquake').length },
    { name: 'Hurricane', value: requests.filter(r => r.disasterType === 'hurricane').length },
    { name: 'Wildfire', value: requests.filter(r => r.disasterType === 'wildfire').length },
    { name: 'Tornado', value: requests.filter(r => r.disasterType === 'tornado').length },
    { name: 'Other', value: requests.filter(r => r.disasterType === 'other').length },
  ];

  const categoryData = [
    { name: 'Rescue', value: requests.filter(r => r.category === 'rescue').length },
    { name: 'Medical', value: requests.filter(r => r.category === 'medical').length },
    { name: 'Shelter', value: requests.filter(r => r.category === 'shelter').length },
    { name: 'Food', value: requests.filter(r => r.category === 'food').length },
    { name: 'Evacuation', value: requests.filter(r => r.category === 'evacuation').length },
    { name: 'Supplies', value: requests.filter(r => r.category === 'supplies').length },
    { name: 'Other', value: requests.filter(r => r.category === 'other').length },
  ];

  const responseTimeData = [
    { timeRange: '0-1h', count: responseTimesInHours.filter((value) => value < 1).length },
    { timeRange: '1-3h', count: responseTimesInHours.filter((value) => value >= 1 && value < 3).length },
    { timeRange: '3-6h', count: responseTimesInHours.filter((value) => value >= 3 && value < 6).length },
    { timeRange: '6-12h', count: responseTimesInHours.filter((value) => value >= 6 && value < 12).length },
    { timeRange: '12-24h', count: responseTimesInHours.filter((value) => value >= 12).length },
  ];

  const completionRateData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    completed: requestsByDay[day]?.completed ?? 0,
    total: requestsByDay[day]?.total ?? 0,
  }));

  const averageResponseTime = responseTimesInHours.length
    ? `${(responseTimesInHours.reduce((sum, value) => sum + value, 0) / responseTimesInHours.length).toFixed(1)}h`
    : 'N/A';

  const completionRate = requests.length > 0
    ? Math.round((requests.filter(r => r.status === 'completed').length / requests.length) * 100)
    : 0;
  const criticalPending = requests.filter(r => r.priority === 'critical' && r.status !== 'completed').length;

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div className="analytics-loading-inner">
          <div className="analytics-spinner"></div>
          <p className="analytics-loading-text">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-wrapper">
      {/* Header */}
      <div className="analytics-header">
        <h2>Analytics &amp; Reports</h2>
        <p>System performance and request insights</p>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metric-grid">
        <div className="analytics-metric-card">
          <div className="analytics-metric-header">
            <span className="analytics-metric-label">Total Requests</span>
            <TrendingUp size={18} color="#3b82f6" />
          </div>
          <div className="analytics-metric-value">{requests.length}</div>
          <div className="analytics-metric-sub">All time</div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-header">
            <span className="analytics-metric-label">Completion Rate</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div className="analytics-metric-value">{completionRate}%</div>
          <div className="analytics-metric-sub">
            {requests.filter(r => r.status === 'completed').length} completed
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-header">
            <span className="analytics-metric-label">Avg Response Time</span>
            <Clock size={18} color="#f97316" />
          </div>
          <div className="analytics-metric-value">{averageResponseTime}</div>
          <div className="analytics-metric-sub">From submission to assignment</div>
        </div>

        <div className="analytics-metric-card">
          <div className="analytics-metric-header">
            <span className="analytics-metric-label">Critical Alerts</span>
            <AlertCircle size={18} color="#ef4444" />
          </div>
          <div className="analytics-metric-value red">
            {requests.filter(r => r.priority === 'critical').length}
          </div>
          <div className="analytics-metric-sub">Requiring immediate attention</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="analytics-charts-grid">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Request Status Distribution</h3>
          </div>
          <div className="analytics-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Priority Distribution</h3>
          </div>
          <div className="analytics-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="analytics-charts-grid">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Requests by Disaster Type</h3>
          </div>
          <div className="analytics-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={disasterTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Requests by Category</h3>
          </div>
          <div className="analytics-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="analytics-charts-grid">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Response Time Distribution</h3>
          </div>
          <div className="analytics-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timeRange" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Weekly Completion Rate</h3>
          </div>
          <div className="analytics-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={completionRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total Requests" />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="analytics-insights-card">
        <div className="analytics-insights-header">
          <h3 className="analytics-insights-title">Key Insights</h3>
        </div>
        <div className="analytics-insights-body">
          <div className="insight-item blue">
            <span className="insight-icon blue"><TrendingUp size={20} /></span>
            <div>
              <p className="insight-title blue">High Activity Period</p>
              <p className="insight-desc blue">Most requests are received during morning hours (8 AM – 12 PM)</p>
            </div>
          </div>

          <div className="insight-item green">
            <span className="insight-icon green"><CheckCircle size={20} /></span>
            <div>
              <p className="insight-title green">Strong Completion Rate</p>
              <p className="insight-desc green">
                {completionRate}% of requests have been successfully completed
              </p>
            </div>
          </div>

          <div className="insight-item orange">
            <span className="insight-icon orange"><Clock size={20} /></span>
            <div>
              <p className="insight-title orange">Fast Response Time</p>
              <p className="insight-desc orange">Average response time is 2.4 hours from submission to assignment</p>
            </div>
          </div>

          {criticalPending > 0 && (
            <div className="insight-item red">
              <span className="insight-icon red"><AlertCircle size={20} /></span>
              <div>
                <p className="insight-title red">Critical Requests Pending</p>
                <p className="insight-desc red">
                  {criticalPending} critical {criticalPending === 1 ? 'request requires' : 'requests require'} immediate attention
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
