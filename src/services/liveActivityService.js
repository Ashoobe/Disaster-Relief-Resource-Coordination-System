const EONET_EVENTS_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const NOAA_ALERTS_URL = 'https://api.weather.gov/alerts/active?status=actual&message_type=alert';
const ZIP_LOOKUP_URL = 'https://api.zippopotam.us/us';
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const RESTRICTED_SOURCE_IDS = new Set(['IRWIN']);
const PRIORITY_ALERT_EVENTS = new Set([
  'Tornado Warning',
  'Hurricane Warning',
  'Hurricane Watch',
  'Flash Flood Warning',
  'Flood Warning',
  'Severe Thunderstorm Warning',
  'Tropical Storm Warning',
  'Tornado Watch',
  'Red Flag Warning',
  'Blizzard Warning',
  'Extreme Wind Warning',
]);

const buildMapLinks = (point) => {
  if (!point) {
    return [];
  }

  const latitude = point.latitude.toFixed(5);
  const longitude = point.longitude.toFixed(5);

  return [
    {
      label: 'OpenStreetMap',
      href: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=8/${latitude}/${longitude}`,
    },
    {
      label: 'Google Maps',
      href: `https://www.google.com/maps?q=${latitude},${longitude}`,
    },
  ];
};

const toRadians = (value) => (value * Math.PI) / 180;

const averageCoordinates = (pairs = []) => {
  if (!pairs.length) {
    return null;
  }

  const totals = pairs.reduce(
    (accumulator, pair) => ({
      longitude: accumulator.longitude + pair[0],
      latitude: accumulator.latitude + pair[1],
    }),
    { longitude: 0, latitude: 0 }
  );

  return {
    longitude: totals.longitude / pairs.length,
    latitude: totals.latitude / pairs.length,
  };
};

const flattenPolygonCoordinates = (coordinates = []) => {
  return coordinates.flatMap((ring) => ring);
};

const extractPointFromGeometry = (geometry) => {
  if (!geometry?.coordinates) {
    return null;
  }

  if (geometry.type === 'Point') {
    return {
      longitude: geometry.coordinates[0],
      latitude: geometry.coordinates[1],
    };
  }

  if (geometry.type === 'Polygon') {
    return averageCoordinates(flattenPolygonCoordinates(geometry.coordinates));
  }

  if (geometry.type === 'MultiPolygon') {
    const points = geometry.coordinates.flatMap((polygon) => flattenPolygonCoordinates(polygon));
    return averageCoordinates(points);
  }

  return null;
};

const deriveEventType = (event) => {
  const categoryIds = (event.categories || []).map((category) => category.id);
  const haystack = `${event.title || ''} ${event.description || ''}`.toLowerCase();

  if (categoryIds.includes('wildfires')) {
    return 'wildfire';
  }

  if (categoryIds.includes('floods')) {
    return 'flood';
  }

  if (haystack.includes('tornado')) {
    return 'tornado';
  }

  if (haystack.includes('hurricane') || haystack.includes('typhoon') || haystack.includes('cyclone') || haystack.includes('tropical storm')) {
    return 'hurricane';
  }

  return 'storm';
};

const deriveWeatherAlertType = (eventName = '') => {
  const name = eventName.toLowerCase();

  if (name.includes('flood')) {
    return 'flood';
  }

  if (name.includes('tornado')) {
    return 'tornado';
  }

  if (
    name.includes('hurricane') ||
    name.includes('tropical storm') ||
    name.includes('typhoon') ||
    name.includes('cyclone')
  ) {
    return 'hurricane';
  }

  if (name.includes('fire weather') || name.includes('red flag') || name.includes('wildfire')) {
    return 'wildfire';
  }

  return 'storm';
};

const getEventTypeLabel = (type) => {
  const labels = {
    flood: 'Flood',
    wildfire: 'Wildfire',
    hurricane: 'Hurricane',
    tornado: 'Tornado',
    storm: 'Severe Storm',
  };

  return labels[type] || 'Natural Event';
};

const getLatestGeometry = (event) => {
  if (!Array.isArray(event.geometry) || !event.geometry.length) {
    return null;
  }

  return event.geometry[event.geometry.length - 1];
};

