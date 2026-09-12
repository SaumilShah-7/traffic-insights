import { getDependencyConfig } from "./config";
import { initializePostgresDependency } from "./initializers/postgresql";
import {
  Dependencies,
  DependencyClient,
  DependencyConfigItem,
  DependencyName,
  DependencyType,
} from "./interface";

let dependencies: Dependencies | undefined;

const initializeDependency = async (
  config: DependencyConfigItem,
): Promise<DependencyClient> => {
  switch (config.type) {
    case DependencyType.DB_POSTGRESQL:
      return await initializePostgresDependency(config);
  }
};

const initializeDependencies = async (): Promise<void> => {
  if (dependencies !== undefined) {
    return;
  }

  const entries = Object.entries(getDependencyConfig());
  dependencies = new Map<DependencyName, DependencyClient>();

  for (const [name, config] of entries) {
    dependencies.set(
      name as DependencyName,
      await initializeDependency(config),
    );
  }
};

const closeDependencies = async (): Promise<void> => {
  if (dependencies === undefined) {
    return;
  }
  await Promise.all(
    [...dependencies.values()].map((dependency) => dependency.close()),
  );
  dependencies = undefined;
};

const getDependency = (name: DependencyName): DependencyClient => {
  if (dependencies === undefined) {
    throw new Error("Dependencies have not been initialized");
  }
  const dependency = dependencies.get(name);
  if (dependency === undefined) {
    throw new Error(`Dependency ${name} is not configured`);
  }
  return dependency;
};

export { initializeDependencies, closeDependencies, getDependency };
