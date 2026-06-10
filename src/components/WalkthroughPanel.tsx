import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { GameMessage } from '../types/GameTypes';
import type { Room } from '../types/Room';
import {
  buildWalkthroughSummary,
  formatWalkthroughReport,
  getWalkthroughScript,
  walkthroughScriptLibrary,
} from '../walkthrough/scripts';
import type {
  WalkthroughContext,
  WalkthroughLogEntry,
  WalkthroughReport,
  WalkthroughScript,
  WalkthroughStatus,
} from '../walkthrough/types';

type ActiveStep = {
  historyLengthBefore: number;
  roomBefore: string;
  startedAt: number;
  stepIndex: number;
};

type WalkthroughPanelProps = {
  autoStart?: boolean;
  currentRoomId: string;
  enabled: boolean;
  history: GameMessage[];
  onCommand: (command: string) => void;
  roomMap: Record<string, Room>;
  stage: string;
};

const DEFAULT_DELAY_MS = 1500;
const EVALUATION_SETTLE_MS = 350;

function normaliseText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function summariseMessages(messages: GameMessage[]): string {
  return messages
    .map((message) => message.text.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 6)
    .join(' | ')
    .slice(0, 420);
}

const WalkthroughPanel: React.FC<WalkthroughPanelProps> = ({
  autoStart = false,
  currentRoomId,
  enabled,
  history,
  onCommand,
  roomMap,
  stage,
}) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('baseline-startup');
  const [delayMs, setDelayMs] = useState<number>(DEFAULT_DELAY_MS);
  const [status, setStatus] = useState<WalkthroughStatus>('idle');
  const [entries, setEntries] = useState<WalkthroughLogEntry[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeScript, setActiveScript] = useState<WalkthroughScript | null>(null);
  const [activeStep, setActiveStep] = useState<ActiveStep | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('');

  const autoStartedRef = useRef(false);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evaluationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepOnceRef = useRef(false);

  const walkthroughContext = useMemo<WalkthroughContext>(
    () => ({
      currentRoomId,
      roomMap,
    }),
    [currentRoomId, roomMap],
  );

  const selectedScriptPreview = useMemo(
    () => getWalkthroughScript(selectedScriptId, walkthroughContext),
    [selectedScriptId, walkthroughContext],
  );

  const clearTimers = useCallback(() => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    if (evaluationTimerRef.current) {
      clearTimeout(evaluationTimerRef.current);
      evaluationTimerRef.current = null;
    }
  }, []);

  const buildReport = useCallback(
    (reportStatus: WalkthroughStatus, reportEntries: WalkthroughLogEntry[] = entries): WalkthroughReport | null => {
      if (!activeScript) {
        return null;
      }

      return {
        script: {
          id: activeScript.id,
          title: activeScript.title,
          description: activeScript.description,
        },
        status: reportStatus,
        summary: buildWalkthroughSummary(reportEntries, activeScript.steps),
        entries: reportEntries,
      };
    },
    [activeScript, entries],
  );

  const finishRun = useCallback(
    (finalStatus: WalkthroughStatus, reportEntries?: WalkthroughLogEntry[]) => {
      clearTimers();
      setActiveStep(null);
      setStatus(finalStatus);
      stepOnceRef.current = false;

      const report = buildReport(finalStatus, reportEntries);
      if (report) {
        console.log('[Walkthrough] Report\n' + formatWalkthroughReport(report));
      }
    },
    [buildReport, clearTimers],
  );

  const resetRun = useCallback(
    (script: WalkthroughScript) => {
      clearTimers();
      setActiveScript(script);
      setEntries([]);
      setCurrentStepIndex(0);
      setActiveStep(null);
      setCopyStatus('');
    },
    [clearTimers],
  );

  const startRun = useCallback(
    (stepOnce = false) => {
      if (stage !== 'game') {
        return;
      }

      const script = getWalkthroughScript(selectedScriptId, walkthroughContext);
      resetRun(script);
      stepOnceRef.current = stepOnce;
      setDelayMs((currentDelay) => currentDelay || script.defaultDelayMs || DEFAULT_DELAY_MS);
      setStatus('running');
    },
    [resetRun, selectedScriptId, stage, walkthroughContext],
  );

  const resumeRun = useCallback(
    (stepOnce = false) => {
      if (!activeScript) {
        startRun(stepOnce);
        return;
      }

      stepOnceRef.current = stepOnce;
      setStatus('running');
    },
    [activeScript, startRun],
  );

  const pauseRun = useCallback(() => {
    clearTimers();
    setStatus('paused');
  }, [clearTimers]);

  const stopRun = useCallback(() => {
    finishRun('stopped');
  }, [finishRun]);

  const runSingleStep = useCallback(() => {
    if (status === 'running') {
      return;
    }
    resumeRun(true);
  }, [resumeRun, status]);

  const finaliseActiveStep = useCallback(() => {
    if (!activeScript || !activeStep) {
      return;
    }

    const step = activeScript.steps[activeStep.stepIndex];
    const newMessages = history.slice(activeStep.historyLengthBefore);
    const outputSummary = summariseMessages(newMessages);
    const warnings: string[] = [];

    const outputBlob = normaliseText(newMessages.map((message) => message.text).join('\n'));
    const hasErrorMessage = newMessages.some((message) => message.type === 'error');

    if (step.expectedRoom && currentRoomId !== step.expectedRoom) {
      warnings.push(`Expected room ${step.expectedRoom}, reached ${currentRoomId}.`);
    }

    if (step.expectedText) {
      const expectations = Array.isArray(step.expectedText) ? step.expectedText : [step.expectedText];
      expectations.forEach((expectedText) => {
        if (!outputBlob.includes(normaliseText(expectedText))) {
          warnings.push(`Expected text missing: "${expectedText}".`);
        }
      });
    }

    if (outputBlob.includes(normaliseText("I don't understand that command."))) {
      warnings.push('Parser reported an unknown command.');
    }

    if (hasErrorMessage) {
      warnings.push('Parser returned an error message during this step.');
    }

    const outcome = warnings.length === 0 ? 'pass' : 'fail';

    const entry: WalkthroughLogEntry = {
      stepNumber: activeStep.stepIndex + 1,
      stepId: step.id,
      label: step.label,
      command: step.command,
      roomBefore: activeStep.roomBefore,
      roomAfter: currentRoomId,
      outputSummary,
      outcome,
      warnings,
      timestamp: new Date(activeStep.startedAt).toISOString(),
      notePrompt: step.notePrompt,
    };

    const nextEntries = [...entries, entry];
    setEntries(nextEntries);
    setActiveStep(null);

    const nextIndex = activeStep.stepIndex + 1;
    const shouldPause = stepOnceRef.current || (warnings.length > 0 && step.stopOnFailure);

    if (nextIndex >= activeScript.steps.length) {
      setCurrentStepIndex(nextIndex);
      finishRun('completed', nextEntries);
      return;
    }

    setCurrentStepIndex(nextIndex);

    if (shouldPause) {
      stepOnceRef.current = false;
      setStatus('paused');
      return;
    }

    setStatus('running');
  }, [activeScript, activeStep, currentRoomId, finishRun, history]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    return () => clearTimers();
  }, [clearTimers, enabled]);

  useEffect(() => {
    if (!enabled || !autoStart || autoStartedRef.current || stage !== 'game') {
      return;
    }

    autoStartedRef.current = true;
    startRun(false);
  }, [autoStart, enabled, stage, startRun]);

  useEffect(() => {
    if (!enabled || status !== 'running' || activeStep || !activeScript) {
      return;
    }

    if (currentStepIndex >= activeScript.steps.length) {
      finishRun('completed');
      return;
    }

    const step = activeScript.steps[currentStepIndex];
    const effectiveDelay = stepOnceRef.current ? 0 : step.delayMs ?? delayMs ?? activeScript.defaultDelayMs;

    stepTimerRef.current = setTimeout(() => {
      setActiveStep({
        historyLengthBefore: history.length,
        roomBefore: currentRoomId,
        startedAt: Date.now(),
        stepIndex: currentStepIndex,
      });
      onCommand(step.command);
    }, effectiveDelay);

    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    };
  }, [
    activeScript,
    activeStep,
    currentRoomId,
    delayMs,
    enabled,
    finishRun,
    history.length,
    onCommand,
    currentStepIndex,
    status,
  ]);

  useEffect(() => {
    if (!activeStep) {
      return;
    }

    if (evaluationTimerRef.current) {
      clearTimeout(evaluationTimerRef.current);
    }

    evaluationTimerRef.current = setTimeout(() => {
      finaliseActiveStep();
    }, EVALUATION_SETTLE_MS);

    return () => {
      if (evaluationTimerRef.current) {
        clearTimeout(evaluationTimerRef.current);
        evaluationTimerRef.current = null;
      }
    };
  }, [activeStep, currentRoomId, finaliseActiveStep, history]);

  const report = useMemo(() => buildReport(status), [buildReport, status]);

  const handleCopyReport = useCallback(async () => {
    if (!report) {
      return;
    }

    const reportText = formatWalkthroughReport(report);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(reportText);
        setCopyStatus('Report copied.');
        return;
      }
    } catch (error) {
      console.warn('[Walkthrough] Clipboard copy failed:', error);
    }

    console.log('[Walkthrough] Copy fallback\n' + reportText);
    setCopyStatus('Clipboard unavailable. Report printed to console.');
  }, [report]);

  if (!enabled) {
    return null;
  }

  const summary = report?.summary;
  const stepCount = activeScript?.steps.length || selectedScriptPreview.steps.length;

  return (
    <aside className="fixed bottom-4 left-4 z-[70] w-[420px] max-w-[calc(100vw-2rem)] rounded-lg border border-emerald-500 bg-slate-950/95 text-emerald-100 shadow-2xl backdrop-blur">
      <div className="border-b border-emerald-500/40 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide">Automated Walkthrough</h2>
            <p className="mt-1 text-xs text-emerald-200/80">
              Developer-only audit runner. Commands go through the ordinary parser path.
            </p>
          </div>
          <span className="rounded border border-emerald-500/40 px-2 py-1 text-[11px] uppercase tracking-wide text-emerald-300">
            {status}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 text-sm">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-emerald-300/80">
            Script
          </span>
          <select
            value={selectedScriptId}
            onChange={(event) => setSelectedScriptId(event.target.value)}
            disabled={status === 'running'}
            className="w-full rounded border border-emerald-600 bg-slate-900 px-3 py-2 text-sm text-emerald-100"
          >
            {walkthroughScriptLibrary.map((script) => (
              <option key={script.id} value={script.id}>
                {script.title}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded border border-emerald-500/30 bg-slate-900/80 px-3 py-2 text-xs text-emerald-100/85">
          <div>{selectedScriptPreview.description}</div>
          <div className="mt-2">
            Current room: <code>{currentRoomId}</code>
          </div>
          <div>
            Steps ready: <strong>{stepCount}</strong>
          </div>
          {stage !== 'game' && (
            <div className="mt-2 text-amber-300">
              Waiting for the playable shell. Start a new run or load a save, then the walkthrough
              can begin.
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-emerald-300/80">
            Delay Between Steps: {delayMs}ms
          </span>
          <input
            type="range"
            min={500}
            max={4000}
            step={250}
            value={delayMs}
            onChange={(event) => setDelayMs(Number(event.target.value))}
            className="w-full accent-emerald-500"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => startRun(false)}
            disabled={stage !== 'game' || status === 'running'}
            className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Start
          </button>
          <button
            type="button"
            onClick={pauseRun}
            disabled={status !== 'running'}
            className="rounded bg-amber-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={() => resumeRun(false)}
            disabled={status !== 'paused'}
            className="rounded bg-sky-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={runSingleStep}
            disabled={stage !== 'game' || status === 'running'}
            className="rounded bg-violet-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Step Once
          </button>
          <button
            type="button"
            onClick={stopRun}
            disabled={status === 'idle'}
            className="rounded bg-rose-700 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={handleCopyReport}
            disabled={!report || entries.length === 0}
            className="rounded border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
          >
            Copy Report
          </button>
        </div>

        {copyStatus && <div className="text-xs text-emerald-300">{copyStatus}</div>}

        {summary && (
          <div className="grid grid-cols-2 gap-2 rounded border border-emerald-500/30 bg-slate-900/80 p-3 text-xs">
            <div>Total steps: {summary.totalSteps}</div>
            <div>Passed: {summary.passedSteps}</div>
            <div>Warnings: {summary.warningSteps}</div>
            <div>Failed: {summary.failedSteps}</div>
            <div className="col-span-2 truncate">
              Rooms visited: {summary.roomsVisited.join(', ') || 'None yet'}
            </div>
          </div>
        )}

        <div className="rounded border border-emerald-500/30 bg-slate-900/80">
          <div className="border-b border-emerald-500/20 px-3 py-2 text-xs uppercase tracking-wide text-emerald-300/80">
            Notes-Friendly Log
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto px-3 py-3 text-xs">
            {entries.length === 0 ? (
              <div className="text-emerald-100/60">
                No steps recorded yet. Start a run when you reach the playable shell.
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={`${entry.stepId}-${entry.stepNumber}`}
                  className={`rounded border px-3 py-2 ${
                    entry.outcome === 'pass'
                      ? 'border-emerald-600/50 bg-emerald-950/30'
                      : entry.outcome === 'warning'
                        ? 'border-amber-600/50 bg-amber-950/30'
                        : 'border-rose-600/50 bg-rose-950/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold">
                      {entry.stepNumber}. {entry.label}
                    </div>
                    <span className="uppercase tracking-wide">{entry.outcome}</span>
                  </div>
                  <div className="mt-1">
                    <code>{entry.command}</code>
                  </div>
                  <div className="mt-1 text-emerald-100/80">
                    {entry.roomBefore} {'->'} {entry.roomAfter}
                  </div>
                  <div className="mt-2 text-emerald-100/90">{entry.outputSummary}</div>
                  {entry.warnings.length > 0 && (
                    <ul className="mt-2 space-y-1 text-rose-200">
                      {entry.warnings.map((warning) => (
                        <li key={warning}>- {warning}</li>
                      ))}
                    </ul>
                  )}
                  {entry.notePrompt && (
                    <div className="mt-2 text-amber-200">Note: {entry.notePrompt}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default WalkthroughPanel;
