import {
  attemptDisarmTrap,
  detectTrap,
  getTrapForRoom,
  resolveTrapOnEntry,
  searchTraps,
} from '../canonicalTrapEngine';

const buildRoom = (trap: any) =>
  ({
    id: 'bureaucraticcorridor',
    title: 'Bureaucratic Corridor',
    description: 'A corridor with excessive signage.',
    traps: Array.isArray(trap) ? trap : [trap],
  }) as any;

const buildState = (flags: Record<string, any> = {}, inventory: string[] = [], traits: string[] = []) =>
  ({
    currentRoomId: 'bureaucraticcorridor',
    flags,
    gameFlags: flags,
    player: {
      inventory,
      traits,
      health: 100,
    },
  }) as any;

describe('canonical trap adapter', () => {
  it('reports no trap when the room has no trap metadata', () => {
    const room = { id: 'plainroom', title: 'Plain Room', description: 'Nothing much.' } as any;
    const result = searchTraps(room, buildState());

    expect(result.detected).toBe(false);
    expect(result.messages[0].text).toContain('no traps');
  });

  it('selects the highest severity unresolved trap in the room', () => {
    const room = buildRoom([
      { id: 'mild_notice', severity: 'light', type: 'narrative', description: 'A mild notice.' },
      { id: 'serious_form', severity: 'severe', type: 'narrative', description: 'A serious form.' },
    ]);

    expect(getTrapForRoom(room, buildState())?.id).toBe('serious_form');
  });

  it('detects visible traps on entry', () => {
    const room = buildRoom({
      id: 'form_g17b',
      severity: 'moderate',
      type: 'narrative',
      description: 'Form G-17B has not been completed.',
    });

    const result = detectTrap(room, buildState());

    expect(result.detected).toBe(true);
    expect(result.messages[0].text).toContain('Form G-17B');
  });

  it('does not detect hidden traps on entry without a detection aid', () => {
    const room = buildRoom({
      id: 'hidden_consultation',
      severity: 'moderate',
      type: 'narrative',
      hidden: true,
      description: 'A mandatory consultation period lurks behind the skirting board.',
    });

    const result = detectTrap(room, buildState());

    expect(result.detected).toBe(false);
    expect(result.messages).toHaveLength(0);
  });

  it('finds hidden traps through active search', () => {
    const room = buildRoom({
      id: 'hidden_consultation',
      severity: 'moderate',
      type: 'narrative',
      hidden: true,
      description: 'A mandatory consultation period lurks behind the skirting board.',
    });

    const result = searchTraps(room, buildState());

    expect(result.detected).toBe(true);
    expect(result.messages[0].text).toContain('mandatory consultation');
  });

  it('disarms a disarmable trap and records a persistent flag update', () => {
    const room = buildRoom({
      id: 'risk_register',
      severity: 'moderate',
      type: 'narrative',
      description: 'A risk register has become sentient.',
      disarmable: true,
      flagOnDisarm: 'risk_register_pacified',
    });

    const result = attemptDisarmTrap(room, buildState());

    expect(result.disarmed).toBe(true);
    expect(result.updates?.flags?.trap_disarmed_risk_register).toBe(true);
    expect(result.updates?.flags?.risk_register_pacified).toBe(true);
  });

  it('fails cleanly when a trap is not disarmable', () => {
    const room = buildRoom({
      id: 'procurement_exemption',
      severity: 'severe',
      type: 'narrative',
      description: 'A procurement exemption has expired.',
      disarmable: false,
    });

    const result = attemptDisarmTrap(room, buildState());

    expect(result.disarmed).toBe(false);
    expect(result.messages[0].text).toContain('cannot be disarmed');
  });

  it('suppresses entry behaviour when debug traps are disabled', () => {
    const room = buildRoom({
      id: 'ceiling_tile',
      severity: 'severe',
      type: 'mechanical',
      triggerOnEnter: true,
      description: 'A compliance-approved ceiling tile looks worried.',
    });

    const result = resolveTrapOnEntry(room, buildState({ debug_traps_disabled: true }));

    expect(result.suppressedByDebug).toBe(true);
    expect(result.messages[0].text).toContain('Trap suppressed');
  });

  it('warnings-only debug mode reports the trap without resolving it', () => {
    const room = buildRoom({
      id: 'workshop',
      severity: 'light',
      type: 'narrative',
      triggerOnEnter: true,
      hidden: true,
      description: 'A lessons-learned workshop starts booking a room.',
    });

    const result = resolveTrapOnEntry(room, buildState({ debug_trap_warnings_only: true }));

    expect(result.detected).toBe(true);
    expect(result.disarmed).toBe(false);
    expect(result.messages[0].text).toContain('lessons-learned');
  });
});
