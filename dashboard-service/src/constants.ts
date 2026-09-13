type TrafficMetricKey =
  | 'vehicleCount'
  | 'totalTravelDistanceKms'
  | 'totalTravelTimeHours'
  | 'averageSpeedKph';

interface MetricOption {
  key: TrafficMetricKey;
  label: string;
  unit: string;
  color: string;
}

const METRICS: MetricOption[] = [
  {
    key: 'vehicleCount',
    label: 'Vehicle Count',
    unit: 'vehicles',
    color: '#f79009',
  },
  {
    key: 'totalTravelDistanceKms',
    label: 'Travel Distance (km)',
    unit: 'km',
    color: '#3563e9',
  },
  {
    key: 'totalTravelTimeHours',
    label: 'Travel Time (h)',
    unit: 'h',
    color: '#12a594',
  },
  {
    key: 'averageSpeedKph',
    label: 'Avg Speed (km/h)',
    unit: 'km/h',
    color: '#8b5cf6',
  },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type DashboardSection = 'metrics' | 'data';

export { METRICS, MONTHS, TrafficMetricKey, DashboardSection };
