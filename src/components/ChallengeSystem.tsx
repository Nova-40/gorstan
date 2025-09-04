// Minimal stub of ChallengeSystem during pruning phase.
import React from 'react';

export interface ChallengeSystemProps { isOpen: boolean; onClose: () => void; className?: string }

export const ChallengeSystem: React.FC<ChallengeSystemProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-sm font-mono text-sm text-slate-300">
        <h2 className="text-lg font-bold text-white mb-3 tracking-wide">Challenge System</h2>
        <p className="mb-4 text-slate-400 leading-relaxed">Temporarily disabled while unused code is removed. A streamlined version will return in a future build.</p>
        <button onClick={onClose} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">Close</button>
      </div>
    </div>
  );
};

export default ChallengeSystem;
