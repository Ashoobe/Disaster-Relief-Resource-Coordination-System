import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  Clock,
  Droplets,
  ExternalLink,
  Flame,
  Globe,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
  Sun,
  Wind,
  Bell,
  TriangleAlert,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  addDistanceToEvents,
  fetchCriticalWeatherAlerts,
  fetchLiveActivityEvents,
  fetchTenDayWeatherByZip,
  geocodeLocation,
  liveActivitySources,
} from '../services/liveActivityService';
import PublicSiteHeader from '../components/layout/PublicSiteHeader';
import PublicSiteFooter from '../components/layout/PublicSiteFooter';
import './HomePage.css';
import './LiveActivityPage.css';

const categoryOptions = [
  { id: 'all', label: 'All' },
  { id: 'flood', label: 'Floods' },
  { id: 'wildfire', label: 'Wildfires' },
  { id: 'hurricane', label: 'Hurricanes' },
  { id: 'tornado', label: 'Tornadoes' },
  { id: 'storm', label: 'Other Storms' },
];
const radiusOptions = [150, 300, 600, 1200];

const iconByEventType = {
  flood: Droplets,
  wildfire: Flame,
  hurricane: Wind,
  tornado: Wind,
  storm: AlertCircle,
};

const formatTimestamp = (value, options = {}) => {
  if (!value) {
    return 'Unknown';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  });
};

const formatCoordinates = (coordinates) => {
  if (!coordinates) {
    return 'Unavailable';
  }

  return `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`;
};

const splitAlertAreas = (areaDesc = '') => areaDesc
  .split(';')
  .map((area) => area.trim())
  .filter(Boolean);

const summarizeAlertAreas = (areaDesc = '', visibleCount = 2) => {
  const areas = splitAlertAreas(areaDesc);

  if (areas.length === 0) {
    return { text: 'Area details pending', extraCount: 0 };
  }

  return {
    text: areas.slice(0, visibleCount).join('; '),
    extraCount: Math.max(areas.length - visibleCount, 0),
  };
};

const chartTypes = [
  { id: 'flood', label: 'Flood' },
  { id: 'wildfire', label: 'Wildfire' },
  { id: 'hurricane', label: 'Hurricane' },
  { id: 'tornado', label: 'Tornado' },
  { id: 'storm', label: 'Severe Storm' },
];

const buildTimelineData = (events, daysWindow) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (daysWindow - 1));

  const byDay = {};
  for (let offset = 0; offset < daysWindow; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const key = date.toISOString().slice(0, 10);
    byDay[key] = {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: 0,
      flood: 0,
      wildfire: 0,
      storm: 0,
    };
  }

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    if (Number.isNaN(eventDate.getTime())) {
      return;
    }

    const eventKey = eventDate.toISOString().slice(0, 10);
    if (!byDay[eventKey]) {
      return;
    }

    byDay[eventKey].total += 1;
    if (event.type === 'flood') {
      byDay[eventKey].flood += 1;
    } else if (event.type === 'wildfire') {
      byDay[eventKey].wildfire += 1;
    } else {
      byDay[eventKey].storm += 1;
    }
  });

  return Object.values(byDay);
};

const buildCategoryChartData = (allEvents, visibleEvents, metric = 'count') => {
  const allByType = allEvents.reduce((accumulator, event) => {
    accumulator[event.type] = (accumulator[event.type] || 0) + 1;
    return accumulator;
  }, {});

  const visibleByType = visibleEvents.reduce((accumulator, event) => {
    accumulator[event.type] = (accumulator[event.type] || 0) + 1;
    return accumulator;
  }, {});

  return chartTypes.map((type) => {
    const totalAll = allByType[type.id] || 0;
    const inView = visibleByType[type.id] || 0;
    const outsideView = Math.max(0, totalAll - inView);

    if (metric === 'share') {
      return {
        label: type.label,
        totalAll,
        inView,
        outsideView,
        inViewValue: totalAll ? Number(((inView / totalAll) * 100).toFixed(1)) : 0,
        outsideViewValue: totalAll ? Number(((outsideView / totalAll) * 100).toFixed(1)) : 0,
      };
    }

    return {
      label: type.label,
      totalAll,
      inView,
      outsideView,
      inViewValue: inView,
      outsideViewValue: outsideView,
    };
  });
};

const getTypeCount = (events, type) => events.filter((event) => event.type === type).length;

