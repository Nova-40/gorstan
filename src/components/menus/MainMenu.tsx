import React, { useState, useEffect } from 'react';
import MenuGrid from '../ui/MenuGrid';
import MenuCard from '../ui/MenuCard';
import UIButton from '../ui/Button';
import LicenseModal from '../LicenseModal';
import SmartImage from '../media/SmartImage';

interface MainMenuProps {
  onBegin: () => void;
  onLoadGame: () => void;
  onStartDemo: () => void;
  onUnlock: () => void;
  onOpenCredits: () => void;
  onOpenDemo?: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onBegin, onLoadGame, onStartDemo, onUnlock, onOpenCredits, onOpenDemo }) => {
  const [licenseOpen, setLicenseOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"> 
      <div className="max-w-4xl w-full p-6">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-crt-green">Gorstan — Adventures Across the Lattice</h1>
        </div>

        <MenuGrid>
          <MenuCard title="Start New Adventure">
            <div className="p-2">
              <div className="mb-2 text-crt-green">Begin a fresh playthrough and shape the story with your choices.</div>
              <UIButton onClick={onBegin} variant="primary">Start Adventure</UIButton>
            </div>
          </MenuCard>

          {/* Continue moved to Choose Your Adventure (RouteSelectScreen) per UX change */}

          <MenuCard title="Guided Demo">
            <div className="p-2">
              <div className="mb-2 text-crt-green">A short, guided introduction to Gorstan's core mechanics and story.</div>
              <UIButton onClick={() => { if (typeof onOpenDemo === 'function') onOpenDemo(); else onStartDemo(); }} variant="ghost">Start Demo</UIButton>
            </div>
          </MenuCard>

          <MenuCard title="Support Gorstan">
            <div className="p-2">
              <div className="mb-2 text-crt-green">Support development and gain access to the full game and bonus content.</div>
              <UIButton onClick={onUnlock} variant="primary">Support — £9.99</UIButton>
            </div>
          </MenuCard>

          <MenuCard title="Explore The Series">
            <div className="p-2">
              {/* Rotating slides: 0 = intro, 1 = Book 1, 2 = Book 2, 3 = Logo + site */}
              <RotatingSeriesCard />
            </div>
          </MenuCard>

          <MenuCard title="About the Author">
            <div className="p-2 flex items-center gap-3">
              <SmartImage src="/images/author/geoff_webster_headshot.jpg" alt="Geoff Webster" className="w-20 h-20 rounded-full object-cover shadow-md" />
              <div className="flex flex-col">
                <div className="mb-1 text-crt-green">Learn more about Geoff Webster.</div>
                <a href="https://author.geoffwebster.example" target="_blank" rel="noopener noreferrer" className="no-underline" aria-label="Open author site (opens in new tab)">
                  <UIButton variant="secondary" className="text-sm">Author site</UIButton>
                </a>
              </div>
            </div>
          </MenuCard>

          {/* Credits card removed — controls moved below the grid */}
        </MenuGrid>

        <div className="mt-6 flex items-center justify-center gap-4">
          <UIButton onClick={onOpenCredits} variant="ghost">Credits</UIButton>
          <UIButton onClick={() => setLicenseOpen(true)} id="open-license" variant="ghost">License</UIButton>
        </div>
        {/* License modal rendered client-side when opened */}
        <LicenseModal open={licenseOpen} onClose={() => setLicenseOpen(false)} />
      </div>
    </div>
  );
};

export default MainMenu;

const RotatingSeriesCard: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % 4), 5000);
    return () => clearInterval(t);
  }, []);

  // Fixed-height wrapper keeps the MenuCard the same size across slides.
  return (
    <div className="w-full h-44 flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        {index === 0 && (
          <div className="flex flex-col items-center gap-2 w-full px-2">
            <div className="text-lg font-semibold text-crt-green">Dive deeper into Gorstan's world</div>
            <div className="text-sm text-crt-green/80">Enjoy short excerpts, behind-the-scenes notes, and more stories from the lattice.</div>
            <div className="mt-2">
              <a href="/books/excerpts" className="no-underline"><UIButton variant="primary" className="text-sm">Read an excerpt</UIButton></a>
            </div>
          </div>
        )}

        {index === 1 && (
          <div className="flex flex-col items-center gap-2 w-full px-2">
            <SmartImage src="/images/books/findlaters.cover.png" alt="Findlater's Corner cover" className="max-h-20 w-auto rounded shadow-lg object-contain" />
            <div className="text-md font-semibold text-crt-green">Findlater's Corner</div>
            <div className="text-sm text-crt-green/80 mt-1 text-center">A cozy, curious tale — perfect for new readers.</div>
            <div className="mt-2">
              <a href="https://thegorstanchronicles.example/books/findlaters-corner" target="_blank" rel="noreferrer" className="no-underline">
                <UIButton variant="primary" className="text-sm">Buy / Read</UIButton>
              </a>
            </div>
          </div>
        )}

        {index === 2 && (
          <div className="flex flex-col items-center gap-2 w-full px-2">
            <img src="/images/books/quantum.lattice.cover.png" alt="Quantum Lattice cover" className="max-h-20 w-auto rounded shadow-lg object-contain" />
            <div className="text-md font-semibold text-crt-green">Quantum Lattice</div>
            <div className="text-sm text-crt-green/80 mt-1 text-center">A mind-bending continuation exploring lattice realities.</div>
            <div className="mt-2">
              <a href="https://thegorstanchronicles.example/books/quantum" target="_blank" rel="noreferrer" className="no-underline">
                <UIButton variant="primary" className="text-sm">Buy / Read</UIButton>
              </a>
            </div>
          </div>
        )}

        {index === 3 && (
          <div className="flex flex-col items-center gap-3">
            <img src="/images/gorstanicon.png" alt="Gorstan logo" className="max-h-20 w-auto" />
            <a href="https://www.thegorstanchronicles.com" target="_blank" rel="noreferrer" className="no-underline">
              <UIButton variant="primary">Visit The Gorstan Chronicles</UIButton>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
