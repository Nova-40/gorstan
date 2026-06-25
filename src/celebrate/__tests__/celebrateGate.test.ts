/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

import { describe, expect, it } from 'vitest';
import { getActiveCelebrations, getCelebrationById, isDateInSpan, toLocalDateKey } from '../celebrateGate';

function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

describe('celebration calendar gate', () => {
  it('formats dates using the local calendar day', () => {
    expect(toLocalDateKey(localDate(2026, 6, 21))).toBe('2026-06-21');
  });

  it('matches inclusive single-day spans', () => {
    expect(
      isDateInSpan(localDate(2026, 12, 25), {
        id: 'christmas-test',
        start: '2026-12-25',
        end: '2026-12-25',
        label: 'Christmas 2026',
      }),
    ).toBe(true);
  });

  it('matches inclusive multi-day spans', () => {
    const easterSpan = {
      id: '2026-04-03_2026-04-06_easter_2026',
      start: '2026-04-03',
      end: '2026-04-06',
      label: 'Easter 2026',
    };

    expect(isDateInSpan(localDate(2026, 4, 3), easterSpan)).toBe(true);
    expect(isDateInSpan(localDate(2026, 4, 6), easterSpan)).toBe(true);
    expect(isDateInSpan(localDate(2026, 4, 7), easterSpan)).toBe(false);
  });

  it('finds Christmas 2026 from christian.json', async () => {
    const celebrations = await getActiveCelebrations(localDate(2026, 12, 25));

    expect(celebrations.map((celebration) => celebration.id)).toContain('2026-12-25_christmas_2026');
  });

  it('finds Easter 2026 across the christian.json date range', async () => {
    const goodFriday = await getActiveCelebrations(localDate(2026, 4, 3));
    const easterMonday = await getActiveCelebrations(localDate(2026, 4, 6));
    const afterEaster = await getActiveCelebrations(localDate(2026, 4, 7));

    expect(goodFriday.map((celebration) => celebration.id)).toContain(
      '2026-04-03_2026-04-06_easter_2026',
    );
    expect(easterMonday.map((celebration) => celebration.id)).toContain(
      '2026-04-03_2026-04-06_easter_2026',
    );
    expect(afterEaster.map((celebration) => celebration.id)).not.toContain(
      '2026-04-03_2026-04-06_easter_2026',
    );
  });

  it('finds Lunar New Year 2026 from chinese.json', async () => {
    const celebrations = await getActiveCelebrations(localDate(2026, 2, 18));

    expect(celebrations.map((celebration) => celebration.id)).toContain(
      '2026-02-17_2026-02-19_lunar_new_year_2026',
    );
  });

  it('finds Summer Solstice 2026 from seasonal.json', async () => {
    const celebrations = await getActiveCelebrations(localDate(2026, 6, 21));

    expect(celebrations.map((celebration) => celebration.id)).toContain(
      '2026-06-21_summer_solstice_2026',
    );
  });

  it('returns no active celebrations on an ordinary date', async () => {
    const celebrations = await getActiveCelebrations(localDate(2026, 8, 11));

    expect(celebrations).toEqual([]);
  });

  it('supports multiple active celebrations on the same date', async () => {
    const celebrations = await getActiveCelebrations(localDate(2026, 3, 20));
    const ids = celebrations.map((celebration) => celebration.id);

    expect(ids).toContain('2026-03-20_spring_equinox_2026');
    expect(ids).toContain('2026-03-20_naw-rúz_2026');
  });

  it('looks up a specific celebration by id', async () => {
    const christmas = await getCelebrationById('2026-12-25_christmas_2026');

    expect(christmas?.label).toBe('Christmas 2026');
  });
});
