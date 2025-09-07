/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

// ResetRoomHub.tsx - post-run hub
import React, { useEffect, useState } from 'react';

interface RunSummary { score: number; distance: number; fragments: number; durationMs: number }

interface Props { summary: RunSummary; onReplay: () => void; onExit: () => void }

export const ResetRoomHub: React.FC<Props> = ({ summary, onReplay, onExit }) => {
	const [time, setTime] = useState('');
	useEffect(() => {
		const sec = Math.round(summary.durationMs / 1000);
		const m = Math.floor(sec/60); const s = sec % 60;
		setTime(`${m}:${s.toString().padStart(2,'0')}`);
	}, [summary.durationMs]);
	return (
		<div className="flex flex-col gap-4 p-6 font-mono text-emerald-200 max-w-sm mx-auto">
			<h2 className="text-xl tracking-wide">Run Summary</h2>
			<ul className="text-sm space-y-1">
				<li>Score: <span className="text-emerald-400 font-semibold">{summary.score}</span></li>
				<li>Distance: <span className="text-emerald-400 font-semibold">{summary.distance}m</span></li>
				<li>Fragments: <span className="text-emerald-400 font-semibold">{summary.fragments}</span></li>
				<li>Time: <span className="text-emerald-400 font-semibold">{time}</span></li>
			</ul>
			<div className="flex gap-3 pt-2">
				<button onClick={onReplay} className="flex-1 px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold">Replay</button>
				<button onClick={onExit} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-semibold">Exit</button>
			</div>
			<p className="text-[11px] text-emerald-400/70 leading-relaxed">Tip: Consecutive flawless runs increase fragment drop rates.</p>
		</div>
	);
};

export default ResetRoomHub;