const buildMagnitudeLabel = (geometry) => {
  if (!geometry?.magnitudeValue || !geometry?.magnitudeUnit) {
    return null;
  }

  return `${geometry.magnitudeValue.toLocaleString()} ${geometry.magnitudeUnit}`;
};

const sortNewestFirst = (events) => {
  return [...events].sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
};

export const liveActivitySources = [
  {
    label: 'NASA EONET',
    href: 'https://eonet.gsfc.nasa.gov/docs/v3',
  },
  {
    label: 'NOAA Weather Alerts',
    href: 'https://www.weather.gov/documentation/services-web-alerts',
  },
  {
    label: 'Open-Meteo Forecast',
    href: 'https://open-meteo.com/en/docs',
  },
  {
    label: 'Zippopotam ZIP Lookup',
    href: 'https://docs.zippopotam.us/docs/v1/',
  },
  {
    label: 'OpenStreetMap Nominatim',
    href: 'https://nominatim.org/release-docs/latest/api/Search/',
  },
];

const weatherCodeLabels = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm with hail',
};

const weatherCodeToType = (weatherCode) => {
  if ([95, 96, 99].includes(weatherCode)) {
    return 'severe';
  }

  if ([65, 67, 75, 81, 82, 86].includes(weatherCode)) {
    return 'high';
  }

  if ([45, 48, 63, 73, 80, 85].includes(weatherCode)) {
    return 'moderate';
  }

  return 'normal';
};

const weatherSeverityWeight = {
  normal: 0,
  moderate: 1,
  high: 2,
  severe: 3,
};

const getHourFromTimestamp = (timestamp = '') => {
  const [, timePart] = `${timestamp}`.split('T');
  if (!timePart) {
    return null;
  }

  const [hourString] = timePart.split(':');
  const parsedHour = Number(hourString);
  return Number.isFinite(parsedHour) ? parsedHour : null;
};

