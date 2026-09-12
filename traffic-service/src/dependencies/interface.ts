import { NodePgDatabase } from "drizzle-orm/node-postgres";

enum DependencyType {
  DB_POSTGRESQL = "db_postgresql",
}

enum DependencyName {
  TRAFFIC_POSTGRESQL = "traffic-postgresql",
}

interface PostgresDependencyConfig {
  type: DependencyType.DB_POSTGRESQL;
  uri: string;
  database: string;
  connectionTimeoutMs: number;
  queryTimeoutMs: number;
  maxConnections: number;
  idleTimeoutMs: number;
}

interface PostgresDependencyClient {
  type: DependencyType.DB_POSTGRESQL;
  database: NodePgDatabase;
  close: () => Promise<void>;
}

type DependencyConfigItem = PostgresDependencyConfig;
type DependencyConfig = Record<DependencyName, DependencyConfigItem>;

type DependencyClient = PostgresDependencyClient;
type Dependencies = Map<DependencyName, DependencyClient>;

export {
  Dependencies,
  DependencyClient,
  DependencyConfig,
  DependencyConfigItem,
  PostgresDependencyConfig,
  PostgresDependencyClient,
  DependencyName,
  DependencyType,
};
