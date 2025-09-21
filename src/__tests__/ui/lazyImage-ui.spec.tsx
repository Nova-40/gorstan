import { render, waitFor } from '@testing-library/react';
import React from 'react';
import LazyImage from '../../components/ui/LazyImage';

// Mock the hook used by LazyImage to simulate an error fallback
vi.mock('../../utils/assetOptimization', () => ({
  useLazyImage: (src: string) => ({ image: null, isLoading: false, error: 'not found' }),
}));

test('LazyImage shows fallback on error', async () => {
  const { getByAltText } = render(<LazyImage src="/images/rooms/does-not-exist.png" alt="test" fallback="/images/rooms/placeholder-room.png" />);
  await waitFor(() => {
    const img = getByAltText('test') as HTMLImageElement;
    expect(img.getAttribute('src')).toContain('placeholder-room.png');
  });
});
