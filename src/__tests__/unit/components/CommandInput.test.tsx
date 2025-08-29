import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommandInput from '../../../components/CommandInput';

describe('CommandInput Component', () => {
	test('submits entered command text', async () => {
		const onSubmit = vi.fn();
		render(<CommandInput onCommand={onSubmit} playerName="Tester" />);
		const input = screen.getByRole('textbox');
		await userEvent.type(input, 'look{enter}');
		expect(onSubmit).toHaveBeenCalled();
		expect(onSubmit.mock.calls[0]?.[0]).toMatch(/look/i);
	});
});
