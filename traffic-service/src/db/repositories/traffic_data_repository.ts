import { and, eq, sum } from 'drizzle-orm';
import { getDependency } from '../../dependencies';
import { DependencyName } from '../../dependencies/interface';
import { COUNTRY_CODE_TO_NAME } from '../../constants';
import { trafficData } from '../models/traffic_data';
import {
  CountryWiseTrafficMetrics,
  TrafficDataDocument,
  VehicleWiseTrafficMetrics,
} from './interface';

// keeps first value in case of multiple rows for same country x vehicle type x date
const deduplicateTrafficData = (
  dataPoints: Omit<TrafficDataDocument, 'year' | 'month'>[],
): TrafficDataDocument[] => {
  const uniqueDataPoints = new Map<string, TrafficDataDocument>();

  for (const point of dataPoints) {
    const key = JSON.stringify([point.countryCode, point.vehicleType, point.date]);
    if (!uniqueDataPoints.has(key)) {
      const [year, month] = point.date.split('-').map(Number);
      uniqueDataPoints.set(key, { ...point, year, month });
    }
  }

  return [...uniqueDataPoints.values()];
};

const insertTrafficData = async (
  dataPoints: Omit<TrafficDataDocument, 'year' | 'month'>[],
): Promise<void> => {
  if (dataPoints.length === 0) {
    return;
  }

  const { database } = getDependency(DependencyName.TRAFFIC_POSTGRESQL);
  await database
    .insert(trafficData)
    .values(deduplicateTrafficData(dataPoints))
    .onConflictDoNothing({
      target: [trafficData.countryCode, trafficData.vehicleType, trafficData.date],
    });
};

const getCountryWiseTrafficMetrics = async (
  year: number,
  month?: number,
): Promise<CountryWiseTrafficMetrics> => {
  const { database } = getDependency(DependencyName.TRAFFIC_POSTGRESQL);
  const filters = [eq(trafficData.year, year)];

  if (month !== undefined) {
    filters.push(eq(trafficData.month, month));
  }

  const rows = await database
    .select({
      countryCode: trafficData.countryCode,
      vehicleCount: sum(trafficData.vehicleCount).mapWith(Number),
      totalTravelDistanceKms: sum(trafficData.totalTravelDistanceKms).mapWith(Number),
      totalTravelTimeHours: sum(trafficData.totalTravelTimeHours).mapWith(Number),
    })
    .from(trafficData)
    .where(and(...filters))
    .groupBy(trafficData.countryCode);

  return Object.fromEntries(
    rows.map(({ countryCode, ...metrics }) => [
      countryCode,
      { countryName: COUNTRY_CODE_TO_NAME[countryCode], ...metrics },
    ]),
  );
};

const getVehicleWiseTrafficMetrics = async (
  year: number,
  month?: number,
): Promise<VehicleWiseTrafficMetrics> => {
  const { database } = getDependency(DependencyName.TRAFFIC_POSTGRESQL);
  const filters = [eq(trafficData.year, year)];

  if (month !== undefined) {
    filters.push(eq(trafficData.month, month));
  }

  const rows = await database
    .select({
      vehicleType: trafficData.vehicleType,
      vehicleCount: sum(trafficData.vehicleCount).mapWith(Number),
      totalTravelDistanceKms: sum(trafficData.totalTravelDistanceKms).mapWith(Number),
      totalTravelTimeHours: sum(trafficData.totalTravelTimeHours).mapWith(Number),
    })
    .from(trafficData)
    .where(and(...filters))
    .groupBy(trafficData.vehicleType);

  return Object.fromEntries(
    rows.map(({ vehicleType, ...metrics }) => [
      vehicleType,
      { vehicleName: vehicleType, ...metrics },
    ]),
  );
};

export { getCountryWiseTrafficMetrics, getVehicleWiseTrafficMetrics, insertTrafficData };
