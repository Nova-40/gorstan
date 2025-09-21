import React from 'react';
import MenuGrid from '../ui/MenuGrid';
import MenuCard from '../ui/MenuCard';
import UIButton from '../ui/Button';

interface MainMenuProps {
  onBegin: () => void;
  onLoadGame: () => void;
  onStartDemo: () => void;
  onUnlock: () => void;
  onOpenCredits: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onBegin, onLoadGame, onStartDemo, onUnlock, onOpenCredits }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"> 
      <div className="max-w-4xl w-full p-6">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white">Gorstan</h1>
          <p className="text-gray-300">A short demo is playable for free. Unlock the full game to continue your journey.</p>
        </div>

        <MenuGrid>
          <MenuCard title="New Game">
            <div className="p-2">
              <div className="mb-2">Start a new adventure in Gorstan.</div>
              <UIButton onClick={onBegin} variant="primary">New Game</UIButton>
            </div>
          </MenuCard>

          <MenuCard title="Continue">
            <div className="p-2">
              <div className="mb-2">Resume a saved game.</div>
              <UIButton onClick={onLoadGame} variant="secondary">Load / Continue</UIButton>
            </div>
          </MenuCard>

          <MenuCard title="Play Demo">
            <div className="p-2">
              <div className="mb-2">Try a short guided demo.</div>
              <UIButton onClick={onStartDemo} variant="ghost">Play Demo</UIButton>
            </div>
          </MenuCard>

          <MenuCard title="Unlock Full Game">
            <div className="p-2">
              <div className="mb-2">Support development — unlock extra content.</div>
              <UIButton onClick={onUnlock} variant="primary">Unlock (£5)</UIButton>
            </div>
          </MenuCard>

          <MenuCard title="Explore the Series">
            <div className="p-2">
              <div className="mb-2">Findlater's Corner & Quantum — external links.</div>
              <div className="flex gap-2">
                <a href="https://thegorstanchronicles.example/books/findlaters-corner" target="_blank" rel="noreferrer" className="underline text-cyan-300">Findlater's Corner</a>
                <a href="https://thegorstanchronicles.example/books/quantum" target="_blank" rel="noreferrer" className="underline text-cyan-300">Quantum</a>
              </div>
            </div>
          </MenuCard>

          <MenuCard title="About the Author">
            <div className="p-2">
              <div className="mb-2">Learn more about Geoff Webster.</div>
              <a href="https://author.geoffwebster.example" target="_blank" rel="noreferrer" className="underline text-cyan-300">Author site</a>
            </div>
          </MenuCard>

          <MenuCard title="Credits">
            <div className="p-2">
              <div className="mb-2">See credits and license information.</div>
              <UIButton onClick={onOpenCredits} variant="ghost">Credits</UIButton>
            </div>
          </MenuCard>
        </MenuGrid>
      </div>
    </div>
  );
};

export default MainMenu;
