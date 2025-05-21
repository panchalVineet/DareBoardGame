// src/components/game/Board.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Cell } from './Cell';
import { PlayerPiece } from './PlayerPiece';
import type { Player } from '@/types';

const GRID_SIZE = 10; // 10x10 board

export const Board: React.FC = () => {
  const { state } = useGame();
  const { players, boardSize } = state;
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0); // Dynamically calculate cell size

  useEffect(() => {
    const calculateCellSize = () => {
      if (boardRef.current) {
        const style = window.getComputedStyle(boardRef.current);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
        
        // clientWidth includes padding but excludes border.
        // The grid cells are laid out in the content-box area.
        const contentBoxWidth = boardRef.current.clientWidth - paddingLeft - paddingRight;
        setCellSize(contentBoxWidth / GRID_SIZE);
      }
    };

    calculateCellSize();
    // Debounce resize listener or use ResizeObserver for performance if needed
    const handleResize = () => calculateCellSize();
    window.addEventListener('resize', handleResize);
    
    // Call again in case of late layout shifts
    const timeoutId = setTimeout(calculateCellSize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    }
  }, []);
  
  if (players.length === 0 && state.gameStatus === 'setup') {
     return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Setting up the game...
      </div>
    );
  }
  
  if (players.length === 0 && state.gameStatus !== 'setup') {
     return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No players in the game. Please set up a new game.
      </div>
    );
  }


  const cells = Array.from({ length: boardSize }, (_, i) => i);

  return (
    <div 
      ref={boardRef}
      className="relative w-full aspect-square bg-background shadow-xl rounded-lg border-4 border-primary p-1" // p-1 creates the padding
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        gap: '1px', // Creates thin lines between cells if cells have background
      }}
    >
      {cells.map((cellIndex) => {
        // For visual cell numbering, serpentine logic could be added here too if needed
        const cellNumber = cellIndex + 1; 
        const row = Math.floor(cellIndex / GRID_SIZE);
        return (
          <Cell key={cellIndex} cellNumber={cellNumber} isEvenRow={row % 2 === 0}>
            {/* Player pieces are rendered separately and positioned absolutely */}
          </Cell>
        );
      })}
      {/* Render player pieces on top of the grid */}
      {cellSize > 0 && players.map((player: Player) => (
        <PlayerPiece key={player.id} player={player} cellSize={cellSize} boardRef={boardRef} />
      ))}
    </div>
  );
};