const formatForecastDate = (dateString) => {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const LiveActivityPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchRadiusMiles, setSearchRadiusMiles] = useState(300);
  const [activeLocation, setActiveLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [alertsError, setAlertsError] = useState('');
  const [alertsLastUpdated, setAlertsLastUpdated] = useState(null);
  const [weatherZipCode, setWeatherZipCode] = useState('');
  const [weatherTemperatureUnit, setWeatherTemperatureUnit] = useState('fahrenheit');
  const [weatherWindUnit, setWeatherWindUnit] = useState('mph');
  const [weatherForecastDays, setWeatherForecastDays] = useState(10);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [tenDayWeather, setTenDayWeather] = useState(null);
  const [selectedWeatherDate, setSelectedWeatherDate] = useState('');
  const [trendWindowDays, setTrendWindowDays] = useState(14);
  const [incidentMetric, setIncidentMetric] = useState('count');
  const [feedStatus, setFeedStatus] = useState({
    ok: false,
    statusText: 'Waiting for first response',
    fetchedCount: 0,
  });

  const loadEvents = async ({ isRefresh = false } = {}) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');
    setAlertsError('');

    try {
      const [nextEvents, nextAlerts] = await Promise.all([
        fetchLiveActivityEvents(),
        fetchCriticalWeatherAlerts(),
      ]);

      setEvents(nextEvents);
      setAlerts(nextAlerts);
      setLastUpdated(new Date().toISOString());
      setAlertsLastUpdated(new Date().toISOString());
      setFeedStatus({
        ok: true,
        statusText: isRefresh ? 'Live refresh successful' : 'Initial live feed connected',
        fetchedCount: nextEvents.length,
      });
    } catch (loadError) {
      setError(loadError.message || 'Unable to load live activity right now.');
      setAlertsError('Critical weather alerts are temporarily unavailable.');
      setFeedStatus({
        ok: false,
        statusText: 'Feed request failed. Check network and CORS settings.',
        fetchedCount: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();

    const intervalId = window.setInterval(() => {
      loadEvents({ isRefresh: true });
    }, 300000);

    return () => window.clearInterval(intervalId);
  }, []);

  const filteredByType = useMemo(() => {
    if (categoryFilter === 'all') {
      return events;
    }

    return events.filter((event) => event.type === categoryFilter);
  }, [categoryFilter, events]);

  const eventsWithDistance = useMemo(() => {
    if (!activeLocation) {
      return filteredByType;
    }

    return addDistanceToEvents(filteredByType, activeLocation).sort((left, right) => {
      return (left.distanceMiles ?? Number.POSITIVE_INFINITY) - (right.distanceMiles ?? Number.POSITIVE_INFINITY);
    });
  }, [activeLocation, filteredByType]);

  const nearbyEvents = useMemo(() => {
    if (!activeLocation) {
      return eventsWithDistance;
    }

    const matches = eventsWithDistance.filter((event) => event.distanceMiles <= searchRadiusMiles);
    if (matches.length) {
      return matches;
    }

    return eventsWithDistance.slice(0, 8);
  }, [activeLocation, eventsWithDistance, searchRadiusMiles]);

  const timelineData = useMemo(() => buildTimelineData(filteredByType, trendWindowDays), [filteredByType, trendWindowDays]);
  const categoryChartData = useMemo(() => buildCategoryChartData(events, filteredByType, incidentMetric), [events, filteredByType, incidentMetric]);
  const newestEvents = useMemo(() => filteredByType.slice(0, 5), [filteredByType]);
  const chartAnimationKey = `${lastUpdated || 'init'}-${categoryFilter}-${trendWindowDays}-${incidentMetric}-${filteredByType.length}`;
  const stats = useMemo(() => {
    return {
      total: filteredByType.length,
      floods: getTypeCount(filteredByType, 'flood'),
      wildfires: getTypeCount(filteredByType, 'wildfire'),
      storms: filteredByType.filter((event) => ['storm', 'hurricane', 'tornado'].includes(event.type)).length,
      nearby: activeLocation ? nearbyEvents.length : null,
    };
  }, [activeLocation, filteredByType, nearbyEvents.length]);

  const criticalAlertCount = alerts.length;
  const selectedWeatherDay = useMemo(() => {
    if (!tenDayWeather?.forecast?.length) {
      return null;
    }

    return tenDayWeather.forecast.find((day) => day.date === selectedWeatherDate) || tenDayWeather.forecast[0];
  }, [selectedWeatherDate, tenDayWeather]);

  const focusAreas = useMemo(() => {
    const areaCounts = new Map();

    alerts.forEach((alert) => {
      splitAlertAreas(alert.areaDesc).forEach((area) => {
        areaCounts.set(area, (areaCounts.get(area) || 0) + 1);
      });
    });

    return Array.from(areaCounts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([area]) => area);
  }, [alerts]);
  const visibleFocusAreas = focusAreas.slice(0, 6);
  const hiddenFocusAreaCount = Math.max(focusAreas.length - visibleFocusAreas.length, 0);

  const handleLocationSubmit = async (event) => {
    event.preventDefault();
    setLocationError('');

    if (!locationQuery.trim()) {
      setActiveLocation(null);
      return;
    }

    try {
      const match = await geocodeLocation(locationQuery);
      if (!match) {
        setLocationError('No matching location was found. Try a city, state, or country.');
        return;
      }

      setActiveLocation(match);
    } catch (searchError) {
      setLocationError(searchError.message || 'Unable to search that location right now.');
    }
  };

  const clearLocationSearch = () => {
    setLocationQuery('');
    setActiveLocation(null);
    setLocationError('');
  };

  const handleWeatherSearch = async (event) => {
    event.preventDefault();
    setWeatherError('');

    if (!weatherZipCode.trim()) {
      setWeatherError('Please enter a ZIP code.');
      return;
    }

    setWeatherLoading(true);
    try {
      const weather = await fetchTenDayWeatherByZip(weatherZipCode, {
        temperatureUnit: weatherTemperatureUnit,
        windSpeedUnit: weatherWindUnit,
        forecastDays: weatherForecastDays,
      });
      setTenDayWeather(weather);
      setSelectedWeatherDate(weather.forecast?.[0]?.date || '');
    } catch (lookupError) {
      setWeatherError(lookupError.message || 'Unable to load weather forecast.');
    } finally {
      setWeatherLoading(false);
    }
  };

  const clearWeatherSearch = () => {
    setWeatherZipCode('');
    setTenDayWeather(null);
    setSelectedWeatherDate('');
    setWeatherError('');
  };

  return (
    <div className="home-page live-activity-page">
      <PublicSiteHeader activeKey="live-activity" />

      <main className="live-main">
        {criticalAlertCount > 0 && (
          <section className="live-critical-strip" role="status" aria-live="polite">
            <div className="live-critical-strip-content">
              <div className="live-critical-strip-left">
                <span className="live-critical-dot" aria-hidden="true" />
                <TriangleAlert size={18} />
                <strong>{criticalAlertCount} critical weather alerts are active right now</strong>
              </div>
              <div className="live-critical-strip-right">
                <Bell size={16} />
                <span>Live NOAA warning feed</span>
              </div>
            </div>
          </section>
        )}

        <section className="live-hero">
          <div className="live-hero-content">
            <div data-animate="fade-right">
              <span className="live-eyebrow">
                <Activity size={14} />
                Live hazard intelligence
              </span>
              <h1>Track live floods, wildfires, hurricanes, tornadoes, and major storm activity.</h1>
              <p>
                This page uses free public disaster feeds to show open incidents, recent movement, and the closest tracked events to a searched location.
              </p>

              <div className="live-hero-actions">
                <button type="button" className="live-refresh-btn" onClick={() => loadEvents({ isRefresh: true })} disabled={refreshing}>
                  <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
                  {refreshing ? 'Refreshing…' : 'Refresh feed'}
                </button>
                <Link to="/submit-emergency-request" className="live-link-btn">
                  <AlertCircle size={16} />
                  Submit Emergency Request
                </Link>
              </div>
            </div>

            <aside className="live-hero-panel" data-animate="fade-left" data-delay="150">
              <h2>Free public data sources</h2>
              <ul className="live-source-list">
                {liveActivitySources.map((source) => (
                  <li key={source.label}>
                    <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                  </li>
                ))}
              </ul>
              <p className="live-last-updated">
                Last refreshed: {lastUpdated ? formatTimestamp(lastUpdated, { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : 'Waiting for live data'}
              </p>
              <div className={`live-feed-status ${feedStatus.ok ? 'ok' : 'error'}`}>
                <strong>{feedStatus.ok ? 'Feed online' : 'Feed issue'}</strong>
                <span>{feedStatus.statusText}</span>
                <span>{feedStatus.fetchedCount} events loaded</span>
              </div>
            </aside>
          </div>
        </section>

        <div className="live-content">
          <section className="live-panel live-controls">
            <div className="live-controls-top">
              <div className="live-controls-copy">
                <h2>Search a location</h2>
                <p>Enter a city, state, or country to see which tracked incidents are closest.</p>
              </div>
            </div>

            <form className="live-search-form" onSubmit={handleLocationSubmit}>
              <input
                className="live-input"
                type="text"
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Search location, for example: Houston, TX or Florida"
                aria-label="Search location"
              />
              <select className="live-select" value={searchRadiusMiles} onChange={(event) => setSearchRadiusMiles(Number(event.target.value))} aria-label="Search radius">
                {radiusOptions.map((radius) => (
                  <option key={radius} value={radius}>{radius} miles radius</option>
                ))}
              </select>
              <button type="submit" className="live-search-submit">
                <Search size={16} />
                Search
              </button>
              <button type="button" className="live-clear-btn" onClick={clearLocationSearch}>
                Clear
              </button>
            </form>

            <div className="live-filter-pills" role="tablist" aria-label="Event type filters">
              {categoryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`live-filter-pill ${categoryFilter === option.id ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {activeLocation && (
              <div className="live-location-summary">
                <span className="live-location-chip">
                  <LocateFixed size={14} />
                  {activeLocation.name}
                </span>
                <span className="live-location-chip">Showing closest incidents within {searchRadiusMiles} miles when available</span>
              </div>
            )}

            {locationError && <p className="live-error">{locationError}</p>}
            {error && <p className="live-error">{error}</p>}
          </section>

          <section className="live-panel live-weather-card">
            <div className="live-weather-header">
              <div>
                <h3>Live Weather by ZIP Code</h3>
                <p>Enter a US ZIP code to get a live forecast, then click a day to see detailed weather info.</p>
              </div>
            </div>

            <form className="live-weather-form" onSubmit={handleWeatherSearch}>
              <input
                className="live-input"
                type="text"
                value={weatherZipCode}
                onChange={(event) => setWeatherZipCode(event.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                placeholder="Enter 5-digit ZIP (e.g. 60616)"
                inputMode="numeric"
                maxLength={5}
                aria-label="US ZIP code"
              />
              <select
                className="live-select"
                value={weatherTemperatureUnit}
                onChange={(event) => setWeatherTemperatureUnit(event.target.value)}
                aria-label="Temperature unit"
              >
                <option value="fahrenheit">Fahrenheit (F)</option>
                <option value="celsius">Celsius (C)</option>
              </select>
              <select
                className="live-select"
                value={weatherWindUnit}
                onChange={(event) => setWeatherWindUnit(event.target.value)}
                aria-label="Wind speed unit"
              >
                <option value="mph">mph</option>
                <option value="kmh">km/h</option>
              </select>
              <select
                className="live-select"
                value={weatherForecastDays}
                onChange={(event) => setWeatherForecastDays(Number(event.target.value))}
                aria-label="Forecast days"
              >
                <option value={10}>10 days</option>
                <option value={14}>14 days</option>
              </select>
              <button type="submit" className="live-search-submit" disabled={weatherLoading}>
                <Sun size={16} />
                {weatherLoading ? 'Loading…' : `Get ${weatherForecastDays}-day weather`}
              </button>
              <button type="button" className="live-clear-btn" onClick={clearWeatherSearch}>
                Clear
              </button>
            </form>

            {weatherError && <p className="live-error">{weatherError}</p>}

            {tenDayWeather && (
              <>
                <div className="live-weather-summary">
                  <span className="live-location-chip">
                    <MapPin size={14} />
                    {tenDayWeather.placeName}, {tenDayWeather.state} {tenDayWeather.zipCode}
                  </span>
                  <span className="live-location-chip">Timezone: {tenDayWeather.timezone}</span>
                  <span className="live-location-chip">Updated: {formatTimestamp(tenDayWeather.fetchedAt, { hour: 'numeric', minute: '2-digit' })}</span>
                </div>

                <div className="live-weather-grid">
                  {tenDayWeather.forecast.map((day) => (
                    <button
                      key={`${tenDayWeather.zipCode}-${day.date}`}
                      type="button"
                      className={`live-weather-day live-weather-${day.severity} ${selectedWeatherDay?.date === day.date ? 'live-weather-day-selected' : ''}`}
                      onClick={() => setSelectedWeatherDate(day.date)}
                      aria-pressed={selectedWeatherDay?.date === day.date}
                    >
                      <div className="live-weather-day-top">
                        <strong>{formatForecastDate(day.date)}</strong>
                        <span>{day.condition}</span>
                      </div>
                      <div className="live-weather-values">
                        <span>
                          High: {day.highTemp != null ? `${Math.round(day.highTemp)} ${tenDayWeather.temperatureUnit === 'celsius' ? 'C' : 'F'}` : 'N/A'}
                        </span>
                        <span>
                          Low: {day.lowTemp != null ? `${Math.round(day.lowTemp)} ${tenDayWeather.temperatureUnit === 'celsius' ? 'C' : 'F'}` : 'N/A'}
                        </span>
                        <span>Rain: {day.precipitationChance != null ? `${Math.round(day.precipitationChance)}%` : 'N/A'}</span>
                        <span>
                          Wind: {day.windSpeed != null ? `${Math.round(day.windSpeed)} ${tenDayWeather.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'}` : 'N/A'}
                        </span>
                        <span>Humidity: {day.humidityMax != null ? `${Math.round(day.humidityMax)}%` : 'N/A'}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedWeatherDay && (
                  <article className="live-weather-detail" aria-live="polite">
                    <h4>{formatForecastDate(selectedWeatherDay.date)} details</h4>
                    {selectedWeatherDay.description && (
                      <p className="live-weather-detail-description">{selectedWeatherDay.description}</p>
                    )}
                    <div className="live-weather-detail-grid">
                      <p><strong>Condition:</strong> {selectedWeatherDay.condition}</p>
                      <p>
                        <strong>High:</strong>{' '}
                        {selectedWeatherDay.highTemp != null
                          ? `${Math.round(selectedWeatherDay.highTemp)} ${tenDayWeather.temperatureUnit === 'celsius' ? 'C' : 'F'}`
                          : 'N/A'}
                      </p>
                      <p>
                        <strong>Low:</strong>{' '}
                        {selectedWeatherDay.lowTemp != null
                          ? `${Math.round(selectedWeatherDay.lowTemp)} ${tenDayWeather.temperatureUnit === 'celsius' ? 'C' : 'F'}`
                          : 'N/A'}
                      </p>
                      <p><strong>Rain chance:</strong> {selectedWeatherDay.precipitationChance != null ? `${Math.round(selectedWeatherDay.precipitationChance)}%` : 'N/A'}</p>
                      <p>
                        <strong>Wind speed:</strong>{' '}
                        {selectedWeatherDay.windSpeed != null
                          ? `${Math.round(selectedWeatherDay.windSpeed)} ${tenDayWeather.windSpeedUnit === 'kmh' ? 'km/h' : 'mph'}`
                          : 'N/A'}
                      </p>
                      <p><strong>Max humidity:</strong> {selectedWeatherDay.humidityMax != null ? `${Math.round(selectedWeatherDay.humidityMax)}%` : 'N/A'}</p>
                    </div>
                  </article>
                )}
              </>
            )}
          </section>

          <section className="live-stats-grid">
            <article className="live-panel live-stat-card" data-animate="fade-up" data-delay="0">
              <div className="live-stat-top">
                <span className="live-stat-icon live-stat-icon-blue"><Globe size={22} /></span>
              </div>
              <div className="live-stat-value">{stats.total}</div>
              <p className="live-stat-label">Open tracked incidents in this feed</p>
            </article>

            <article className="live-panel live-stat-card" data-animate="fade-up" data-delay="100">
              <div className="live-stat-top">
                <span className="live-stat-icon live-stat-icon-red"><Flame size={22} /></span>
              </div>
              <div className="live-stat-value">{stats.wildfires}</div>
              <p className="live-stat-label">Wildfires in the active results</p>
            </article>

            <article className="live-panel live-stat-card" data-animate="fade-up" data-delay="200">
              <div className="live-stat-top">
                <span className="live-stat-icon live-stat-icon-blue"><Droplets size={22} /></span>
              </div>
              <div className="live-stat-value">{stats.floods}</div>
              <p className="live-stat-label">Flood-related incidents</p>
            </article>

            <article className="live-panel live-stat-card" data-animate="fade-up" data-delay="300">
              <div className="live-stat-top">
                <span className="live-stat-icon live-stat-icon-purple"><Wind size={22} /></span>
              </div>
              <div className="live-stat-value">{activeLocation ? stats.nearby : stats.storms}</div>
              <p className="live-stat-label">{activeLocation ? 'Closest incidents to your searched location' : 'Storm systems, hurricanes, and tornadoes'}</p>
            </article>

            <article className="live-panel live-stat-card" data-animate="fade-up" data-delay="400">
              <div className="live-stat-top">
                <span className="live-stat-icon live-stat-icon-danger"><TriangleAlert size={22} /></span>
              </div>
              <div className="live-stat-value">{criticalAlertCount}</div>
              <p className="live-stat-label">Critical NOAA warnings and watches</p>
            </article>
          </section>

          <section className="live-panel live-critical-alerts-card">
            <div className="live-critical-header">
              <div className="live-critical-title">
                <span className="live-critical-title-icon"><TriangleAlert size={18} /></span>
                <div>
                  <span className="live-critical-eyebrow">NOAA priority monitor</span>
                  <h3>Critical Weather Alerts</h3>
                </div>
              </div>
              <div className="live-critical-summary">
                <span>{criticalAlertCount}</span>
                <p>Active critical alerts</p>
              </div>
            </div>

            <div className="live-critical-subheader">
              <div>
                <p>Red priority feed for dangerous conditions where people should focus right now.</p>
              </div>
              {alertsLastUpdated && (
                <p className="live-critical-meta">Updated {formatTimestamp(alertsLastUpdated, { hour: 'numeric', minute: '2-digit' })}</p>
              )}
            </div>

            {alertsError && <p className="live-error">{alertsError}</p>}

            {visibleFocusAreas.length > 0 && (
              <div className="live-focus-areas">
                <strong>Top Focus Areas</strong>
                <div className="live-focus-tags">
                  {visibleFocusAreas.map((area) => (
                    <span key={area} className="live-focus-tag">{area}</span>
                  ))}
                  {hiddenFocusAreaCount > 0 && (
                    <span className="live-focus-tag live-focus-tag-muted">+{hiddenFocusAreaCount} more</span>
                  )}
                </div>
              </div>
            )}

            {alerts.length === 0 ? (
              <div className="live-empty-state">No severe/critical weather alerts are active in the NOAA feed right now.</div>
            ) : (
              <div className="live-critical-grid">
                {alerts.slice(0, 8).map((alert) => {
                  const areaSummary = summarizeAlertAreas(alert.areaDesc, 2);

                  return (
                    <article key={alert.id} className="live-critical-card">
                      <div className="live-critical-card-top">
                        <span className="live-critical-event">{alert.event}</span>
                        <span className="live-critical-severity">{alert.severity}</span>
                      </div>
                      <p className="live-critical-area">
                        <MapPin size={13} />
                        <span>{areaSummary.text}</span>
                        {areaSummary.extraCount > 0 && (
                          <span className="live-critical-more">+{areaSummary.extraCount} more</span>
                        )}
                      </p>
                      <p className="live-critical-headline">{alert.headline}</p>
                      <div className="live-critical-times">
                        <span><Clock size={12} /> {formatTimestamp(alert.sent, { hour: 'numeric', minute: '2-digit' })}</span>
                        <span>{alert.status}</span>
                      </div>
                      <a className="live-critical-link" href={alert.sourceUrl} target="_blank" rel="noreferrer">
                        NOAA details
                        <ExternalLink size={12} />
                      </a>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="live-visual-grid">
            <article className="live-panel live-chart-card">
              <h3>Incident types</h3>
              <p>Compare all active incidents with your current filter view.</p>
              <div className="live-chart-toolbar">
                <div className="live-filter-pills live-chart-controls" role="group" aria-label="Incident chart metric">
                  <button
                    type="button"
                    className={`live-filter-pill ${incidentMetric === 'count' ? 'active' : ''}`}
                    onClick={() => setIncidentMetric('count')}
                  >
                    Count
                  </button>
                  <button
                    type="button"
                    className={`live-filter-pill ${incidentMetric === 'share' ? 'active' : ''}`}
                    onClick={() => setIncidentMetric('share')}
                  >
                    Percent
                  </button>
                </div>
                <p className="live-chart-note">Dark bars show visible results. Light bars show what your current filter hides.</p>
              </div>
              <div className="live-chart-wrap">
                {categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart key={`incident-${chartAnimationKey}`} data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} domain={incidentMetric === 'share' ? [0, 100] : [0, 'auto']} tickFormatter={(value) => (incidentMetric === 'share' ? `${value}%` : value)} />
                      <Tooltip
                        formatter={(value, name, item) => {
                          const { payload } = item;
                          if (name === 'Visible in current view') {
                            return incidentMetric === 'share' ? `${value}% (${payload.inView}/${payload.totalAll})` : value;
                          }

                          return incidentMetric === 'share' ? `${value}% (${payload.outsideView}/${payload.totalAll})` : value;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="inViewValue" name="Visible in current view" stackId="incident" fill="#0052a3" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={700} />
                      <Bar dataKey="outsideViewValue" name="Outside current view" stackId="incident" fill="#c7d9ef" isAnimationActive animationDuration={700} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="live-empty-chart">No chart data is available yet.</div>
                )}
              </div>
            </article>

            <article className="live-panel live-chart-card">
              <h3>Recent activity trend</h3>
              <p>Live category trend over a selectable recent window.</p>
              <div className="live-chart-toolbar">
                <div className="live-filter-pills live-chart-controls" role="group" aria-label="Trend window">
                  {[7, 14, 30].map((windowDays) => (
                    <button
                      key={`trend-${windowDays}`}
                      type="button"
                      className={`live-filter-pill ${trendWindowDays === windowDays ? 'active' : ''}`}
                      onClick={() => setTrendWindowDays(windowDays)}
                    >
                      {windowDays} days
                    </button>
                  ))}
                </div>
                <p className="live-chart-note">Trend updates automatically every 5 minutes from the live feed.</p>
              </div>
              <div className="live-chart-wrap">
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart key={`trend-${chartAnimationKey}`} data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="flood" name="Flood" stackId="trend" stroke="#1f7ae0" fill="#9dc4f5" isAnimationActive animationDuration={700} />
                      <Area type="monotone" dataKey="wildfire" name="Wildfire" stackId="trend" stroke="#d65a00" fill="#f0c097" isAnimationActive animationDuration={700} />
                      <Area type="monotone" dataKey="storm" name="Storm/Hurricane/Tornado" stackId="trend" stroke="#6b54b4" fill="#c9c2f0" isAnimationActive animationDuration={700} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="live-empty-chart">No timeline data is available yet.</div>
                )}
              </div>
            </article>
          </section>

          <section className="live-feed-grid">
            <article className="live-panel live-feed-card">
              <h3>Newest activity</h3>
              <p>Latest events published into the live open-event feed.</p>
              <div className="live-feed-list">
                {newestEvents.length === 0 && !loading && <div className="live-empty-state">No activity is available right now.</div>}
                {newestEvents.map((event) => {
                  const EventIcon = iconByEventType[event.type] || AlertCircle;

                  return (
                    <article key={event.id} className="live-feed-item">
                      <div className="live-feed-row">
                        <div>
                          <h4>{event.title}</h4>
                          <div className="live-feed-meta">
                            <span><Clock size={14} className="mr-1" />{formatTimestamp(event.date)}</span>
                            <span><MapPin size={14} className="mr-1" />{formatCoordinates(event.coordinates)}</span>
                          </div>
                        </div>
                        <span className={`live-type-badge live-type-${event.type}`}>
                          <EventIcon size={14} />
                          {event.typeLabel}
                        </span>
                      </div>
                      <div className="live-feed-links">
                        {event.mapLinks.map((mapLink) => (
                          <a key={`${event.id}-${mapLink.label}`} href={mapLink.href} target="_blank" rel="noreferrer">
                            Open in {mapLink.label}
                            <ExternalLink size={12} />
                          </a>
                        ))}
                      </div>
                      {event.sourceLinks.some((source) => !source.restricted) && (
                        <div className="live-feed-links">
                          {event.sourceLinks.filter((source) => !source.restricted).slice(0, 2).map((source) => (
                            <a key={`${event.id}-${source.id}`} href={source.href} target="_blank" rel="noreferrer">
                              {source.id} Source
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      )}
                      {event.sourceLinks.some((source) => source.restricted) && (
                        <p className="live-restricted-note">Some agency source links may require an account (for example, IRWIN).</p>
                      )}
                    </article>
                  );
                })}
              </div>
            </article>

            <article className="live-panel live-feed-card">
              <h3>{activeLocation ? 'Closest to searched location' : 'Operations snapshot'}</h3>
              <p>
                {activeLocation
                  ? 'These are the nearest tracked incidents to the location you searched.'
                  : 'Search a location to rank incidents by proximity, or browse the current active feed below.'}
              </p>
              <div className="live-feed-list">
                {nearbyEvents.slice(0, 5).map((event) => (
                  <article key={`nearby-${event.id}`} className="live-feed-item">
                    <div className="live-feed-row">
                      <div>
                        <h4>{event.title}</h4>
                        <div className="live-feed-meta">
                          <span>{event.typeLabel}</span>
                          <span>{formatCoordinates(event.coordinates)}</span>
                          {typeof event.distanceMiles === 'number' && <span>{Math.round(event.distanceMiles)} miles away</span>}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {!nearbyEvents.length && !loading && (
                  <div className="live-empty-state">No incidents match the current filters.</div>
                )}
              </div>
            </article>
          </section>

          <section className="live-panel live-events-card">
            <div className="live-events-header">
              <div>
                <h3>Live incident cards</h3>
                <p>
                  {activeLocation
                    ? `Showing ${nearbyEvents.length} closest results for ${activeLocation.name}`
                    : `Showing ${filteredByType.length} open incidents from the active feed`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="live-empty-state">Loading live disaster activity…</div>
            ) : nearbyEvents.length === 0 ? (
              <div className="live-empty-state">No incidents are available for this filter yet.</div>
            ) : (
              <div className="live-events-grid">
                {nearbyEvents.slice(0, 12).map((event) => {
                  const EventIcon = iconByEventType[event.type] || AlertCircle;

                  return (
                    <article key={event.id} className="live-event-card">
                      <div className="live-feed-row">
                        <div>
                          <h4>{event.title}</h4>
                          <p className="live-event-description">
                            {event.description || `${event.typeLabel} activity is currently active in this tracked area.`}
                          </p>
                        </div>
                        <span className={`live-type-badge live-type-${event.type}`}>
                          <EventIcon size={14} />
                          {event.typeLabel}
                        </span>
                      </div>

                      <div className="live-event-stats">
                        <div className="live-event-stat">
                          <span className="live-event-stat-label">Latest update</span>
                          <span className="live-event-stat-value">{formatTimestamp(event.date)}</span>
                        </div>
                        <div className="live-event-stat">
                          <span className="live-event-stat-label">Coordinates</span>
                          <span className="live-event-stat-value">{formatCoordinates(event.coordinates)}</span>
                        </div>
                        <div className="live-event-stat">
                          <span className="live-event-stat-label">Category</span>
                          <span className="live-event-stat-value">{event.categoryTitle}</span>
                        </div>
                        <div className="live-event-stat">
                          <span className="live-event-stat-label">Magnitude</span>
                          <span className="live-event-stat-value">{event.magnitudeLabel || 'Not provided'}</span>
                        </div>
                        {typeof event.distanceMiles === 'number' && (
                          <div className="live-event-stat">
                            <span className="live-event-stat-label">Distance</span>
                            <span className="live-event-stat-value">{Math.round(event.distanceMiles)} miles</span>
                          </div>
                        )}
                        <div className="live-event-stat">
                          <span className="live-event-stat-label">Sources</span>
                          <span className="live-event-stat-value">{event.sourceNames.join(', ') || 'NASA feed'}</span>
                        </div>
                      </div>

                      <div className="live-feed-links">
                        {event.mapLinks.map((mapLink) => (
                          <a key={`${event.id}-detail-${mapLink.label}`} href={mapLink.href} target="_blank" rel="noreferrer">
                            Open in {mapLink.label}
                            <ExternalLink size={12} />
                          </a>
                        ))}
                      </div>

                      {event.sourceLinks.some((source) => !source.restricted) && (
                        <div className="live-feed-links">
                          {event.sourceLinks.filter((source) => !source.restricted).slice(0, 2).map((source) => (
                            <a key={`${event.id}-detail-${source.id}`} href={source.href} target="_blank" rel="noreferrer">
                              Source {source.id}
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      )}

                      {event.sourceLinks.some((source) => source.restricted) && (
                        <p className="live-restricted-note">Additional agency links are available but may require sign-in.</p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            <p className="live-events-note">
              Live activity is powered by NASA EONET open events. Location search uses OpenStreetMap Nominatim to place your search and then ranks nearby incidents by miles.
            </p>
          </section>
        </div>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default LiveActivityPage;
