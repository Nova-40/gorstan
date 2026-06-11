import type { Room } from '../types/Room';
import type {
  WalkthroughContext,
  WalkthroughLogEntry,
  WalkthroughReport,
  WalkthroughScript,
  WalkthroughStep,
  WalkthroughSummary,
} from './types';

const PREFERRED_EXITS = ['west', 'east', 'north', 'south', 'up', 'down', 'sit', 'jump'] as const;

function getAvailableExits(room?: Room): string[] {
  return Object.keys(room?.exits || {});
}

function pickPrimaryExit(exits: string[]): string | null {
  for (const preferredExit of PREFERRED_EXITS) {
    if (exits.includes(preferredExit)) {
      return preferredExit;
    }
  }

  return exits[0] || null;
}

function findReturnCommand(
  roomMap: Record<string, Room>,
  originRoomId: string,
  targetRoomId: string,
): string | null {
  const targetRoom = roomMap[targetRoomId];
  const targetExits = Object.entries(targetRoom?.exits || {});
  const returnExit = targetExits.find(([, roomId]) => roomId === originRoomId);

  return returnExit ? `go ${returnExit[0]}` : null;
}

function createMovementStep(
  stepId: string,
  label: string,
  command: string,
  expectedRoom: string,
  notePrompt: string,
  stopOnFailure = true,
): WalkthroughStep {
  return {
    id: stepId,
    label,
    command,
    expectedRoom,
    notePrompt,
    stopOnFailure,
  };
}

export function buildBaselineStartupWalkthrough({
  currentRoomId,
  roomMap,
}: WalkthroughContext): WalkthroughScript {
  const currentRoom = roomMap[currentRoomId];
  const roomTitle = currentRoom?.title || currentRoomId;
  const exits = getAvailableExits(currentRoom);
  const primaryExit = pickPrimaryExit(exits);
  const targetRoomId = primaryExit ? currentRoom?.exits?.[primaryExit] : undefined;
  const returnCommand =
    targetRoomId && roomMap[targetRoomId]
      ? findReturnCommand(roomMap, currentRoomId, targetRoomId)
      : null;

  const steps: WalkthroughStep[] = [
    {
      id: 'startup-status',
      label: 'Check parser status output',
      command: 'status',
      expectedRoom: currentRoomId,
      expectedText: [`Current Room: ${currentRoomId}`, 'Available Exits:'],
      notePrompt: 'Does the first playable room identify itself clearly in the terminal?',
      stopOnFailure: true,
    },
    {
      id: 'startup-inspect',
      label: 'Inspect the current room through the parser',
      command: 'inspect',
      expectedRoom: currentRoomId,
      expectedText: roomTitle,
      notePrompt: 'Does the room description explain the scene, exits, and tone clearly enough?',
      stopOnFailure: true,
    },
    {
      id: 'startup-help',
      label: 'Print the Beta 5 field briefing',
      command: 'help',
      expectedText: 'Gorstan Beta 5 Field Briefing',
      notePrompt:
        'Does the parser-first help text explain typing, clicking, exits, and save/load cleanly?',
      stopOnFailure: true,
    },
    {
      id: 'startup-items',
      label: 'Check carried items through the parser',
      command: 'items',
      notePrompt: 'Does inventory output make immediate sense from a cold start?',
      stopOnFailure: false,
    },
  ];

  if (primaryExit && targetRoomId) {
    steps.push(
      createMovementStep(
        'startup-move-primary',
        `Move through the ${primaryExit} exit`,
        `go ${primaryExit}`,
        targetRoomId,
        'Did the movement feel readable, and do the room art and terminal output agree about where you went?',
      ),
    );

    steps.push({
      id: 'startup-status-after-move',
      label: 'Check status after movement',
      command: 'status',
      expectedRoom: targetRoomId,
      expectedText: `Current Room: ${targetRoomId}`,
      notePrompt: 'Do the current room id, title, and visible exits still feel coherent after movement?',
      stopOnFailure: true,
    });

    if (returnCommand) {
      steps.push(
        createMovementStep(
          'startup-return',
          'Return to the starting room',
          returnCommand,
          currentRoomId,
          'Does the return path behave like the visible exit controls suggest?',
        ),
      );
    }
  }

  return {
    id: 'baseline-startup',
    title: 'Baseline Startup Walkthrough',
    description:
      'A parser-first audit route from the first playable room, paced for manual observation and note-taking.',
    defaultDelayMs: 1500,
    steps,
  };
}

