/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

// src/components/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { getVersionString } from '../config/version';
import bookData from '../data/lore/books.json';
import bookCovers from '../data/lore/book-covers.json';
const BOOK_COVERS: Record<string, string> = bookCovers as unknown as Record<string, string>;
import { LazyImage } from '../utils/assetOptimization';
import UIButton from './ui/Button';
import MenuCard from './ui/MenuCard';

interface WelcomeScreenProps {
  onBegin: () => void;
  onLoadGame: () => void;
  onStartDemo?: () => void;
  onOpenCredits?: () => void;
  onOpenDemo?: () => void;
}

interface AylaGuidanceProps {
  onDismiss: () => void;
  onStartDemo: () => void;
}

interface RadialProgressRingProps {
  progress: number;
}

const AylaGuidanceModal: React.FC<AylaGuidanceProps> = ({ onDismiss, onStartDemo }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-cyan-400 rounded-xl p-6 max-w-2xl w-full text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/images/Ayla.png"
            alt="Ayla"
            className="w-16 h-16 rounded-full border-2 border-cyan-400"
          />
          <div>
            <h3 className="text-xl font-bold text-cyan-300">Ayla</h3>
            <p className="text-sm text-gray-300">Your Guide Through the Multiverse</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-cyan-200">
            *A cosmic presence manifests, her voice carrying the weight of infinite realities*
          </p>

          <p className="text-white">
            "Greetings, traveler. I sense you're contemplating your journey through Gorstan. Let me
            illuminate the paths before you..."
          </p>

          <div className="bg-black bg-opacity-30 rounded-lg p-4 space-y-2">
            <h4 className="text-cyan-300 font-semibold">What You Can Experience:</h4>
            <ul className="text-gray-200 space-y-1">
              <li>
                • <strong>Explore</strong> - Navigate a multiverse of interconnected rooms and
                realities
              </li>
              <li>
                • <strong>Interact</strong> - Converse with AI-powered NPCs who remember your
                choices
              </li>
              <li>
                • <strong>Solve Puzzles</strong> - Uncover secrets through logic and observation
              </li>
              <li>
                • <strong>Shape Reality</strong> - Your decisions ripple across dimensions
              </li>
              <li>
                • <strong>Discover Lore</strong> - Unravel the mysteries of the Lattice and beyond
              </li>
            </ul>
          </div>

          <div className="bg-black bg-opacity-30 rounded-lg p-4 space-y-2">
            <h4 className="text-cyan-300 font-semibold">How to Play:</h4>
            <ul className="text-gray-200 space-y-1">
              <li>
                • Type commands like <code className="bg-gray-700 px-1 rounded">look</code>,{' '}
                <code className="bg-gray-700 px-1 rounded">north</code>,{' '}
                <code className="bg-gray-700 px-1 rounded">talk to [character]</code>
              </li>
              <li>• Use the Quick Actions panel for common commands</li>
              <li>• Ask me for help anytime - I'm always watching over you</li>
              <li>• Save your progress and return anytime</li>
            </ul>
          </div>

          <p className="text-cyan-200 italic">
            "If you're unsure where to begin, I recommend the demo experience - a guided tour of
            Gorstan's core mysteries."
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onStartDemo}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Start Demo Experience
          </button>
          <button
            onClick={onDismiss}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            I'll Explore on My Own
          </button>
        </div>
      </div>
    </div>
  );
};