const toHourLabel = (hour24) => {
  if (!Number.isFinite(hour24)) {
    return 'unknown time';
  }

  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12} ${period}`;
};

const getDominantWeatherCode = (codes = []) => {
  const validCodes = codes.filter((value) => Number.isFinite(value));
  if (!validCodes.length) {
    return null;
  }

  return validCodes.reduce((selectedCode, candidateCode) => {
    if (selectedCode == null) {
      return candidateCode;
    }

    const selectedSeverity = weatherSeverityWeight[weatherCodeToType(selectedCode)] || 0;
    const candidateSeverity = weatherSeverityWeight[weatherCodeToType(candidateCode)] || 0;

    if (candidateSeverity !== selectedSeverity) {
      return candidateSeverity > selectedSeverity ? candidateCode : selectedCode;
    }

    return candidateCode > selectedCode ? candidateCode : selectedCode;
  }, null);
};

const buildDailyWeatherNarrative = (date, dailyCondition, hourlyData, units) => {
  if (!hourlyData?.time?.length) {
    return `${dailyCondition} expected through the day.`;
  }

  const dayIndexes = hourlyData.time
    .map((time, index) => ({ time, index }))
    .filter((entry) => entry.time.startsWith(`${date}T`))
    .map((entry) => entry.index);

  if (!dayIndexes.length) {
    return `${dailyCondition} expected through the day.`;
  }

  const weatherCodes = dayIndexes.map((index) => hourlyData.weather_code?.[index]).filter((value) => Number.isFinite(value));
  const dominantCode = getDominantWeatherCode(weatherCodes);
  const dominantLabel = dominantCode != null ? weatherCodeLabels[dominantCode] || dailyCondition : dailyCondition;

  const dayParts = [
    { label: 'Morning', start: 6, end: 11 },
    { label: 'Afternoon', start: 12, end: 17 },
    { label: 'Evening', start: 18, end: 22 },
  ];

  const partSummaries = dayParts
    .map((part) => {
      const partCodes = dayIndexes
        .filter((index) => {
          const hour = getHourFromTimestamp(hourlyData.time?.[index]);
          return Number.isFinite(hour) && hour >= part.start && hour <= part.end;
        })
        .map((index) => hourlyData.weather_code?.[index]);

      const partDominantCode = getDominantWeatherCode(partCodes);
      if (partDominantCode == null) {
        return null;
      }

      return `${part.label.toLowerCase()} ${weatherCodeLabels[partDominantCode] || dailyCondition}`;
    })
    .filter(Boolean);

  const rainPeak = dayIndexes.reduce(
    (peak, index) => {
      const value = hourlyData.precipitation_probability?.[index];
      if (!Number.isFinite(value) || value <= peak.value) {
        return peak;
      }

      return {
        value,
        hour: getHourFromTimestamp(hourlyData.time?.[index]),
      };
    },
    { value: -1, hour: null }
  );

  const windPeak = dayIndexes.reduce(
    (peak, index) => {
      const value = hourlyData.wind_speed_10m?.[index];
      if (!Number.isFinite(value) || value <= peak.value) {
        return peak;
      }

      return {
        value,
        hour: getHourFromTimestamp(hourlyData.time?.[index]),
      };
    },
    { value: -1, hour: null }
  );

  const narrativeParts = [`Mostly ${dominantLabel.toLowerCase()}.`];

  if (partSummaries.length) {
    narrativeParts.push(`${partSummaries.map((summary, index) => (index === 0 ? `${summary.charAt(0).toUpperCase()}${summary.slice(1)}` : summary)).join(', ')}.`);
  }

  if (rainPeak.value >= 0) {
    narrativeParts.push(`Highest rain chance near ${toHourLabel(rainPeak.hour)} (${Math.round(rainPeak.value)}%).`);
  }

  if (windPeak.value >= 0) {
    const windUnitLabel = units.windSpeedUnit === 'kmh' ? 'km/h' : 'mph';
    narrativeParts.push(`Strongest wind near ${toHourLabel(windPeak.hour)} (${Math.round(windPeak.value)} ${windUnitLabel}).`);
  }

  return narrativeParts.join(' ');
};

const severityRank = {
  Extreme: 4,
  Severe: 3,
  Moderate: 2,
  Minor: 1,
  Unknown: 0,
};

const isPriorityAlert = (alert) => {
  if (PRIORITY_ALERT_EVENTS.has(alert.event)) {
    return true;
  }

  return ['Extreme', 'Severe'].includes(alert.severity);
};

const buildNoaaPublicAlertUrl = (point) => {
  if (point?.latitude != null && point?.longitude != null) {
    const latitude = Number(point.latitude).toFixed(4);
    const longitude = Number(point.longitude).toFixed(4);
    return `https://forecast.weather.gov/MapClick.php?lat=${latitude}&lon=${longitude}`;
  }

  // Fallback to the human-readable NOAA alerts page.
  return 'https://www.weather.gov/alerts';
};

export const fetchCriticalWeatherAlerts = async () => {
  const response = await fetch(NOAA_ALERTS_URL);
  if (!response.ok) {
    throw new Error(`Weather alerts request failed (${response.status}).`);
  }

  const payload = await response.json();
  const features = Array.isArray(payload.features) ? payload.features : [];

  const alerts = features
    .map((feature) => {
      const properties = feature.properties || {};
      const event = properties.event || 'Weather Alert';
      const severity = properties.severity || 'Unknown';
      const point = extractPointFromGeometry(feature.geometry);

      return {
        id: feature.id || `${event}-${properties.sent || Date.now()}`,
        event,
        severity,
        urgency: properties.urgency || 'Unknown',
        certainty: properties.certainty || 'Unknown',
        areaDesc: properties.areaDesc || 'Area unavailable',
        headline: properties.headline || event,
        description: properties.description || '',
        instruction: properties.instruction || '',
        sent: properties.sent || null,
        effective: properties.effective || null,
        ends: properties.ends || null,
        status: properties.status || 'Actual',
        coordinates: point,
        sourceUrl: buildNoaaPublicAlertUrl(point),
        apiUrl: feature.id || null,
      };
    })
    .filter((alert) => isPriorityAlert(alert))
    .sort((left, right) => {
      const severityGap = (severityRank[right.severity] || 0) - (severityRank[left.severity] || 0);
      if (severityGap !== 0) {
        return severityGap;
      }

      return new Date(right.sent || 0).getTime() - new Date(left.sent || 0).getTime();
    });

  return alerts;
};

