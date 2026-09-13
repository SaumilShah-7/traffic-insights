import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { METRICS, TrafficMetricKey } from '../constants';
import {
  CountryTrafficMetrics,
  VehicleTrafficMetrics,
} from '../api/traffic-service/interface';

type TrafficChartData = CountryTrafficMetrics | VehicleTrafficMetrics;
type CategoryKey = 'countryName' | 'vehicleName';

interface TrafficChartProps {
  title: string;
  data: TrafficChartData[];
  categoryKey: CategoryKey;
  metric: TrafficMetricKey;
  onMetricChange: (metric: TrafficMetricKey) => void;
  isLoading: boolean;
  hasError: boolean;
}

const numberFormatter = new Intl.NumberFormat('en', { notation: 'compact' });
const fullNumberFormatter = new Intl.NumberFormat('en');

const TrafficChart = ({
  title,
  data,
  categoryKey,
  metric,
  onMetricChange,
  isLoading,
  hasError,
}: TrafficChartProps) => {
  const selectedMetric = METRICS.find((item) => item.key === metric);
  const chartData = data.map((item) => ({
    ...item,
    averageSpeedKph:
      item.totalTravelTimeHours === 0
        ? 0
        : item.totalTravelDistanceKms / item.totalTravelTimeHours,
  }));

  if (!selectedMetric) return null;

  return (
    <section className="chart-card">
      <div className="chart-heading">
        <h2>{title}</h2>
        <select
          className="chart-metric-selector"
          value={metric}
          onChange={(event) => {
            onMetricChange(event.target.value as TrafficMetricKey);
          }}
        >
          {METRICS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="chart-wrapper">
        {isLoading ? (
          <div className="chart-state" role="status">
            <div className="chart-state-icon">—</div>
            <h3>Loading metrics</h3>
          </div>
        ) : hasError ? (
          <div className="chart-state chart-state--error" role="alert">
            <div className="chart-state-icon">!</div>
            <h3>Unexpected error</h3>
          </div>
        ) : chartData.length === 0 ? (
          <div className="chart-state" role="status">
            <div className="chart-state-icon">—</div>
            <h3>No data available</h3>
            <p>Try choosing a different month or year</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} stroke="#e8edf3" />
              <XAxis
                dataKey={categoryKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#667085', fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => numberFormatter.format(value)}
                tick={{ fill: '#667085', fontSize: 12 }}
                width={30}
              />
              <Tooltip
                cursor={{ fill: '#f5f7fb' }}
                contentStyle={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(16, 24, 40, 0.08)',
                  fontSize: 13,
                  fontWeight: 400,
                }}
                labelStyle={{ fontSize: 13, fontWeight: 400 }}
                itemStyle={{ fontSize: 13, fontWeight: 400 }}
                formatter={(value) => [
                  `${fullNumberFormatter.format(Number(value))} ${selectedMetric.unit}`,
                  selectedMetric.label,
                ]}
              />
              <Bar
                dataKey={selectedMetric.key}
                fill={selectedMetric.color}
                maxBarSize={28}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export default TrafficChart;
