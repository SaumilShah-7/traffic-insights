import { DependencyConfig, DependencyName, DependencyType } from './interface';

const getDependencyConfig = (): DependencyConfig => ({
  [DependencyName.TRAFFIC_POSTGRESQL]: {
    type: DependencyType.DB_POSTGRESQL,
    uri: process.env.POSTGRESQL_URI ?? 'postgresql://localhost:5432',
    database: 'traffic_db',
    connectionTimeoutMs: 5_000,
    queryTimeoutMs: 5_000,
    maxConnections: 10,
    idleTimeoutMs: 10_000,
  },
});

export { getDependencyConfig };
