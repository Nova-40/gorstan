import React, { useCallback, useEffect, useState } from 'react';

import { BUILD_VERSION, GAME_STATUS } from '../config/version';
import { safeGetStorageItem, safeSetStorageItem } from '../utils/safeStorage';

const BRIEFING_STORAGE_KEY = 'gorstan.openingBriefing.dismissed.beta4';

interface OpeningBriefingProps {
  readonly onCommand: (command: string) => void;
}

const OpeningBriefing: React.FC<OpeningBriefingProps> = ({ onCommand }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(safeGetStorageItem(BRIEFING_STORAGE_KEY) !== 'true');
  }, []);

  const dismiss = useCallback(() => {
    safeSetStorageItem(BRIEFING_STORAGE_KEY, 'true');
    setVisible(false);
  }, []);

  const runHelp = useCallback(() => {
    onCommand('help');
    dismiss();
  }, [dismiss, onCommand]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4">
      <section className="max-w-2xl border border-green-500 bg-[#08151c] p-5 font-mono text-green-300 shadow-2xl">
        <div className="mb-4 border-b border-green-700 pb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Gorstan Terminal Notice
          </p>
          <h2 className="mt-1 text-2xl font-bold text-green-200">
            Gorstan {GAME_STATUS} · build {BUILD_VERSION}
          </h2>
        </div>

        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            This is a parser-first adventure with illustrated rooms attached, like a sensible
            British bureaucracy attaching wheels to a filing cabinet and calling it transport.
          </p>
          <p>
            Type commands such as <strong>look</strong>, <strong>go north</strong>,{' '}
            <strong>inspect console</strong>, <strong>inventory</strong>, <strong>save</strong>, or{' '}
            <strong>help</strong>. Clickable exits and room controls send ordinary commands through
            the same parser route.
          </p>
          <p>
            Exits appear in the action panel and, where mapped, as room interactions. Inventory,
            status, save/load, NPC help, and room inspection remain available from the command line
            or the surrounding panels.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded border border-green-400 bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"
            onClick={dismiss}
          >
            Begin Interaction
          </button>
          <button
            type="button"
            className="rounded border border-cyan-500 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-950"
            onClick={runHelp}
          >
            Print Help To Terminal
          </button>
        </div>
      </section>
    </div>
  );
};

export default OpeningBriefing;
