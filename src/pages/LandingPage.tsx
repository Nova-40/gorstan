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

import React from 'react';
import TopNav from '@/components/nav/TopNav';
import Hero from '@/components/hero/Hero';
import HighlightsReel from '@/components/reel/HighlightsReel';
import FeatureGrid from '@/components/feature/FeatureGrid';
import DemoLauncher from '@/components/demo/DemoLauncher';
import UnlockPanel from '@/components/unlock/UnlockPanel';
import Pricing from '@/components/pricing/Pricing';
import Roadmap from '@/components/roadmap/Roadmap';
import FAQ from '@/components/faq/FAQ';
import BooksPromo from '@/components/books/BooksPromo';
import SiteFooter from '@/components/footer/SiteFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-black text-white">
      <TopNav />
      <main className="flex-1">
        <Hero />
        <HighlightsReel />
        <FeatureGrid />
        <DemoLauncher />
        <UnlockPanel />
        <Pricing />
        <Roadmap />
        <FAQ />
        <BooksPromo />
      </main>
      <SiteFooter />
    </div>
  );
};

export default LandingPage;
