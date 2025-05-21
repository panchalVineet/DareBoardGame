// src/contexts/GameContext.tsx
"use client";

import type { GameState, GameAction, Player } from '@/types';
import React, { createContext, useReducer, useContext, type ReactNode } from 'react';
import { INITIAL_DARES, BOARD_SIZE } from '@/constants/dares';

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  diceValue: null,
  currentDare: null,
  dares: [...INITIAL_DARES],
  gameStatus: 'setup',
  boardSize: BOARD_SIZE,
  isLoadingAi: false,
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SETUP_GAME':
      console.log("SETUP_GAME action dispatched", action.players);
      return {
        ...initialState, // Reset to initial state first
        players: action.players,
        dares: action.dares, // Use provided dares, could be reshuffled
        gameStatus: 'playing',
        currentPlayerIndex: 0,
        diceValue: null,
        currentDare: null, // Initial dare is null until first move
      };
    case 'ROLL_DICE': {
      const currentPlayer = state.players[state.currentPlayerIndex];
      console.log(`ROLL_DICE: Player ${currentPlayer?.name} (index ${state.currentPlayerIndex}) rolled ${action.value}`);
      return {
        ...state,
        diceValue: action.value,
        lastRollByPlayerId: currentPlayer?.id,
      };
    }
    case 'MOVE_PLAYER': {
      if (action.rollValue === undefined || action.rollValue === null || action.rollValue <= 0) {
        console.warn("MOVE_PLAYER: Invalid rollValue received:", action.rollValue);
        return state;
      }
      if (action.playerIndex === undefined || action.playerIndex < 0 || action.playerIndex >= state.players.length) {
        console.warn("MOVE_PLAYER: Invalid playerIndex received:", action.playerIndex, "Players length:", state.players.length);
        return state;
      }

      const newPlayers = state.players.map((player, index) => {
        if (index === action.playerIndex) {
          const oldPosition = player.position;
          let newPosition = oldPosition + action.rollValue;

          if (newPosition >= state.boardSize) {
            newPosition = state.boardSize - 1; // Land on the last cell if overshoot
          }
          console.log(`MOVE_PLAYER: Player ${player.name} (index ${index}) moving from ${oldPosition} to ${newPosition} (rolled: ${action.rollValue})`);
          return { ...player, position: newPosition };
        }
        return player;
      });
      
      const movedPlayer = newPlayers[action.playerIndex];
      let updatedCurrentDare = state.currentDare;

      // Update the dare if the player who moved is the current player.
      // This ensures the dare displayed matches the square the active player just landed on.
      if (action.playerIndex === state.currentPlayerIndex && movedPlayer) {
        updatedCurrentDare = state.dares[movedPlayer.position] || "No dare here! You're safe... for now.";
        console.log(`MOVE_PLAYER: Dare for ${movedPlayer.name} at new position ${movedPlayer.position}: ${updatedCurrentDare}`);
      }
      
      return {
        ...state,
        players: newPlayers,
        currentDare: updatedCurrentDare,
      };
    }
    case 'SET_CURRENT_DARE': // This might be redundant if MOVE_PLAYER handles it
      return { ...state, currentDare: action.dare };
    case 'NEXT_TURN': {
      if (state.players.length === 0) return state; // Prevent error if no players
      const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const nextPlayer = state.players[nextPlayerIndex];
      const dareForNextPlayer = nextPlayer ? (state.dares[nextPlayer.position] || "No dare here! You're safe... for now.") : null;
      console.log(`NEXT_TURN: Moving to player ${nextPlayer?.name} (index ${nextPlayerIndex}). Dare: ${dareForNextPlayer}`);
      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        diceValue: null, // Reset dice display/state for next player
        currentDare: dareForNextPlayer,
        lastRollByPlayerId: undefined,
      };
    }
    case 'RESHUFFLE_DARES_START':
      return { ...state, isLoadingAi: true };
    case 'RESHUFFLE_DARES_SUCCESS':
      const currentPlayerAfterReshuffle = state.players[state.currentPlayerIndex];
      const dareForCurrentPlayerAfterReshuffle = currentPlayerAfterReshuffle ? (action.newDares[currentPlayerAfterReshuffle.position] || "Dare reshuffled! What's next?") : null;
      return {
        ...state,
        dares: action.newDares,
        currentDare: state.gameStatus === 'playing' ? dareForCurrentPlayerAfterReshuffle : state.currentDare,
        isLoadingAi: false,
      };
    case 'RESHUFFLE_DARES_FAILURE':
      return { ...state, isLoadingAi: false };
    case 'END_GAME':
      return { ...state, gameStatus: 'finished' };
    case 'RESET_GAME':
      console.log("RESET_GAME action dispatched");
      return {
        ...initialState,
        dares: [...INITIAL_DARES] 
      };
    default:
      return state;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
