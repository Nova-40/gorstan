/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  Version tracking for deployment verification
*/

export const BUILD_VERSION = '3.8.8';
export const BUILD_NUMBER = '38';
export const BUILD_DATE = '2025-08-20';
export const BUILD_TIMESTAMP = '2025-08-20T16:00:00.000Z';
export const COMMIT_HASH = import.meta.env.VITE_NETLIFY_DEPLOY_ID?.slice(0, 7) || 'dev';

export const getVersionString = () => `build: ${BUILD_VERSION} | ${BUILD_DATE} | ${COMMIT_HASH}`;
export const getShortVersion = () => `${BUILD_VERSION}`;
