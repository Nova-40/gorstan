interface LoaderMetrics {
  totalLoads: number;
  fallbacksUsed: number;
  validationFailures: number;
}

const metrics: LoaderMetrics = {
  totalLoads: 0,
  fallbacksUsed: 0,
  validationFailures: 0,
};

export function incrementTotalLoads() {
  metrics.totalLoads++;
}

export function incrementFallbacks() {
  metrics.fallbacksUsed++;
}

export function incrementValidationFailures() {
  metrics.validationFailures++;
}

export function getLoaderMetrics() {
  return { ...metrics };
}

export default {
  incrementTotalLoads,
  incrementFallbacks,
  incrementValidationFailures,
  getLoaderMetrics,
};