// Radial progress ring component
const RadialProgressRing: React.FC<RadialProgressRingProps> = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 70 70">
        {/* Background ring */}
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="rgba(34, 197, 94, 0.15)"
          strokeWidth="3"
          fill="none"
        />
        {/* Progress ring */}
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="rgb(34, 197, 94)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))',
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-green-400 rounded-full opacity-90 animate-pulse"></div>
      </div>
    </div>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin, onLoadGame, onStartDemo, onOpenCredits, onOpenDemo }) => {
  const [showAylaGuidance, setShowAylaGuidance] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  // Set a CSS variable --vh to represent 1% of the viewport height to handle mobile browser chrome
  // This allows using calc(var(--vh) * 100) for a reliable full-viewport height.
  useEffect(() => {
    const setVh = () => {
      try {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      } catch (e) {
        // ignore in non-browser environments
      }
    };
    setVh();
    let t: any = null;
    const onResize = () => {
      if (t) clearTimeout(t);
      t = setTimeout(setVh, 120);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (t) clearTimeout(t);
    };
  }, []);

  // Carousel state — rotate through a few featured books
  const featuredBooks = (bookData as any).books.slice(0, 6);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % featuredBooks.length);
    }, 3500);
    return () => clearInterval(id);
  }, [featuredBooks.length]);

  // Simple inactivity -> Ayla guidance (kept short)
  useEffect(() => {
    const start = Date.now();
    const duration = 120000; // 2 minutes
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setTimerProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed >= duration) {
        setShowAylaGuidance(true);
        clearInterval(tick);
      }
    }, 200);
    const reset = () => {
      setTimerProgress(0);
    };
    ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, reset, { passive: true }),
    );

    return () => {
      clearInterval(tick);
      ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, reset as any),
      );
    };
  }, []);

  const handleAylaStartDemo = () => {
    setShowAylaGuidance(false);
    if (onStartDemo) onStartDemo();
  };

  const handleAylaDismiss = () => {
    setShowAylaGuidance(false);
    setTimerProgress(0);
  };

  // Pricing copy
  const pricing = {
    standard: {
  price: '£9.99',
      cadence: 'per month',
      headline: 'Standard Supporter',
      blurb: 'Keep Gorstan thriving — monthly support that funds development, hosting, and small features.',
  cta: 'Support — £9.99 / month',
    },
    founders: {
  price: '£9.99',
      cadence: 'per month',
      headline: "Founders (limited to 50)",
      blurb: 'Founders receive early beta access, direct feedback channels to the team, and a name in the credits.',
  cta: 'Become a Founder — £9.99 / month',
      limit: 50,
    },
  };

  return (
    <>
  <div className="max-w-6xl mx-auto px-6 py-6" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)', display: 'flex', flexDirection: 'column' }}>
        <header className="flex items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
            <LazyImage src={'/images/gorstanicon.png'} fallback={'/images/fallback.png'} alt="Gorstan" className="w-16 h-16 rounded-md" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Gorstan — Explore the Multiverse</h1>
              <div className="text-sm text-gray-300 mt-1">A story-driven exploration where your choices ripple across realities — {getVersionString()}</div>
            </div>
          </div>

            <div className="flex items-center gap-3">
              <a href="https://www.patreon.com/gorstan" target="_blank" rel="noopener noreferrer">
                <UIButton variant="secondary" className="text-sm">Support Gorstan</UIButton>
              </a>
              <UIButton onClick={onBegin} variant="primary" className="text-sm">Start Playing</UIButton>
              <UIButton onClick={() => onOpenCredits?.()} variant="ghost" className="text-sm">Credits</UIButton>
            </div>
        </header>

  <main className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ flex: 1, overflowY: 'auto' }}>
          {/* Left: Carousel + carousel details */}
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-3 border border-gray-800 shadow-lg welcome-card [&>*:first-child]:mt-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Featured Books</h2>
                <div className="text-sm text-gray-400">Hand-picked reads from the Gorstan universe</div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-36 h-48 bg-gray-800 rounded-md flex-shrink-0 overflow-hidden shadow-inner">
                  <LazyImage
                    src={
                      BOOK_COVERS[featuredBooks[carouselIndex].id]
                        ? `/images/books/${BOOK_COVERS[featuredBooks[carouselIndex].id]}`
                        : `/images/books/${featuredBooks[carouselIndex].id}.cover.png`
                    }
                    fallback={'/images/gorstanicon.png'}
                    alt={featuredBooks[carouselIndex].title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{featuredBooks[carouselIndex].title}</h3>
                  <div className="text-sm text-gray-300 mb-2">by {featuredBooks[carouselIndex].author}</div>
                  <p className="text-gray-200 mb-3 line-clamp-3">{featuredBooks[carouselIndex].description}</p>
                  <div className="flex gap-3">
                    <a
                      href={`https://thegorstanchronicles.com/books/${featuredBooks[carouselIndex].id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline"
                    >
                      <UIButton variant="primary" className="text-sm">Read a free excerpt</UIButton>
                    </a>
                    <a
                      href="https://geoffwebsterbooks.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hide-sm"
                    >
                      <UIButton variant="secondary" className="text-sm">Visit Store</UIButton>
                    </a>
                  </div>
                </div>
              </div>

                  {/* Demo Experiences card — opens the demo listing */}
                  <MenuCard title="Demo Experiences" subtitle="Try a curated demo" className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-4 border border-gray-800 shadow welcome-card [&>*:first-child]:mt-0" onActivate={() => onOpenDemo && onOpenDemo()}>
                    <div className="p-2">
                      <p className="text-sm text-gray-300 mb-2">Bring up short, curated demo experiences — quick introductions to the game's mechanics and story.</p>
                      <div className="flex items-center gap-2">
                        <UIButton variant="ghost" onClick={() => onOpenDemo && onOpenDemo()}>View Demos</UIButton>
                      </div>
                    </div>
                  </MenuCard>
            </div>

            {/* Grid of book cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {((bookData as any).books || []).slice(0, 6).map((b: any) => (
                <article
                  key={b.id}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 p-2 rounded-lg border border-gray-800 shadow-sm flex flex-col welcome-card [&>*:first-child]:mt-0"
                >
                  <div className="w-full h-40 bg-gray-900 rounded-md overflow-hidden mb-3 relative">
                    <LazyImage
                      src={
                        BOOK_COVERS[b.id]
                          ? `/images/books/${BOOK_COVERS[b.id]}`
                          : `/images/books/${b.id}.cover.png`
                      }
                      fallback={'/images/gorstanicon.png'}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[var(--gorstan-green)] text-black text-xs px-2 py-0.5 rounded">Sample</span>
                  </div>
                  <h4 className="font-semibold text-lg">{b.title}</h4>
                  <div className="text-xs text-gray-400 mb-2">by {b.author}</div>
                  <p className="text-sm text-gray-300 flex-1 line-clamp-3">{b.description}</p>
                  <div className="mt-2 flex gap-2">
                    <a href={`https://thegorstanchronicles.com/books/${b.id}`} target="_blank" rel="noopener noreferrer" className="no-underline hide-sm">
                      <UIButton variant="secondary" className="text-xs">Details</UIButton>
                    </a>
                    <a href={`https://thegorstanchronicles.com/books/${b.id}`} target="_blank" rel="noopener noreferrer" className="no-underline">
                      <UIButton variant="secondary" className="text-xs">Buy</UIButton>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Right: Pricing / FAQ cards */}
          <aside className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-4 border border-gray-800 shadow-lg welcome-card [&>*:first-child]:mt-0">
              <h3 className="text-lg font-semibold mb-2">Support Gorstan</h3>
              <p className="text-sm text-gray-300 mb-4">Help keep Gorstan growing — your support funds new content, server costs, and ongoing development.</p>

              <div className="space-y-3">
                <MenuCard title={pricing.standard.headline} subtitle={pricing.standard.cadence} className="bg-gray-850 border-gray-700 welcome-card [&>*:first-child]:mt-0">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-bold">{pricing.standard.price} <span className="text-sm font-medium">{pricing.standard.cadence}</span></div>
                    </div>
                    <div>
                      <a href="https://www.patreon.com/gorstan" target="_blank" rel="noopener noreferrer" className="no-underline">
                        <UIButton variant="primary" className="text-sm w-full">{pricing.standard.cta}</UIButton>
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{pricing.standard.blurb}</div>
                </MenuCard>

                <MenuCard title={pricing.founders.headline} subtitle={`Limited to ${pricing.founders.limit}`} className="bg-gradient-to-br from-yellow-900 to-orange-800 border-yellow-700 welcome-card [&>*:first-child]:mt-0">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-50">{pricing.founders.price} <span className="text-sm font-medium">{pricing.founders.cadence}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-yellow-100">Limited to {pricing.founders.limit}</div>
                      <a href="https://www.patreon.com/gorstan" target="_blank" rel="noopener noreferrer" className="no-underline">
                        <UIButton variant="primary" className="mt-2 inline-block text-sm font-semibold w-full">{pricing.founders.cta}</UIButton>
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-yellow-100 mt-2">{pricing.founders.blurb}</div>
                </MenuCard>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-4 border border-gray-800 shadow welcome-card [&>*:first-child]:mt-0">
              <h4 className="text-sm font-semibold mb-2">FAQ</h4>
              <div className="text-xs text-gray-300 space-y-2">
                <div>
                  <div className="font-medium">What does membership pay for?</div>
                  <div>Hosting, small-feature development, and community costs.</div>
                </div>
                <div>
                  <div className="font-medium">How many Founders slots?</div>
                  <div>The Founders tier is limited to 50 supporters. Founders get early betas, a direct feedback channel, and a name in the credits.</div>
                </div>
                <div>
                  <div className="font-medium">Can I cancel?</div>
                  <div>Yes — cancel anytime through the platform you used to subscribe.</div>
                </div>
              </div>
            </div>

            {/* Author card */}
            <div className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-4 border border-gray-800 shadow welcome-card [&>*:first-child]:mt-0">
              <h4 className="text-sm font-semibold mb-2">About the Author</h4>
              <div className="flex items-center gap-3">
                <LazyImage src={'/images/author/geoff_webster_headshot.jpg'} fallback={'/images/gorstanicon.png'} alt="Geoff Webster" className="w-12 h-12 rounded-md object-cover" />
                <div>
                  <div className="font-medium">Geoff Webster</div>
                  <div className="text-xs text-gray-400">Author of The Gorstan Chronicles</div>
                  <a href="https://geoffwebsterbooks.com" target="_blank" rel="noopener noreferrer" className="no-underline mt-2 inline-block" aria-label="Open author site (opens in new tab)">
                    <UIButton variant="secondary" className="text-xs">Author site</UIButton>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">{getVersionString()}</div>
          </aside>
        </main>
      </div>

      {/* Ayla Guidance Modal */}
      {showAylaGuidance && (
        <AylaGuidanceModal onDismiss={handleAylaDismiss} onStartDemo={handleAylaStartDemo} />
      )}
    </>
  );
};

export default WelcomeScreen;
