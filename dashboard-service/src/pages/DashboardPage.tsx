import { useEffect, useState } from 'react';
import DashboardFilters from '../components/DashboardFilters';
import TrafficChart from '../components/TrafficChart';
import {
  getCountryTrafficMetrics,
  getVehicleTrafficMetrics,
} from '../api/traffic-service';
import {
  CountryTrafficMetrics,
  VehicleTrafficMetrics,
} from '../api/traffic-service/interface';
import { TrafficMetricKey } from '../constants';

interface TrafficFilters {
  year: number;
  month: number;
}

const today = new Date();
const initialFilters: TrafficFilters = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
};

const DashboardPage = () => {
  const [month, setMonth] = useState(initialFilters.month);
  const [year, setYear] = useState(initialFilters.year);
  const [countryMetric, setCountryMetric] =
    useState<TrafficMetricKey>('vehicleCount');
  const [vehicleMetric, setVehicleMetric] = useState<TrafficMetricKey>(
    'totalTravelDistanceKms',
  );

  const [isCountryLoading, setIsCountryLoading] = useState(true);
  const [isVehicleLoading, setIsVehicleLoading] = useState(true);

  const [countryData, setCountryData] = useState<CountryTrafficMetrics[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleTrafficMetrics[]>([]);
  const [hasCountryError, setHasCountryError] = useState(false);
  const [hasVehicleError, setHasVehicleError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadCountryData = async () => {
      setIsCountryLoading(true);
      setHasCountryError(false);

      try {
        const countryResult = await getCountryTrafficMetrics(
          { month, year },
          controller.signal,
        );
        setCountryData(countryResult);
      } catch {
        if (controller.signal.aborted) return;
        setCountryData([]);
        setHasCountryError(true);
      } finally {
        if (!controller.signal.aborted) setIsCountryLoading(false);
      }
    };

    const loadVehicleData = async () => {
      setIsVehicleLoading(true);
      setHasVehicleError(false);

      try {
        const vehicleResult = await getVehicleTrafficMetrics(
          { month, year },
          controller.signal,
        );
        setVehicleData(vehicleResult);
      } catch {
        if (controller.signal.aborted) return;
        setVehicleData([]);
        setHasVehicleError(true);
      } finally {
        if (!controller.signal.aborted) setIsVehicleLoading(false);
      }
    };

    void loadCountryData();
    void loadVehicleData();
    return () => {
      controller.abort();
    };
  }, [month, year]);

  return (
    <main>
      <DashboardFilters
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      <div className="charts-grid">
        <TrafficChart
          title="Country metrics"
          data={countryData}
          categoryKey="countryName"
          metric={countryMetric}
          onMetricChange={setCountryMetric}
          isLoading={isCountryLoading}
          hasError={hasCountryError}
        />
        <TrafficChart
          title="Vehicle metrics"
          data={vehicleData}
          categoryKey="vehicleName"
          metric={vehicleMetric}
          onMetricChange={setVehicleMetric}
          isLoading={isVehicleLoading}
          hasError={hasVehicleError}
        />
      </div>
    </main>
  );
};

export default DashboardPage;
