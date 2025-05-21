// src/types/index.ts
import type { LucideIcon } from 'lucide-react';

export interface PlayerPieceConfig {
  Icon: LucideIcon;
  colorClass: string; // e.g., "text-red-500 fill-red-500/30"
  name: string;
}

export interface Player {
  id: string;
  name: string;
  piece: PlayerPieceConfig;
  position: number; // 0-99 for cell index
  sipsTaken: number; // Example score
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  currentDare: string | null;
  dares: string[]; // Full list of dares, potentially reshuffled
  gameStatus: 'setup' | 'playing' | 'finished';
  boardSize: number;
  isLoadingAi: boolean;
  lastRollByPlayerId?: string; // To show which player's roll resulted in the current diceValue
}

export type GameAction =
  | { type: 'SETUP_GAME'; players: Player[]; dares: string[] }
  | { type: 'ROLL_DICE'; value: number }
  | { type: 'MOVE_PLAYER'; rollValue: number; playerIndex: number } // Added playerIndex
  | { type: 'SET_CURRENT_DARE'; dare: string | null }
  | { type: 'NEXT_TURN' }
  | { type: 'RESHUFFLE_DARES_START' }
  | { type: 'RESHUFFLE_DARES_SUCCESS'; newDares: string[] }
  | { type: 'RESHUFFLE_DARES_FAILURE' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' };

// Cell state can be simple for now, primarily for rendering
export interface CellState {
  id: number; // 0-99
  dare: string;
}
