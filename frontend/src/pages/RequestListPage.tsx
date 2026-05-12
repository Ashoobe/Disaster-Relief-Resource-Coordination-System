import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Search,
  Filter,
  Droplets,
  Flame,
  Wind,
  AlertCircle,
  HeartPulse,
  Home,
  Utensils,
  LifeBuoy,
  Bus,
  Package,
  Shirt,
} from 'lucide-react';
import { api } from '@/lib/api';
import { EmergencyRequest } from '@/types';
import { format } from 'date-fns';
import './request-list-fixes.css';

const formatLocation = (location: EmergencyRequest['location']): string => {
  return [
    location.address,
    [location.city, location.state].filter(Boolean).join(', '),
    location.zipCode,
  ].filter(Boolean).join(' ');
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  food: 'Food',
  shelter: 'Shelter',
  medical: 'Medical',
  water: 'Water',
  rescue: 'Rescue',
  evacuation: 'Evacuation',
  clothing: 'Clothing',
  transportation: 'Transportation',
  flood: 'Flood',
  earthquake: 'Earthquake',
  hurricane: 'Hurricane',
  wildfire: 'Wildfire',
  tornado: 'Tornado',
  other: 'Other',
};

const REQUEST_TYPE_ORDER = [
  'rescue',
  'food',
  'shelter',
  'medical',
  'water',
  'evacuation',
  'clothing',
  'transportation',
  'flood',
  'earthquake',
  'hurricane',
  'wildfire',
  'tornado',
  'other',
];

const normalizeFilterValue = (value: string | undefined): string => (
  String(value ?? '').trim().toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')
);

