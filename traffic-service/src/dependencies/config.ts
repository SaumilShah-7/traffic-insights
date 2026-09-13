import { DependencyConfig, DependencyName, DependencyType } from './interface';

const getDependencyConfig = (): DependencyConfig => ({
  [DependencyName.TRAFFIC_POSTGRESQL]: {
    type: DependencyType.DB_POSTGRESQL,
    uri: 'postgresql://LK62HhztCvANPrYuKOdM6MVKmcxYrgwd@dpg-dajc2keq1p3s73ear7n0-a.singapore-postgres.render.com/traffic_db_0auo?sslmode=require',
    database: 'traffic_db_0auo',
    connectionTimeoutMs: 5_000,
    queryTimeoutMs: 5_000,
    maxConnections: 10,
    idleTimeoutMs: 10_000,
  },
});

export { getDependencyConfig };
