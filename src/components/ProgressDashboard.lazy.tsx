import React from 'react';
import { lazyFeature } from '../utils/lazyLoading';

// Export a small wrapper that loads the real dashboard lazily. This keeps
// modules that import the dashboard (like PlayerStatsPanel) lightweight.
const ProgressDashboardInner = lazyFeature(() => import('./ProgressDashboard'));

export const ProgressDashboard = (props: any) => (
  <React.Suspense fallback={null}>
    <ProgressDashboardInner {...props} />
  </React.Suspense>
);

export default ProgressDashboard;
