// src/components/game/Cell.tsx
import React from 'react';

interface CellProps {
  cellNumber: number; // 1-100
  isEvenRow: boolean;
  children?: React.ReactNode; // For player pieces
}

export const Cell: React.FC<CellProps> = ({ cellNumber, children }) => {
  // Basic styling, can be enhanced
  // Alternating colors for readability, or special styling for start/end cells
  const isStart = cellNumber === 1;
  const isEnd = cellNumber === 100;
  
  let bgColor = 'bg-card hover:bg-card/80';
  if (isStart) bgColor = 'bg-green-500/80 hover:bg-green-500/70';
  if (isEnd) bgColor = 'bg-yellow-500/80 hover:bg-yellow-500/70';
  
  // Simple alternating color for rows for visual distinction, could be more subtle
  // if (isEvenRow) {
  //   if (!isStart && !isEnd) bgColor = 'bg-secondary hover:bg-secondary/80';
  // }


  return (
    <div 
      className={`relative aspect-square border border-border/50 ${bgColor} flex items-center justify-center transition-colors duration-150 ease-in-out shadow-inner`}
      aria-label={`Cell ${cellNumber}`}
    >
      <span className="absolute top-1 left-1 text-xs text-muted-foreground font-mono">
        {cellNumber}
      </span>
      {/* Player pieces will be positioned absolutely within this cell or on top of it */}
      {children}
    </div>
  );
};