export const walkthroughScriptLibrary = [
  {
    id: 'baseline-startup',
    title: 'Baseline Startup Walkthrough',
    description:
      'A parser-first audit route from the first playable room, paced for manual observation and note-taking.',
    build: buildBaselineStartupWalkthrough,
  },
] as const;

export function getWalkthroughScript(
  scriptId: string,
  context: WalkthroughContext,
): WalkthroughScript {
  const definition =
    walkthroughScriptLibrary.find((entry) => entry.id === scriptId) || walkthroughScriptLibrary[0];

  return definition.build(context);
}

export function buildWalkthroughSummary(
  entries: WalkthroughLogEntry[],
  steps: WalkthroughStep[],
): WalkthroughSummary {
  const roomsVisited = Array.from(
    new Set(entries.flatMap((entry) => [entry.roomBefore, entry.roomAfter]).filter(Boolean)),
  );
  const warnings = entries.flatMap((entry) =>
    entry.warnings.map((warning) => `${entry.stepNumber}. ${entry.label}: ${warning}`),
  );
  const suggestedAreasForManualReview = Array.from(
    new Set(
      entries
        .filter((entry) => entry.outcome !== 'pass' || entry.notePrompt)
        .map(
          (entry) =>
            entry.notePrompt ||
            `${entry.label}: compare room text, response output, and visible affordances.`,
        ),
    ),
  );

  return {
    totalSteps: steps.length,
    passedSteps: entries.filter((entry) => entry.outcome === 'pass').length,
    warningSteps: entries.filter((entry) => entry.outcome === 'warning').length,
    failedSteps: entries.filter((entry) => entry.outcome === 'fail').length,
    roomsVisited,
    commandsRun: entries.map((entry) => entry.command),
    warnings,
    suggestedAreasForManualReview,
  };
}

export function formatWalkthroughReport(report: WalkthroughReport): string {
  const lines: string[] = [
    `# ${report.script.title}`,
    '',
    report.script.description,
    '',
    `Status: ${report.status}`,
    `Total steps: ${report.summary.totalSteps}`,
    `Passed: ${report.summary.passedSteps}`,
    `Warnings: ${report.summary.warningSteps}`,
    `Failed: ${report.summary.failedSteps}`,
    `Rooms visited: ${report.summary.roomsVisited.join(', ') || 'None recorded'}`,
    '',
    '## Steps',
  ];

  report.entries.forEach((entry) => {
    lines.push(
      `- [${entry.outcome.toUpperCase()}] ${entry.stepNumber}. ${entry.label}`,
      `  Command: \`${entry.command}\``,
      `  Room: \`${entry.roomBefore}\` -> \`${entry.roomAfter}\``,
      `  Output: ${entry.outputSummary || 'No visible output captured.'}`,
    );

    if (entry.warnings.length > 0) {
      lines.push(`  Warnings: ${entry.warnings.join(' | ')}`);
    }
    if (entry.notePrompt) {
      lines.push(`  Note prompt: ${entry.notePrompt}`);
    }
  });

  if (report.summary.suggestedAreasForManualReview.length > 0) {
    lines.push('', '## Suggested Manual Review');
    report.summary.suggestedAreasForManualReview.forEach((note) => lines.push(`- ${note}`));
  }

  return lines.join('\n');
}
