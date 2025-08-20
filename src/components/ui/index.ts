/**
 * UI Components Index
 * Exports all UI components for easy importing
 */

// Core UI Components
export { Button, type ButtonProps } from './Button';
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './Card';
export { Modal, type ModalProps } from './Modal';
export { Badge, type BadgeProps } from './Badge';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Toast, type ToastProps } from './Toast';

// Game-specific UI Components
export { RouteBadge, type RouteBadgeProps } from './RouteBadge';
export { ObjectiveList, type ObjectiveListProps, type Objective } from './ObjectiveList';
export { Countdown, type CountdownProps } from './Countdown';

// Quantum Magic UI Components
export { ArtifactCard, type ArtifactCardProps } from './ArtifactCard';
export { SkillTree, type SkillTreeProps } from './SkillTree';
export { DiscoveryModal, type DiscoveryModalProps } from './DiscoveryModal';

// Shadow Encounter UI Components
export { default as ShadowEntityDisplay } from './ShadowEntityDisplay';
export { default as ShadowEncounterLog } from './ShadowEncounterLog';

// Artifact Arc UI Components
export { default as ArtifactLoreViewer } from './ArtifactLoreViewer';
export { default as ArtifactBondDisplay } from './ArtifactBondDisplay';
export { default as ArtifactVisionViewer } from './ArtifactVisionViewer';
export { default as ArtifactJournal } from './ArtifactJournal';

// Utility functions
export { cn, focusRing, transition } from '../../utils/cn';
