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

import React, { useEffect, useState, useCallback } from 'react';
import LandingPage from '@/pages/LandingPage';
import DocsPage from '@/pages/DocsPage';
import PressPage from '@/pages/PressPage';
import ContactPage from '@/pages/ContactPage';
import LegalPage from '@/pages/LegalPage';
import CreditsPage from '@/pages/CreditsPage';
import GameShell from '@/components/shell/GameShell';
import { useAccess } from '@/stores/access';

type PendingShell = { mode: 'demo' | 'full' } | null;

// Simple routing based on URL hash
function getCurrentPage(): string {
  const hash = window.location.hash.slice(1); // Remove the '#'
  return hash || 'home';
}

function getPageComponent(page: string): React.ComponentType {
  switch (page) {
    case 'docs': return DocsPage;
    case 'press': return PressPage;
    case 'contact': return ContactPage;
    case 'legal': return LegalPage;
    case 'credits': return CreditsPage;
    case 'home':
    default: return LandingPage;
  }
}

// Root site wrapper deciding between marketing landing page and (modal) game shell
export const SiteRoot: React.FC = () => {
  const { access } = useAccess();
  const [shell, setShell] = useState<PendingShell>(null);
  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  const handleOpen = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail || {};
    let mode: 'demo' | 'full' = 'demo';
    if (detail.mode === 'full' || (access.state === 'patreon' || access.state === 'beta')) mode = 'full';
    setShell({ mode });
  }, [access.state]);

  // Handle hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentPage());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.addEventListener('open-game-shell', handleOpen as any);
    return () => document.removeEventListener('open-game-shell', handleOpen as any);
  }, [handleOpen]);

  const PageComponent = getPageComponent(currentPage);

  return (
    <>
      <PageComponent />
      {shell && <GameShell mode={shell.mode} onClose={() => setShell(null)} />}
    </>
  );
};

export default SiteRoot;