const formatRequestType = (value: string | undefined): string => {
  const normalized = normalizeFilterValue(value);
  return REQUEST_TYPE_LABELS[normalized] ?? normalized.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export function RequestListPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [zipFilter, setZipFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [disasterFilter, setDisasterFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('time-desc');

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) => [
          req.id,
          req.trackingCode,
          req.title,
          req.description,
          req.disasterType,
          req.category,
          req.status,
          req.priority,
          req.location.address,
          req.location.city,
          req.location.state,
          req.location.zipCode,
          req.contactName,
          req.contactPhone,
        ].some((value) => String(value ?? '').toLowerCase().includes(query))
      );
    }

    if (zipFilter.trim()) {
      const normalizedZip = zipFilter.replace(/\D/g, '');
      filtered = filtered.filter((req) =>
        (req.location.zipCode || '').replace(/\D/g, '').startsWith(normalizedZip)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((req) => normalizeFilterValue(req.status) === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((req) => normalizeFilterValue(req.priority) === priorityFilter);
    }

    if (disasterFilter !== 'all') {
      filtered = filtered.filter((req) => normalizeFilterValue(req.disasterType) === disasterFilter);
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'time-asc':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'city-asc':
          return (a.location.city || '').localeCompare(b.location.city || '');
        case 'city-desc':
          return (b.location.city || '').localeCompare(a.location.city || '');
        case 'zip-asc':
          return (a.location.zipCode || '').localeCompare(b.location.zipCode || '');
        case 'zip-desc':
          return (b.location.zipCode || '').localeCompare(a.location.zipCode || '');
        case 'time-desc':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    setFilteredRequests(filtered);
  }, [requests, searchQuery, zipFilter, statusFilter, priorityFilter, disasterFilter, sortOption]);

  const disasterFilterOptions = Array.from(
    new Set(requests.map((request) => normalizeFilterValue(request.disasterType)).filter(Boolean))
  ).sort((a, b) => {
    const aIndex = REQUEST_TYPE_ORDER.indexOf(a);
    const bIndex = REQUEST_TYPE_ORDER.indexOf(b);
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
    }
    return formatRequestType(a).localeCompare(formatRequestType(b));
  });

  const loadRequests = async () => {
    try {
      setLoadError('');
      const data = await api.getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load requests from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'badge-danger';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-info';
      case 'low': return 'badge-success';
      default: return 'badge-default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'assigned': return 'badge-info';
      case 'in-progress': return 'badge-primary';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-default';
      default: return 'badge-default';
    }
  };

  const getDisasterIcon = (type: string) => {
    switch (normalizeFilterValue(type)) {
      case 'food': return <Utensils className="icon" />;
      case 'shelter': return <Home className="icon" />;
      case 'medical': return <HeartPulse className="icon" />;
      case 'water':
      case 'flood': return <Droplets className="icon" />;
      case 'rescue': return <LifeBuoy className="icon" />;
      case 'evacuation':
      case 'transportation': return <Bus className="icon" />;
      case 'clothing': return <Shirt className="icon" />;
      case 'supplies': return <Package className="icon" />;
      case 'wildfire': return <Flame className="icon" />;
      case 'hurricane':
      case 'tornado': return <Wind className="icon" />;
      default: return <AlertCircle className="icon" />;
    }
  };

  if (isLoading) {
    return <div className="requests-page-loading">Loading requests...</div>;
  }

  return (
    <div className="requests-page container">
      <div className="requests-header">
        <h2>Emergency Requests</h2>
        <p className="muted">Manage and track all emergency requests</p>
      </div>

      {loadError && (
        <div className="form-alert error request-load-error" role="alert">
          <strong>Unable to load requests:</strong> {loadError}
        </div>
      )}

      <Card className="filters-card">
        <CardHeader>
          <CardTitle>
            <div className="filters-title-row">
              <Filter className="icon" /> Filters
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="filters-grid">
            <div className="relative">
              <Search className="icon absolute-icon" />
              <Input placeholder="Search requests..." value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} className="pl-10 filter-search-input" />
            </div>

            <div className="relative">
              <Search className="icon absolute-icon" />
              <Input placeholder="Filter by ZIP code" value={zipFilter} onChange={(e: ChangeEvent<HTMLInputElement>) => setZipFilter(e.target.value)} className="pl-10 filter-search-input" inputMode="numeric" maxLength={10} />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="filter-select-trigger">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="request-filter-select-content">
                <SelectItem className="request-filter-select-item" value="all">All Status</SelectItem>
                <SelectItem className="request-filter-select-item" value="pending">Pending</SelectItem>
                <SelectItem className="request-filter-select-item" value="assigned">Assigned</SelectItem>
                <SelectItem className="request-filter-select-item" value="in-progress">In Progress</SelectItem>
                <SelectItem className="request-filter-select-item" value="completed">Completed</SelectItem>
                <SelectItem className="request-filter-select-item" value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="filter-select-trigger">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent className="request-filter-select-content">
                <SelectItem className="request-filter-select-item" value="all">All Priorities</SelectItem>
                <SelectItem className="request-filter-select-item" value="critical">Critical</SelectItem>
                <SelectItem className="request-filter-select-item" value="high">High</SelectItem>
                <SelectItem className="request-filter-select-item" value="medium">Medium</SelectItem>
                <SelectItem className="request-filter-select-item" value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={disasterFilter} onValueChange={setDisasterFilter}>
              <SelectTrigger className="filter-select-trigger">
                <SelectValue placeholder="All Disasters" />
              </SelectTrigger>
              <SelectContent className="request-filter-select-content">
                <SelectItem className="request-filter-select-item" value="all">All Disasters</SelectItem>
                {disasterFilterOptions.map((type) => (
                  <SelectItem className="request-filter-select-item" key={type} value={type}>
                    {formatRequestType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="filter-select-trigger">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="request-filter-select-content">
                <SelectItem className="request-filter-select-item" value="time-desc">Newest First</SelectItem>
                <SelectItem className="request-filter-select-item" value="time-asc">Oldest First</SelectItem>
                <SelectItem className="request-filter-select-item" value="city-asc">City A-Z</SelectItem>
                <SelectItem className="request-filter-select-item" value="city-desc">City Z-A</SelectItem>
                <SelectItem className="request-filter-select-item" value="zip-asc">ZIP Low-High</SelectItem>
                <SelectItem className="request-filter-select-item" value="zip-desc">ZIP High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="filters-actions">
            <div className="filters-summary">Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> requests</div>
            <div>
              {(searchQuery || zipFilter || statusFilter !== 'all' || priorityFilter !== 'all' || disasterFilter !== 'all' || sortOption !== 'time-desc') && (
                <Button className="clear-filters-button" variant="outline" size="sm" onClick={() => { setSearchQuery(''); setZipFilter(''); setStatusFilter('all'); setPriorityFilter('all'); setDisasterFilter('all'); setSortOption('time-desc'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="table-wrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Disaster Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 muted">
                      {loadError
                        ? 'Request data could not be loaded from the backend for this session.'
                        : 'No requests found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono">{request.trackingCode || request.id}</TableCell>
                      <TableCell>
                        <div className="disaster-cell">
                          {getDisasterIcon(request.disasterType)}
                          <span>{formatRequestType(request.disasterType)}</span>
                        </div>
                      </TableCell>
                      <TableCell style={{ textTransform: 'capitalize', color: '#334155', fontWeight: 500 }}>{request.category}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </TableCell>
                      <TableCell className="truncate" title={formatLocation(request.location)}>{formatLocation(request.location)}</TableCell>
                      <TableCell>
                        <div className="contact-name">{request.contactName}</div>
                        <div className="contact-phone">{request.contactPhone}</div>
                      </TableCell>
                      <TableCell style={{ color: '#64748b', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{format(new Date(request.timestamp), 'MMM dd, HH:mm')}</TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/requests/${request.id}`} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RequestListPage;
