import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DemoShadowState } from './DemoShadowState';
import { StartPromptDialog } from './StartPromptDialog';
import { ensureAudioPrimed } from '../audio/ensureAudioPrimed';
import { useGameState } from '../state/gameState';

// Lightweight HUD shown during demo
function DemoHud({ tip, progress }: { tip?: string; progress?: number }) {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="demo-hud fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
      >
        <div className="bg-gray-800 bg-opacity-80 text-white px-6 py-3 rounded-lg text-sm backdrop-blur-sm border border-cyan-400/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>{tip}</span>
          </div>
          {progress !== undefined && (
            <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
              <motion.div 
                className="bg-cyan-400 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Micro-tutorial tooltip component
function MicroTutorial({ text, position }: { text: string; position: { x: number; y: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y }}
    >
      <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs border border-cyan-400/50 max-w-48">
        {text}
        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-indigo-900 rotate-45 border-r border-b border-cyan-400/50"></div>
      </div>
    </motion.div>
  );
}

export default function DemoDirector() {
  const { state, dispatch } = useGameState();
  const shadowRef = useRef<DemoShadowState | null>(null);
  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showMicroTutorial, setShowMicroTutorial] = useState<string | null>(null);
  const [tutorialPosition, setTutorialPosition] = useState({ x: 0, y: 0 });
  
  const demoSteps = [
    'Starting your guided tour...',
    'Exploring the control nexus...',
    'Moving between rooms...',
    'Examining important objects...',
    'Returning to base...',
    'Using the chair portal...',
    'Demo complete!'
  ];

  useEffect(() => {
    // Attach shadow state and run scripted demo sequence
    const sh = new DemoShadowState();
    shadowRef.current = sh;
    sh.attach({ state, dispatch });

    let cancelled = false;

    async function runEnhancedDemo() {
      // Enhanced demo sequence with progressive disclosure
      const commands = [
        { cmd: 'look', tip: 'Observing your surroundings is key to survival' },
        { cmd: 'go west', tip: 'Movement commands work in all cardinal directions' },
        { cmd: 'look', tip: 'Each room tells part of Gorstan\'s story' },
        { cmd: 'examine tactical_display', tip: 'Examine objects to uncover secrets' },
        { cmd: 'go east', tip: 'You can always backtrack to previous rooms' },
        { cmd: 'sit', tip: 'Some furniture has hidden purposes...' },
        { cmd: 'look', tip: 'Welcome to the hidden laboratory!' }
      ];

      // Show initial HUD
      setDemoStep(0);

      for (let i = 0; i < commands.length; i++) {
        if (cancelled) break;
        
        const command = commands[i];
        if (!command) continue;
        
        const { cmd } = command;
        setDemoStep(i + 1);
        
        // Add demo command to message log with enhanced styling
        dispatch({ 
          type: 'ADD_MESSAGE', 
          payload: { 
            id: `demo-cmd-${Date.now()}`, 
            text: `🎮 Demo: ${cmd}`,
            type: 'input',
            timestamp: Date.now()
          }
        });

        // Show micro-tutorial if first time using a mechanic
        if (i === 0) showMicroTutorialAt('This is how you interact with Gorstan', { x: 300, y: 100 });
        if (i === 1) showMicroTutorialAt('Room navigation opens up the multiverse', { x: 300, y: 100 });
        if (i === 3) showMicroTutorialAt('Detailed examination reveals hidden lore', { x: 300, y: 100 });

        // Execute command through existing system
        dispatch({ type: 'COMMAND_INPUT', payload: cmd });
        
        await new Promise(res => setTimeout(res, 2200));
      }

      // Show combat/magic snippet
      setDemoStep(commands.length + 1);
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          id: `demo-combat-${Date.now()}`, 
          text: '⚔️ *A brief combat demonstration plays out - spells crackle through the air*',
          type: 'system',
          timestamp: Date.now()
        }
      });

      await new Promise(res => setTimeout(res, 1500));

      // Complete demo
      setDemoStep(commands.length + 2);
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { 
          id: `demo-complete-${Date.now()}`, 
          text: '🎭 Ayla: "You\'ve experienced the core of Gorstan. The full journey awaits..."',
          type: 'system',
          timestamp: Date.now()
        }
      });
    }

    function showMicroTutorialAt(text: string, pos: { x: number; y: number }) {
      setTutorialPosition(pos);
      setShowMicroTutorial(text);
      setTimeout(() => setShowMicroTutorial(null), 3000);
    }

    // Start demo after brief delay
    const demoTimer = setTimeout(() => {
      runEnhancedDemo().catch(console.error);
    }, 1000);

    // Listen for any user input to show start prompt
    const onAnyInput = () => {
      // Prevent showing prompt multiple times
      if (!showStartPrompt) {
        setShowStartPrompt(true);
        ensureAudioPrimed();
      }
    };

    window.addEventListener('keydown', onAnyInput, { passive: true });
    window.addEventListener('mousedown', onAnyInput, { passive: true });
    window.addEventListener('touchstart', onAnyInput, { passive: true });

    return () => {
      cancelled = true;
      clearTimeout(demoTimer);
      sh.detach({ dispatch });
      sh.clear();
      window.removeEventListener('keydown', onAnyInput);
      window.removeEventListener('mousedown', onAnyInput);
      window.removeEventListener('touchstart', onAnyInput);
    };
  }, [state, dispatch, showStartPrompt]);

  const handleStartGame = () => {
    setShowStartPrompt(false);
    // Clear demo state and start fresh
    if (shadowRef.current) {
      shadowRef.current.detach({ dispatch });
      shadowRef.current.clear();
    }
    // Transition to clean game state
    dispatch({ type: 'ADVANCE_STAGE', payload: 'nameCapture' });
    dispatch({ type: 'SET_CURRENT_ROOM', payload: 'controlnexus' });
  };

  const handleContinueDemo = () => {
    setShowStartPrompt(false);
  };

  const progress = Math.min((demoStep / demoSteps.length) * 100, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        transition={{ duration: 0.3 }}
        className="demo-overlay fixed inset-0 pointer-events-none z-40"
        aria-hidden="true"
      >
        <DemoHud 
          tip={demoSteps[demoStep] || 'Demo running...'}
          progress={progress}
        />
      </motion.div>

      {/* Micro-tutorial tooltip */}
      {showMicroTutorial && (
        <MicroTutorial text={showMicroTutorial} position={tutorialPosition} />
      )}

      {/* Start prompt dialog */}
      <StartPromptDialog 
        isOpen={showStartPrompt}
        onConfirm={handleStartGame}
        onCancel={handleContinueDemo}
      />
    </AnimatePresence>
  );
}