export const fetchLiveActivityEvents = async () => {
  const primarySearchParams = new URLSearchParams({
    status: 'open',
    days: '30',
    category: 'wildfires,severeStorms,floods',
    limit: '250',
  });

  const buildEvents = (payload) => {
    const events = Array.isArray(payload.events) ? payload.events : [];

    return sortNewestFirst(
      events
        .map((event) => {
          const latestGeometry = getLatestGeometry(event);
          const point = extractPointFromGeometry(latestGeometry);
          const type = deriveEventType(event);

          return {
            id: event.id,
            title: event.title,
            description: event.description,
            eonetApiUrl: event.link,
            type,
            typeLabel: getEventTypeLabel(type),
            categoryTitle: event.categories?.[0]?.title || 'Natural Events',
            date: latestGeometry?.date || null,
            closed: event.closed,
            coordinates: point,
            mapLinks: buildMapLinks(point),
            magnitudeLabel: buildMagnitudeLabel(latestGeometry),
            sourceLinks: (event.sources || []).map((source) => ({
              id: source.id,
              href: source.url,
              restricted: RESTRICTED_SOURCE_IDS.has(source.id),
            })),
            sourceNames: (event.sources || []).map((source) => source.id),
          };
        })
        .filter((event) => event.date && event.coordinates)
    );
  };

  const buildNoaaEvents = (payload) => {
    const features = Array.isArray(payload.features) ? payload.features : [];

    return sortNewestFirst(
      features
        .map((feature) => {
          const properties = feature.properties || {};
          const point = extractPointFromGeometry(feature.geometry);
          const event = properties.event || 'NOAA Alert';
          const type = deriveWeatherAlertType(event);
          const date = properties.effective || properties.sent || properties.onset || null;
          const area = properties.areaDesc || 'Area unavailable';

          return {
            id: `noaa-${feature.id || `${event}-${date || Date.now()}`}`,
            title: `${event} - ${area}`,
            description: properties.headline || properties.description || `NOAA alert for ${area}.`,
            eonetApiUrl: feature.id || null,
            type,
            typeLabel: getEventTypeLabel(type),
            categoryTitle: 'NOAA Weather Alerts',
            date,
            closed: null,
            coordinates: point,
            mapLinks: buildMapLinks(point),
            magnitudeLabel: properties.severity || null,
            sourceLinks: [
              {
                id: 'NOAA',
                href: buildNoaaPublicAlertUrl(point),
                restricted: false,
              },
            ],
            sourceNames: ['NOAA'],
          };
        })
        .filter((event) => event.date && event.coordinates)
    );
  };

  const primaryResponse = await fetch(`${EONET_EVENTS_URL}?${primarySearchParams.toString()}`);
  if (!primaryResponse.ok) {
    throw new Error(`Live feed request failed (${primaryResponse.status}).`);
  }

  const primaryPayload = await primaryResponse.json();
  const primaryEvents = buildEvents(primaryPayload);
  const activeNoaaResponse = await fetch(NOAA_ALERTS_URL);
  const noaaEvents = activeNoaaResponse.ok
    ? buildNoaaEvents(await activeNoaaResponse.json())
    : [];

  const combinedPrimary = sortNewestFirst([...primaryEvents, ...noaaEvents]);
  if (combinedPrimary.length > 0) {
    return combinedPrimary;
  }

  // Fallback: load all open events in case category filtering produces no results.
  const fallbackSearchParams = new URLSearchParams({
    status: 'open',
    days: '30',
    limit: '250',
  });
  const fallbackResponse = await fetch(`${EONET_EVENTS_URL}?${fallbackSearchParams.toString()}`);
  if (!fallbackResponse.ok) {
    return combinedPrimary;
  }

  const fallbackPayload = await fallbackResponse.json();
  const fallbackEvents = buildEvents(fallbackPayload);
  return sortNewestFirst([...fallbackEvents, ...noaaEvents]);
};

