// src/components/icons/player-pieces.tsx
import type { PlayerPieceConfig } from '@/types';
import {
  Circle,
  Square,
  Triangle,
  Star,
  Heart,
  Diamond,
  Moon,
  Sun,
  Cloud,
  Sprout,
  type LucideIcon,
} from 'lucide-react';

export const PLAYER_PIECE_OPTIONS: PlayerPieceConfig[] = [
  { Icon: Circle, colorClass: 'text-red-500 fill-red-500/30', name: 'Circle' },
  { Icon: Square, colorClass: 'text-blue-500 fill-blue-500/30', name: 'Square' },
  { Icon: Triangle, colorClass: 'text-green-500 fill-green-500/30', name: 'Triangle' },
  { Icon: Star, colorClass: 'text-yellow-500 fill-yellow-500/30', name: 'Star' },
  { Icon: Heart, colorClass: 'text-pink-500 fill-pink-500/30', name: 'Heart' },
  { Icon: Diamond, colorClass: 'text-purple-500 fill-purple-500/30', name: 'Diamond' },
  { Icon: Moon, colorClass: 'text-indigo-500 fill-indigo-500/30', name: 'Moon' },
  { Icon: Sun, colorClass: 'text-orange-500 fill-orange-500/30', name: 'Sun' },
  { Icon: Cloud, colorClass: 'text-cyan-500 fill-cyan-500/30', name: 'Cloud' },
  { Icon: Sprout, colorClass: 'text-lime-500 fill-lime-500/30', name: 'Sprout' },
];

// Helper to get a piece by its name or index
export const getPieceConfigByName = (name: string): PlayerPieceConfig | undefined =>
  PLAYER_PIECE_OPTIONS.find(p => p.name === name);

export const getPieceConfigByIndex = (index: number): PlayerPieceConfig =>
  PLAYER_PIECE_OPTIONS[index % PLAYER_PIECE_OPTIONS.length];

// Generic Piece Icon component
interface GamePieceIconProps {
  Icon: LucideIcon;
  colorClass: string;
  size?: number;
  className?: string;
}

export const GamePieceIcon: React.FC<GamePieceIconProps> = ({ Icon, colorClass, size = 6, className }) => {
  return <Icon className={`${colorClass} h-${size} w-${size} ${className}`} />;
};
