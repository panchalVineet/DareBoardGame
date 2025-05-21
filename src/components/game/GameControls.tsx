// src/components/game/GameControls.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { reshuffleDaresAction } from '@/actions/reshuffleDaresAction';
import { useToast } from '@/hooks/use-toast';
import { RefreshCcw, SkipForward, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  canRoll: boolean; // True if current player hasn't rolled yet
  onNextTurn: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ canRoll, onNextTurn }) => {
  const { state, dispatch } = useGame();
  const { toast } = useToast();

  const handleReshuffleDares = async () => {
    dispatch({ type: 'RESHUFFLE_DARES_START' });
    try {
      const result = await reshuffleDaresAction(state.dares);
      if (Array.isArray(result)) {
        dispatch({ type: 'RESHUFFLE_DARES_SUCCESS', newDares: result });
        toast({ title: "Dares Reshuffled!", description: "The dares have been successfully reshuffled by AI.", variant: "default" });
      } else {
        // result has an error property
        dispatch({ type: 'RESHUFFLE_DARES_FAILURE' });
        toast({ title: "Reshuffle Failed", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      dispatch({ type: 'RESHUFFLE_DARES_FAILURE' });
      toast({ title: "Error", description: "An unexpected error occurred while reshuffling dares.", variant: "destructive" });
    }
  };
  
  const handleResetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    // Potentially navigate back to setup page
    // For now, it just resets the state. User would need to re-setup.
    // import { useRouter } from 'next/navigation';
    // const router = useRouter(); router.push('/');
    toast({ title: "Game Reset", description: "The game has been reset. Please set up a new game.", variant: "default" });
  };


  return (
    <div className="space-y-3 p-4 bg-card rounded-xl shadow-lg w-full">
      <Button 
        onClick={onNextTurn} 
        disabled={canRoll || state.players.length === 0} // Disabled if player can still roll (i.e., hasn't rolled) or no players
        className="w-full text-md py-2.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        <SkipForward className="mr-2 h-5 w-5" />
        Next Turn
      </Button>
      <Button 
        onClick={handleReshuffleDares} 
        disabled={state.isLoadingAi}
        variant="outline"
        className="w-full text-md py-2.5 border-accent text-accent hover:bg-accent/10"
      >
        <RefreshCcw className="mr-2 h-5 w-5" /> 
        {state.isLoadingAi ? 'Reshuffling...' : 'Reshuffle Dares (AI)'}
      </Button>
       <Button 
        onClick={handleResetGame}
        variant="destructive"
        className="w-full text-md py-2.5"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Reset Game
      </Button>
    </div>
  );
};
