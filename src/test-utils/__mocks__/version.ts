// Mock for version.ts to handle import.meta issues
export const getVersionString = jest.fn().mockReturnValue('1.0.0-test');
export const COMMIT_HASH = 'test-hash';
export const BUILD_TIME = new Date().toISOString();
