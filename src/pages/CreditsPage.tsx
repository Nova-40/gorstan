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

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/shared/PageHeader';

interface CreditEntry {
  role: string;
  name: string;
  details?: string;
}

const credits: CreditEntry[] = [
  { role: 'Story & Narrative', name: 'Geoff Webster', details: 'Original concept, world-building, and interactive fiction design' },
  { role: 'Game Definition', name: 'Geoff Webster', details: 'Core mechanics, gameplay systems, and user experience design' },
  { role: 'Programming & Development', name: 'Geoff Webster', details: 'Full-stack development, AI integration, and technical architecture' },
  { role: 'User Interface Design', name: 'Geoff Webster', details: 'UI/UX design, accessibility implementation, and responsive layouts' },
  { role: 'Game Design', name: 'Geoff Webster', details: 'Puzzle design, progression systems, and balance tuning' },
  { role: 'Quality Assurance', name: 'Geoff Webster', details: 'Testing, debugging, and performance optimization' },
  { role: 'Audio Direction', name: 'Geoff Webster', details: 'Sound design concepts and audio integration' },
  { role: 'Project Management', name: 'Geoff Webster', details: 'Planning, coordination, and release management' },
  
  // Founders Section
  { role: 'Founder & Creator', name: 'Geoff Webster', details: 'Visionary behind the Gorstan universe and interactive experience' },
  
  // Technical Acknowledgments
  { role: 'AI Technology', name: 'OpenAI GPT Integration', details: 'Advanced AI-powered NPC dialogue systems' },
  { role: 'Development Framework', name: 'React & TypeScript', details: 'Modern web application foundation' },
  { role: 'Build System', name: 'Vite', details: 'Fast development and optimized production builds' },
  { role: 'Styling Framework', name: 'Tailwind CSS', details: 'Responsive design and consistent visual language' },
  
  // Special Thanks
  { role: 'Inspiration', name: 'Classic Interactive Fiction', details: 'Zork, Adventure, and the rich tradition of text-based gaming' },
  { role: 'Beta Testing', name: 'Early Access Players', details: 'Valuable feedback and bug reports during development' },
  { role: 'Accessibility Consulting', name: 'Web Accessibility Community', details: 'Guidance on inclusive design practices' },
];

export const CreditsPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % credits.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Credits" />
        
        <div className="mb-8 text-center">
          <button
            onClick={toggleAnimation}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            {isAnimating ? 'Pause Rolling Credits' : 'Resume Rolling Credits'}
          </button>
        </div>

        {/* Rolling Credits Display */}
        <div className="bg-zinc-800 rounded-lg p-8 mb-12 min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">
              {credits[currentIndex]?.role || 'Unknown Role'}
            </h2>
            <h3 className="text-3xl font-bold mb-4">
              {credits[currentIndex]?.name || 'Unknown Name'}
            </h3>
            {credits[currentIndex]?.details && (
              <p className="text-zinc-300 max-w-2xl">
                {credits[currentIndex].details}
              </p>
            )}
          </div>
        </div>

        {/* Full Credits List */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-6">Core Development</h2>
            <div className="grid gap-4">
              {credits.slice(0, 8).map((credit, index) => (
                <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-amber-300">{credit.role}</h3>
                  <p className="text-xl font-bold">{credit.name}</p>
                  {credit.details && (
                    <p className="text-zinc-400 text-sm mt-1">{credit.details}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-6">Founders</h2>
            <div className="bg-zinc-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-300">Founder & Creator</h3>
              <p className="text-2xl font-bold">Geoff Webster</p>
              <p className="text-zinc-400 mt-2">
                Visionary behind the Gorstan universe, bringing together interactive fiction, 
                modern web technology, and AI-powered storytelling to create a unique gaming experience.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-6">Technology & Frameworks</h2>
            <div className="grid gap-4">
              {credits.slice(9, 13).map((credit, index) => (
                <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-amber-300">{credit.role}</h3>
                  <p className="text-xl font-bold">{credit.name}</p>
                  {credit.details && (
                    <p className="text-zinc-400 text-sm mt-1">{credit.details}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-6">Special Thanks</h2>
            <div className="grid gap-4">
              {credits.slice(13).map((credit, index) => (
                <div key={index} className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-amber-300">{credit.role}</h3>
                  <p className="text-xl font-bold">{credit.name}</p>
                  {credit.details && (
                    <p className="text-zinc-400 text-sm mt-1">{credit.details}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-8">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">Thank You for Playing Gorstan</h2>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Gorstan represents a passion project born from a love of interactive fiction, 
              storytelling, and the endless possibilities of modern web technology. Thank you 
              for being part of this journey.
            </p>
            <div className="mt-6">
              <a 
                href="mailto:gorstan@geoffwebsterbooks.com" 
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Contact Us
              </a>
              <span className="mx-4 text-zinc-500">•</span>
              <a 
                href="https://geoffwebsterbooks.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                GeoffWebsterBooks.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;
