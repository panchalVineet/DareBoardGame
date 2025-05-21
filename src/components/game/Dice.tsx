
// src/components/game/Dice.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Dices, User, Zap } from 'lucide-react'; // Using Dices icon from Lucide, Zap as a generic "action" icon
import { GamePieceIcon } from '@/components/icons/player-pieces';

interface DiceProps {
  onRoll: (value: number) => void;
  disabled: boolean;
}

export const Dice: React.FC<DiceProps> = ({ onRoll, disabled }) => {
  const { state } = useGame();
  const { diceValue, players, currentPlayerIndex, lastRollByPlayerId } = state;
  const [isRolling, setIsRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number | null>(diceValue);

  const currentPlayer = players[currentPlayerIndex];
  const playerWhoseRollIsShown = lastRollByPlayerId ? players.find(p => p.id === lastRollByPlayerId) : currentPlayer;

  useEffect(() => {
    setDisplayValue(diceValue);
  }, [diceValue]);

  const rollAction = () => {
    if (disabled || isRolling) return;
    setIsRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) { // Simulate rolling for a bit
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDisplayValue(finalValue);
        onRoll(finalValue);
        setIsRolling(false);
      }
    }, 50);
  };

  const NumberDisplay = ({ value }: { value: number | null }) => {
    if (value === null) return <Zap className="h-16 w-16 text-muted-foreground" />; // Placeholder icon
    
    return (
      <span className={`text-7xl font-bold ${isRolling ? 'animate-dice-roll' : ''} text-foreground`}>
        {value}
      </span>
    );
  };


  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-xl shadow-lg w-full">
      <div className="flex items-center space-x-2 text-lg font-semibold text-muted-foreground">
        {playerWhoseRollIsShown ? (
          <>
            <GamePieceIcon Icon={playerWhoseRollIsShown.piece.Icon} colorClass={playerWhoseRollIsShown.piece.colorClass} size={6} />
            <span>{lastRollByPlayerId && playerWhoseRollIsShown.id !== currentPlayer?.id ? `${playerWhoseRollIsShown.name}'s roll:` : `Current Roll:`}</span>
          </>
        ) : (
          <User className="h-6 w-6" />
        )}
      </div>
      
      <div className="h-24 w-24 flex items-center justify-center rounded-lg bg-background shadow-inner">
        <NumberDisplay value={displayValue} />
      </div>
      
      <Button 
        onClick={rollAction} 
        disabled={disabled || isRolling || diceValue !== null} // Disable if already rolled for the turn
        className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Dices className="mr-2 h-5 w-5" />
        {isRolling ? 'Rolling...' : (diceValue !== null ? 'Rolled!' : 'Roll Action')}
      </Button>
    </div>
  );
};