export const geocodeLocation = async (query) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return null;
  }

  const searchParams = new URLSearchParams({
    q: trimmedQuery,
    format: 'jsonv2',
    limit: '1',
  });

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${searchParams.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to search that location right now.');
  }

  const payload = await response.json();
  const match = Array.isArray(payload) ? payload[0] : null;
  if (!match) {
    return null;
  }

  return {
    name: match.display_name,
    latitude: Number(match.lat),
    longitude: Number(match.lon),
  };
};

export const calculateDistanceMiles = (origin, destination) => {
  if (!origin || !destination) {
    return null;
  }

  const earthRadiusKm = 6371;
  const kmToMiles = 0.621371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return earthRadiusKm * centralAngle * kmToMiles;
};

export const addDistanceToEvents = (events, location) => {
  return events.map((event) => ({
    ...event,
    distanceMiles: calculateDistanceMiles(location, event.coordinates),
  }));
};

export const fetchTenDayWeatherByZip = async (zipCode, options = {}) => {
  const normalizedZip = `${zipCode || ''}`.trim();
  if (!/^\d{5}$/.test(normalizedZip)) {
    throw new Error('Enter a valid 5-digit US ZIP code.');
  }

  const temperatureUnit = options.temperatureUnit === 'celsius' ? 'celsius' : 'fahrenheit';
  const windSpeedUnit = options.windSpeedUnit === 'kmh' ? 'kmh' : 'mph';
  const requestedDays = Number.isInteger(options.forecastDays) ? options.forecastDays : 10;
  const forecastDays = Math.max(10, Math.min(14, requestedDays));

  const zipResponse = await fetch(`${ZIP_LOOKUP_URL}/${normalizedZip}`);
  if (!zipResponse.ok) {
    throw new Error('ZIP code not found. Try another US ZIP code.');
  }

  const zipPayload = await zipResponse.json();
  const place = Array.isArray(zipPayload.places) ? zipPayload.places[0] : null;
  if (!place) {
    throw new Error('Unable to resolve ZIP code location.');
  }

  const latitude = Number(place.latitude);
  const longitude = Number(place.longitude);
  const weatherParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_max',
    hourly: 'weather_code,temperature_2m,precipitation_probability,wind_speed_10m,relative_humidity_2m',
    forecast_days: forecastDays.toString(),
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    timezone: 'auto',
  });

  const weatherResponse = await fetch(`${OPEN_METEO_FORECAST_URL}?${weatherParams.toString()}`);
  if (!weatherResponse.ok) {
    throw new Error('Unable to load 10-day forecast right now.');
  }

  const weatherPayload = await weatherResponse.json();
  const daily = weatherPayload.daily;
  const hourly = weatherPayload.hourly;
  if (!daily?.time || !daily.time.length) {
    throw new Error('Forecast service returned no daily results.');
  }

  const forecast = daily.time.map((date, index) => {
    const weatherCode = daily.weather_code?.[index] ?? null;
    return {
      date,
      weatherCode,
      condition: weatherCodeLabels[weatherCode] || 'Weather update',
      severity: weatherCodeToType(weatherCode),
      highTemp: daily.temperature_2m_max?.[index] ?? null,
      lowTemp: daily.temperature_2m_min?.[index] ?? null,
      precipitationChance: daily.precipitation_probability_max?.[index] ?? null,
      windSpeed: daily.wind_speed_10m_max?.[index] ?? null,
      humidityMax: daily.relative_humidity_2m_max?.[index] ?? null,
      description: buildDailyWeatherNarrative(date, weatherCodeLabels[weatherCode] || 'Weather update', hourly, {
        temperatureUnit,
        windSpeedUnit,
      }),
    };
  });

  return {
    zipCode: normalizedZip,
    placeName: place['place name'],
    state: place['state abbreviation'] || place.state,
    latitude,
    longitude,
    timezone: weatherPayload.timezone,
    temperatureUnit,
    windSpeedUnit,
    forecastDays,
    fetchedAt: new Date().toISOString(),
    forecast,
  };
};