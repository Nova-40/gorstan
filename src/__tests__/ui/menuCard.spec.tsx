import { render, fireEvent } from '@testing-library/react';
import MenuCard from '../../components/ui/MenuCard';
import React from 'react';
import { vi } from 'vitest';

test('MenuCard activates on click and Enter/Space', () => {
  const mock = vi.fn();
  const { getByRole } = render(<MenuCard title="Test" onActivate={mock}><div>Inner</div></MenuCard>);
  const card = getByRole('group');

  // Click
  fireEvent.click(card);
  expect(mock).toHaveBeenCalledTimes(1);

  // Enter key
  fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
  expect(mock).toHaveBeenCalledTimes(2);

  // Space key
  fireEvent.keyDown(card, { key: ' ', code: 'Space' });
  expect(mock).toHaveBeenCalledTimes(3);
});
