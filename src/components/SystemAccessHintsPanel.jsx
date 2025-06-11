// Gorstan Game Module — v3.0.0
// MIT License © 2025 Geoff Webster
// SystemAccessHintsPanel.jsx — Developer/debug command hints panel for Gorstan UI

import React, { useState } from "react";

/**
 * Groups of developer/debug commands for display.
 * Each group has a title and an array of commands with descriptions.
 */
const commandGroups = [
	{
		title: "🧭 Navigation & Exploration",
		commands: [
			{ cmd: "/doors", desc: "Reveal all doors in the current room" },
			{ cmd: "/doorsoff", desc: "Hide secret exits again" },
			{ cmd: "/jump", desc: "Jump to a specific room (if known)" },
		],
	},
	{
		title: "🧰 Debug Tools",
		commands: [
			{ cmd: "/traps", desc: "Show all trap locations (debug only)" },
			{ cmd: "/debug", desc: "Activate Debug Control Panel" },
			{ cmd: "/status", desc: "Show current player stats" },
			{
				cmd: "/rooms",
				desc: "List all room IDs and names (debug only, excludes Stanton Harcourt)",
			},
		],
	},
	{
		title: "🛡 Godmode & Multiverse",
		commands: [
			{ cmd: "/godmode", desc: "Enable skip mode (requires name: Geoff)" },
			{ cmd: "/reset", desc: "Force reset the multiverse from any room" },
		],
	},
];

/**
 * SystemAccessHintsPanel
 * Displays a panel of developer/debug commands for advanced users.
 * Allows quick copy-to-clipboard for each command.
 *
 * @component
 * @returns {JSX.Element}
 */
const SystemAccessHintsPanel = () => {
	const [copied, setCopied] = useState(null);

	/**
	 * Copies a command to the clipboard and shows a "Copied!" message.
	 * @param {string} cmd - The command to copy.
	 */
	const copyToClipboard = (cmd) => {
		navigator.clipboard.writeText(cmd);
		setCopied(cmd);
		setTimeout(() => setCopied(null), 1000);
	};

	return (
		<div className="bg-black bg-opacity-80 rounded-xl text-green-400 text-xs p-4 mt-4 border border-green-600 shadow-inner max-w-md mx-auto font-mono animate-fade-in">
			<p className="mb-2 text-green-300 font-semibold">
				🔐 Developer Access: Recognised User Detected
			</p>

			{commandGroups.map((group, idx) => (
				<div key={group.title} className="mt-4">
					<p className="text-green-200 font-semibold">{group.title}</p>
					<ul className="space-y-1 mt-1">
						{group.commands.map(({ cmd, desc }) => (
							<li key={cmd}>
								<span
									onClick={() => copyToClipboard(cmd)}
									title={desc}
									className="cursor-pointer bg-green-900 px-2 py-0.5 rounded hover:bg-green-800 inline-block"
								>
									{cmd}
								</span>{" "}
								– {desc}
								{copied === cmd && (
									<span className="ml-2 text-green-300 italic">Copied!</span>
								)}
							</li>
						))}
					</ul>
				</div>
			))}

			<p className="mt-4 italic text-green-300">
				Tip: Some commands require specific traits, items, or debug mode enabled.
			</p>
			<p className="mt-2 text-green-700 text-xs text-right">
				Protocol Log: v3.0.0 — Observation node 1 active
			</p>
		</div>
	);
};

export default SystemAccessHintsPanel;

/*
Review summary:
- ✅ Syntax is correct and all JSX blocks are closed.
- ✅ JSDoc comments for component, props, and logic.
- ✅ No unnecessary logic or redundant checks.
- ✅ No props required, so no PropTypes needed.
- ✅ Structure is modular and ready for integration.
- ✅ Tailwind classes for consistent UI and accessibility.
*/
