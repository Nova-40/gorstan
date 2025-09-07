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

// MetaProgressionListener – React component installing meta progression event bridge & toast feedback
import { useEffect, useState } from 'react';
import { installMetaProgressionEventBridge, getMetaSnapshot } from './metaProgression';
import { Toast } from '../components/ui';

interface MPToast { id: string; msg: string; }

export const MetaProgressionListener: React.FC = () => {
  const [toasts, setToasts] = useState<MPToast[]>([]);
  useEffect(() => {
    const uninstall = installMetaProgressionEventBridge();
    const push = (msg: string) => setToasts(p => [{ id: Math.random().toString(36).slice(2), msg }, ...p].slice(0,5));
  const artifactUnlock = (e: Event) => { const d = (e as CustomEvent).detail; push(`🗝️ Artifact: ${formatArtifactName(d?.id || '???')}`); };
    const dossier = (e: Event) => { const d = (e as CustomEvent).detail; push(`Intel dossier secured: ${d?.id}`); };
  const prestige = () => { const snap = getMetaSnapshot(); push(`Nexus prestige rank: ${snap.nexus.prestigeRank}`); };
  const trialsFail = () => { const snap = getMetaSnapshot(); push(`Trials failed (total: ${snap.trials.failures})`); };
    const glitchLoot = (e: Event) => { const d = (e as CustomEvent).detail; push(`Glitch loot: ${d?.id}`); };
    const faeClause = (e: Event) => { const d = (e as CustomEvent).detail; push(`Fae clause added: ${d?.id}`); };
    document.addEventListener('trials:artifact-unlock', artifactUnlock as any);
    document.addEventListener('trent:intel', dossier as any);
    document.addEventListener('nexus:clear', prestige as any);
  document.addEventListener('glitch:artifact', glitchLoot as any);
    document.addEventListener('fae:clause', faeClause as any);
  document.addEventListener('trials:fail', trialsFail as any);
    return () => {
      uninstall();
      document.removeEventListener('trials:artifact-unlock', artifactUnlock as any);
      document.removeEventListener('trent:intel', dossier as any);
      document.removeEventListener('nexus:clear', prestige as any);
  document.removeEventListener('glitch:artifact', glitchLoot as any);
      document.removeEventListener('fae:clause', faeClause as any);
  document.removeEventListener('trials:fail', trialsFail as any);
    };
  }, []);
  const dismiss = (id: string) => setToasts(p => p.filter(t => t.id !== id));
  if (!toasts.length) return null;
  return (
    <div className="fixed top-20 right-4 z-[1090] flex flex-col gap-2 w-[300px]">
      {toasts.map(t => {
        const type = t.msg.startsWith('🗝️') ? 'success' : 'info';
        return (
          <Toast key={t.id} id={t.id} type={type as any} message={<span className="text-[11px] leading-snug">{t.msg}</span>} duration={5200} onDismiss={dismiss} />
        );
      })}
    </div>
  );
};

function formatArtifactName(id: string): string {
  const map: Record<string,string> = {
    stone_memory: 'Stone Memory',
    echo_compass: 'Echo Compass',
    ember_veil: 'Ember Veil',
    gravity_lens: 'Gravity Lens',
    chrono_seed: 'Chrono Seed'
  };
  return map[id] || id;
}

export default MetaProgressionListener;
