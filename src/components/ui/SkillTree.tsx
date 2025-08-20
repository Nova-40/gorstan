/**
 * Skill Tree Component
 * Displays quantum skills in a tree-like progression view
 */

import React, { useState } from 'react';
import { type QuantumSkill, type SkillCategory } from '../../types/quantumMagic';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { cn } from '../../utils/cn';

export interface SkillTreeProps {
  skills: Map<string, QuantumSkill>;
  onSkillSelect?: (skill: QuantumSkill) => void;
  className?: string;
}

const categoryColors = {
  manipulation: 'bg-purple-100 text-purple-800 border-purple-200',
  perception: 'bg-blue-100 text-blue-800 border-blue-200',
  protection: 'bg-green-100 text-green-800 border-green-200',
  traversal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  mastery: 'bg-red-100 text-red-800 border-red-200',
};

const elementIcons = {
  void: '🌌',
  flux: '⚡',
  resonance: '🔮',
  entropy: '🌪️',
  nexus: '⭐',
};

interface SkillNodeProps {
  skill: QuantumSkill;
  isUnlocked: boolean;
  canUpgrade: boolean;
  onSelect?: (skill: QuantumSkill) => void;
  onUpgrade?: (skillId: string) => void;
}

const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  isUnlocked,
  canUpgrade,
  onSelect,
  onUpgrade,
}) => {
  const experiencePercent = skill.experienceToNext > 0 
    ? Math.round((skill.experience / skill.experienceToNext) * 100)
    : 100;

  return (
    <Card 
      variant={isUnlocked ? "elevated" : "outlined"}
      className={cn(
        'skill-node cursor-pointer transition-all duration-200',
        isUnlocked ? 'hover:shadow-elevation-lg' : 'opacity-60 hover:opacity-80',
        !isUnlocked && 'border-dashed'
      )}
      onClick={() => onSelect?.(skill)}
    >
      <div className="p-space-4">
        {/* Header */}
        <div className="flex items-center gap-space-3 mb-space-3">
          <div className="text-2xl">
            {elementIcons[skill.element]}
          </div>
          <div className="flex-1">
            <h4 className="text-heading-xs font-semibold text-color-text-primary">
              {skill.name}
            </h4>
            <div className="flex items-center gap-space-2 mt-space-1">
              <Badge 
                variant="outline" 
                className={cn('text-xs', categoryColors[skill.category])}
              >
                {skill.category}
              </Badge>
              {isUnlocked && (
                <Badge variant="secondary" className="text-xs">
                  Lv.{skill.currentLevel}/{skill.maxLevel}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-body-xs text-color-text-secondary mb-space-3">
          {skill.description}
        </p>

        {/* Progress (if unlocked) */}
        {isUnlocked && skill.currentLevel < skill.maxLevel && (
          <div className="mb-space-3">
            <div className="flex items-center justify-between text-body-xs text-color-text-tertiary mb-space-1">
              <span>Experience</span>
              <span>{skill.experience}/{skill.experienceToNext}</span>
            </div>
            <div className="w-full bg-color-surface-elevated rounded-full h-1.5">
              <div 
                className="bg-color-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${experiencePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Current Effects */}
        {isUnlocked && skill.currentLevel > 0 && (
          <div className="mb-space-3">
            <h5 className="text-body-xs font-medium text-color-text-primary mb-space-1">
              Current Effects:
            </h5>
            {skill.effects.map((effect, index) => (
              <div key={index} className="text-body-xs text-color-text-secondary">
                • {effect.description}
              </div>
            ))}
          </div>
        )}

        {/* Requirements (if locked) */}
        {!isUnlocked && (
          <div className="mb-space-3">
            <h5 className="text-body-xs font-medium text-color-text-primary mb-space-1">
              Requirements:
            </h5>
            {skill.requirements.map((req, index) => (
              <div key={index} className="text-body-xs text-color-text-tertiary">
                • {req.type}: {req.target} {req.level && `(Lv.${req.level})`}
              </div>
            ))}
          </div>
        )}

        {/* Unlock Info */}
        {!isUnlocked && skill.unlockedBy.length > 0 && (
          <div className="text-body-xs text-color-text-tertiary">
            <span>Unlocked by: </span>
            {skill.unlockedBy.join(', ')}
          </div>
        )}

        {/* Action Button */}
        {isUnlocked && canUpgrade && skill.currentLevel < skill.maxLevel && (
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUpgrade?.(skill.id);
            }}
            className="w-full mt-space-2"
          >
            Upgrade ({skill.experienceToNext - skill.experience} XP needed)
          </Button>
        )}
      </div>
    </Card>
  );
};

export const SkillTree: React.FC<SkillTreeProps> = ({
  skills,
  onSkillSelect,
  className,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<QuantumSkill | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  // Group skills by category
  const skillsByCategory = Array.from(skills.values()).reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, QuantumSkill[]>);

  const filteredSkills = selectedCategory === 'all' 
    ? Array.from(skills.values())
    : skillsByCategory[selectedCategory] || [];

  const handleSkillSelect = (skill: QuantumSkill) => {
    setSelectedSkill(skill);
    onSkillSelect?.(skill);
  };

  const isSkillUnlocked = (skill: QuantumSkill): boolean => {
    return skill.currentLevel > 0 || skills.has(skill.id);
  };

  const canUpgradeSkill = (skill: QuantumSkill): boolean => {
    return skill.currentLevel < skill.maxLevel && skill.experience >= skill.experienceToNext;
  };

  return (
    <>
      <div className={cn('skill-tree', className)}>
        {/* Category Filter */}
        <div className="mb-space-6">
          <h3 className="text-heading-md font-bold text-color-text-primary mb-space-4">
            Quantum Skills
          </h3>
          <div className="flex flex-wrap gap-space-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Skills
            </Button>
            {Object.keys(skillsByCategory).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category as SkillCategory)}
                className={cn(
                  selectedCategory === category && categoryColors[category as SkillCategory]
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-4">
          {filteredSkills.map((skill) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              isUnlocked={isSkillUnlocked(skill)}
              canUpgrade={canUpgradeSkill(skill)}
              onSelect={handleSkillSelect}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-space-12">
            <div className="text-4xl mb-space-4">🔒</div>
            <h4 className="text-heading-sm font-semibold text-color-text-primary mb-space-2">
              No Skills Available
            </h4>
            <p className="text-body-md text-color-text-secondary">
              {selectedCategory === 'all' 
                ? 'Discover artifacts to unlock your first quantum skills!'
                : `No ${selectedCategory} skills unlocked yet.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Skill Detail Modal */}
      <Modal
        isOpen={selectedSkill !== null}
        onClose={() => setSelectedSkill(null)}
        title={selectedSkill?.name || ''}
        className="max-w-2xl"
      >
        {selectedSkill && (
          <div className="space-y-space-4">
            {/* Element and Category */}
            <div className="flex items-center gap-space-3">
              <div className="text-3xl">
                {elementIcons[selectedSkill.element]}
              </div>
              <div>
                <Badge 
                  variant="outline" 
                  className={categoryColors[selectedSkill.category]}
                >
                  {selectedSkill.category}
                </Badge>
                <Badge variant="secondary" className="ml-space-2">
                  {selectedSkill.element} Element
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-body-md text-color-text-secondary">
              {selectedSkill.description}
            </p>

            {/* Progression Info */}
            <div className="grid grid-cols-2 gap-space-4">
              <div>
                <h5 className="text-body-sm font-medium text-color-text-primary mb-space-2">
                  Current Level
                </h5>
                <p className="text-heading-sm font-bold text-color-primary">
                  {selectedSkill.currentLevel} / {selectedSkill.maxLevel}
                </p>
              </div>
              <div>
                <h5 className="text-body-sm font-medium text-color-text-primary mb-space-2">
                  Experience
                </h5>
                <p className="text-body-md text-color-text-secondary">
                  {selectedSkill.experience} / {selectedSkill.experienceToNext}
                </p>
              </div>
            </div>

            {/* All Effects */}
            <div>
              <h5 className="text-body-sm font-medium text-color-text-primary mb-space-2">
                Effects at Current Level:
              </h5>
              <div className="space-y-space-2">
                {selectedSkill.effects.map((effect, index) => (
                  <div key={index} className="p-space-3 bg-color-surface-elevated rounded">
                    <h6 className="font-medium text-color-text-primary">
                      {effect.type.replace(/_/g, ' ').toUpperCase()}
                    </h6>
                    <p className="text-body-sm text-color-text-secondary">
                      {effect.description}
                    </p>
                    {effect.conditions && effect.conditions.length > 0 && (
                      <p className="text-body-xs text-color-text-tertiary mt-space-1">
                        Conditions: {effect.conditions.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocks */}
            {selectedSkill.unlocks.length > 0 && (
              <div>
                <h5 className="text-body-sm font-medium text-color-text-primary mb-space-2">
                  Unlocks:
                </h5>
                <div className="flex flex-wrap gap-space-2">
                  {selectedSkill.unlocks.map((unlockId) => (
                    <Badge key={unlockId} variant="outline" className="text-xs">
                      {unlockId.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available Routes */}
            <div>
              <h5 className="text-body-sm font-medium text-color-text-primary mb-space-2">
                Available in Routes:
              </h5>
              <div className="flex flex-wrap gap-space-2">
                {selectedSkill.availableInRoutes.map((route) => (
                  <Badge key={route} variant="info" className="text-xs">
                    {route}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setSelectedSkill(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
