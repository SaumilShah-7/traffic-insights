import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getCountryTrafficMetrics,
  getVehicleTrafficMetrics,
} from '../../src/api/traffic-service';
import {
  CountryTrafficMetrics,
  VehicleTrafficMetrics,
} from '../../src/api/traffic-service/interface';
import { TrafficMetricKey } from '../../src/constants';
import DashboardPage from '../../src/pages/DashboardPage';

jest.mock('../../src/api/traffic-service', () => ({
  getCountryTrafficMetrics: jest.fn(),
  getVehicleTrafficMetrics: jest.fn(),
}));

interface MockTrafficChartProps {
  title: string;
  data: Array<CountryTrafficMetrics | VehicleTrafficMetrics>;
  metric: TrafficMetricKey;
  onMetricChange: (metric: TrafficMetricKey) => void;
  isLoading: boolean;
  hasError: boolean;
}

jest.mock('../../src/components/TrafficChart', () => ({
  __esModule: true,
  default: ({
    title,
    data,
    metric,
    onMetricChange,
    isLoading,
    hasError,
  }: MockTrafficChartProps) => {
    const chartKey = title.startsWith('Country') ? 'country' : 'vehicle';
    const state = isLoading ? 'loading' : hasError ? 'error' : 'ready';

    return (
      <section>
        <span data-testid={`${chartKey}-state`}>{state}</span>
        <span data-testid={`${chartKey}-metric`}>{metric}</span>
        <span data-testid={`${chartKey}-data`}>{JSON.stringify(data)}</span>
        <button
          type="button"
          onClick={() => {
            onMetricChange('averageSpeedKph');
          }}
        >
          Change {chartKey} metric
        </button>
      </section>
    );
  },
}));

const countryMetrics: CountryTrafficMetrics[] = [
  {
    countryKey: 'US',
    countryName: 'United States',
    vehicleCount: 30,
    totalTravelDistanceKms: 750,
    totalTravelTimeHours: 15,
  },
];

const vehicleMetrics: VehicleTrafficMetrics[] = [
  {
    vehicleKey: 'car',
    vehicleName: 'car',
    vehicleCount: 20,
    totalTravelDistanceKms: 500,
    totalTravelTimeHours: 10,
  },
];

describe('dashboard metrics page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(getCountryTrafficMetrics).mockResolvedValue(countryMetrics);
    jest.mocked(getVehicleTrafficMetrics).mockResolvedValue(vehicleMetrics);
  });

  it('loads and displays country and vehicle metrics', async () => {
    const currentDate = new Date();

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('country-state')).toHaveTextContent('ready');
      expect(screen.getByTestId('vehicle-state')).toHaveTextContent('ready');
    });

    expect(getCountryTrafficMetrics).toHaveBeenCalledWith(
      {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
      expect.any(AbortSignal),
    );
    expect(getVehicleTrafficMetrics).toHaveBeenCalledWith(
      {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      },
      expect.any(AbortSignal),
    );
    expect(screen.getByTestId('country-data')).toHaveTextContent(
      JSON.stringify(countryMetrics),
    );
    expect(screen.getByTestId('vehicle-data')).toHaveTextContent(
      JSON.stringify(vehicleMetrics),
    );
  });

  it('shows error when metric requests fail', async () => {
    jest
      .mocked(getCountryTrafficMetrics)
      .mockRejectedValue(new Error('country failed'));
    jest
      .mocked(getVehicleTrafficMetrics)
      .mockRejectedValue(new Error('vehicle failed'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('country-state')).toHaveTextContent('error');
      expect(screen.getByTestId('vehicle-state')).toHaveTextContent('error');
    });
    expect(screen.getByTestId('country-data')).toHaveTextContent('[]');
    expect(screen.getByTestId('vehicle-data')).toHaveTextContent('[]');
  });

  it('reloads both metrics when the reporting month changes', async () => {
    const user = userEvent.setup();
    const currentDate = new Date();
    const newMonth = currentDate.getMonth() === 0 ? 2 : 1;

    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByTestId('country-state')).toHaveTextContent('ready');
    });

    const [monthSelect] = screen.getAllByRole('combobox');
    await user.selectOptions(monthSelect, String(newMonth));

    await waitFor(() => {
      expect(getCountryTrafficMetrics).toHaveBeenCalledWith(
        { year: currentDate.getFullYear(), month: newMonth },
        expect.any(AbortSignal),
      );
      expect(getVehicleTrafficMetrics).toHaveBeenCalledWith(
        { year: currentDate.getFullYear(), month: newMonth },
        expect.any(AbortSignal),
      );
    });
  });

  it('keeps separate selected metrics for the two charts', async () => {
    const user = userEvent.setup();

    render(<DashboardPage />);

    expect(screen.getByTestId('country-metric')).toHaveTextContent(
      'vehicleCount',
    );
    expect(screen.getByTestId('vehicle-metric')).toHaveTextContent(
      'totalTravelDistanceKms',
    );

    await user.click(
      screen.getByRole('button', { name: 'Change country metric' }),
    );

    expect(screen.getByTestId('country-metric')).toHaveTextContent(
      'averageSpeedKph',
    );
    expect(screen.getByTestId('vehicle-metric')).toHaveTextContent(
      'totalTravelDistanceKms',
    );

    await user.click(
      screen.getByRole('button', { name: 'Change vehicle metric' }),
    );

    expect(screen.getByTestId('vehicle-metric')).toHaveTextContent(
      'averageSpeedKph',
    );
  });

  it('aborts in-flight metric requests when it unmounts', async () => {
    const { unmount } = render(<DashboardPage />);

    await waitFor(() => {
      expect(getCountryTrafficMetrics).toHaveBeenCalledTimes(1);
      expect(getVehicleTrafficMetrics).toHaveBeenCalledTimes(1);
    });

    const countrySignal = jest.mocked(getCountryTrafficMetrics).mock
      .calls[0][1];
    const vehicleSignal = jest.mocked(getVehicleTrafficMetrics).mock
      .calls[0][1];
    unmount();

    expect(countrySignal.aborted).toBe(true);
    expect(vehicleSignal.aborted).toBe(true);
  });
});
