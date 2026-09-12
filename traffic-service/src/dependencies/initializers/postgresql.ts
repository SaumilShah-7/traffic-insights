import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  DependencyType,
  PostgresDependencyClient,
  PostgresDependencyConfig,
} from "../interface";

const initializePostgresDependency = async (
  config: PostgresDependencyConfig,
): Promise<PostgresDependencyClient> => {
  const username = process.env.POSTGRESQL_USERNAME;
  const password = process.env.POSTGRESQL_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "POSTGRESQL_USERNAME and POSTGRESQL_PASSWORD environment variables are required",
    );
  }

  const connectionUrl = new URL(config.uri);
  connectionUrl.username = username;
  connectionUrl.password = password;
  connectionUrl.pathname = `/${encodeURIComponent(config.database)}`;

  const pool = new Pool({
    connectionString: connectionUrl.toString(),
    connectionTimeoutMillis: config.connectionTimeoutMs,
    query_timeout: config.queryTimeoutMs,
    max: config.maxConnections,
    idleTimeoutMillis: config.idleTimeoutMs,
  });

  pool.on("error", (error: Error) => {
    console.error("Unexpected PostgreSQL idle connection error", error);
  });

  try {
    await pool.query("SELECT 1");
  } catch (error) {
    await pool.end();
    throw error;
  }

  return {
    type: DependencyType.DB_POSTGRESQL,
    database: drizzle(pool),
    close: async (): Promise<void> => pool.end(),
  };
};

export { initializePostgresDependency };
