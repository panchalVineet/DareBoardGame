// src/components/game/PlayerPiece.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import type { Player } from '@/types';
import { GamePieceIcon } from '@/components/icons/player-pieces';

const GRID_SIZE = 10; // Should match Board's GRID_SIZE

interface PlayerPieceProps {
  player: Player;
  cellSize: number; // in pixels, for calculating position
  boardRef: React.RefObject<HTMLDivElement>; // Reference to the board for position calculation
}

export const PlayerPiece: React.FC<PlayerPieceProps> = ({ player, cellSize, boardRef }) => {
  const [positionStyle, setPositionStyle] = useState({ top: 0, left: 0, opacity: 0 });
  const pieceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current && cellSize > 0) {
      const boardStyle = window.getComputedStyle(boardRef.current);
      const paddingLeft = parseFloat(boardStyle.paddingLeft);
      const paddingTop = parseFloat(boardStyle.paddingTop);

      const cellIndex = player.position;
      
      const row = Math.floor(cellIndex / GRID_SIZE);
      let col = cellIndex % GRID_SIZE;

      // Implement serpentine movement:
      // Even rows (0, 2, 4...) go left-to-right
      // Odd rows (1, 3, 5...) go right-to-left
      if (row % 2 !== 0) {
        col = GRID_SIZE - 1 - col;
      }

      // Offset pieces within the same cell to avoid complete overlap
      // Make offset magnitude proportional to cellSize
      const offsetMagnitude = cellSize * 0.08; // e.g. 8% of cell size
      const playerIdHash = parseInt(player.id.slice(-2), 16) % 16; // Simple hash for varied offsets
      
      // Arrange up to 4 pieces in a 2x2 grid within the cell's center area
      const offsetsPerRowInCell = 2; // How many pieces side-by-side before next "row" of pieces in cell
      const pieceColInCell = playerIdHash % offsetsPerRowInCell;
      const pieceRowInCell = Math.floor(playerIdHash / offsetsPerRowInCell) % offsetsPerRowInCell; // Cap at 2 rows for 2x2

      // Calculate piece's own visual offset to center it within its calculated slot
      // Piece width/height is cellSize * 0.6
      const pieceVisualCenterOffset = (cellSize * (1 - 0.6)) / 2; // (cellSize - pieceSize) / 2 = 0.2 * cellSize

      // Calculate additional offset for staggering based on player ID
      // Spread pieces across the central part of the cell.
      // Example: for a 2x2 arrangement, use 4 quadrants.
      // Let's use a simpler x, y offset based on player ID to reduce overlap
      const staggerX = (pieceColInCell - (offsetsPerRowInCell -1) / 2) * offsetMagnitude; // Centers the group of pieces
      const staggerY = (pieceRowInCell - (offsetsPerRowInCell -1) / 2) * offsetMagnitude;


      const newLeft = paddingLeft + (col * cellSize) + pieceVisualCenterOffset + staggerX;
      const newTop = paddingTop + (row * cellSize) + pieceVisualCenterOffset + staggerY;

      setPositionStyle({ top: newTop, left: newLeft, opacity: 1 });
    }
  }, [player.position, cellSize, boardRef, player.id]);

  return (
    <div
      ref={pieceRef}
      className="absolute player-piece-move z-10 transition-opacity duration-300"
      style={{
        ...positionStyle,
        width: `${cellSize * 0.6}px`, // Piece size relative to cell size
        height: `${cellSize * 0.6}px`,
      }}
      title={player.name}
    >
      <GamePieceIcon
        Icon={player.piece.Icon}
        colorClass={player.piece.colorClass}
        className="w-full h-full drop-shadow-lg"
      />
    </div>
  );
};
