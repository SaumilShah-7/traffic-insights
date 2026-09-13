import { and, gte, lt, sum } from 'drizzle-orm';
import { addMonths, format } from 'date-fns';
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
const deduplicateTrafficData = (dataPoints: TrafficDataDocument[]): TrafficDataDocument[] => {
  const uniqueDataPoints = new Map<string, TrafficDataDocument>();

  for (const point of dataPoints) {
    const key = JSON.stringify([point.countryCode, point.vehicleType, point.date]);
    if (!uniqueDataPoints.has(key)) {
      uniqueDataPoints.set(key, point);
    }
  }

  return [...uniqueDataPoints.values()];
};

const insertTrafficData = async (dataPoints: TrafficDataDocument[]): Promise<void> => {
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

const getMonthDateRange = (
  year: number,
  month: number,
): { monthStartDate: string; nextMonthStartDate: string } => {
  const start = new Date(year, month - 1, 1);
  const end = addMonths(start, 1);

  return {
    monthStartDate: format(start, 'yyyy-MM-dd'),
    nextMonthStartDate: format(end, 'yyyy-MM-dd'),
  };
};

const getCountryWiseTrafficMetrics = async (
  year: number,
  month: number,
): Promise<CountryWiseTrafficMetrics> => {
  const { database } = getDependency(DependencyName.TRAFFIC_POSTGRESQL);
  const { monthStartDate, nextMonthStartDate } = getMonthDateRange(year, month);

  const rows = await database
    .select({
      countryCode: trafficData.countryCode,
      vehicleCount: sum(trafficData.vehicleCount).mapWith(Number),
      totalTravelDistanceKms: sum(trafficData.totalTravelDistanceKms).mapWith(Number),
      totalTravelTimeHours: sum(trafficData.totalTravelTimeHours).mapWith(Number),
    })
    .from(trafficData)
    .where(and(gte(trafficData.date, monthStartDate), lt(trafficData.date, nextMonthStartDate)))
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
  month: number,
): Promise<VehicleWiseTrafficMetrics> => {
  const { database } = getDependency(DependencyName.TRAFFIC_POSTGRESQL);
  const { monthStartDate, nextMonthStartDate } = getMonthDateRange(year, month);

  const rows = await database
    .select({
      vehicleType: trafficData.vehicleType,
      vehicleCount: sum(trafficData.vehicleCount).mapWith(Number),
      totalTravelDistanceKms: sum(trafficData.totalTravelDistanceKms).mapWith(Number),
      totalTravelTimeHours: sum(trafficData.totalTravelTimeHours).mapWith(Number),
    })
    .from(trafficData)
    .where(and(gte(trafficData.date, monthStartDate), lt(trafficData.date, nextMonthStartDate)))
    .groupBy(trafficData.vehicleType);

  return Object.fromEntries(
    rows.map(({ vehicleType, ...metrics }) => [
      vehicleType,
      { vehicleName: vehicleType, ...metrics },
    ]),
  );
};

export { getCountryWiseTrafficMetrics, getVehicleWiseTrafficMetrics, insertTrafficData };
