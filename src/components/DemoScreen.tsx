import React from 'react';
import { demoRoutes } from '../demo/demoRouter';
import { demoService } from '../demo/DemoModeService';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from '../utils/cn';

interface DemoScreenProps {
  onClose: () => void;
  onStartDemo?: (routeId: string) => void;
}

const DemoScreen: React.FC<DemoScreenProps> = ({ onClose, onStartDemo }) => {
  const handleDemoStart = (id: string) => {
    if (onStartDemo) {
      onStartDemo(id);
    } else {
      demoService.start(id);
    }
  };

  return (
    <div className="route-select-screen p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <Button variant="ghost" onClick={onClose} className="mb-4">← Back</Button>
        <h1 className="text-2xl font-bold mb-2">Demo Experiences</h1>
        <p className="text-sm text-gray-300">Select a curated demo experience to try Gorstan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoRoutes.map((route: any) => (
          <Card key={route.id} variant="elevated" className={cn('cursor-pointer', 'bg-gradient-to-br from-slate-900 to-black rounded-xl p-3 border border-gray-800 shadow-lg text-crt-green')}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info" className="text-xs">Demo</Badge>
                <Badge variant="success" className="text-xs">{route.kind === 'short' ? '~10min' : '~30min'}</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">{route.title}</h3>
              <p className="text-xs text-gray-300 mb-3">{route.summary}</p>
              <Button variant="primary" size="sm" className="w-full" onClick={() => handleDemoStart(route.id)}>
                Start Demo
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DemoScreen;
