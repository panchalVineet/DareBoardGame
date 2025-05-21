// src/app/play/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext'; 
import { Board } from '@/components/game/Board';
import { Dice } from '@/components/game/Dice';
import { DareDisplay } from '@/components/game/DareDisplay';
import { GameControls } from '@/components/game/GameControls';
import { AppHeader } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GamePieceIcon } from '@/components/icons/player-pieces';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

function GamePageContent() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (state.gameStatus === 'setup' && state.players.length === 0) {
      // If game not set up (e.g. direct navigation or refresh on play page), redirect to setup
      router.replace('/');
    }
  }, [state.gameStatus, state.players, router]);
  
  // Ensure client-side rendering for useEffect and context access
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient || (state.gameStatus === 'setup' && state.players.length === 0)) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex items-center justify-center p-4">
          <p className="text-xl text-muted-foreground">Loading game or redirecting to setup...</p>
        </main>
      </div>
    );
  }
  
  const currentPlayer = state.players[state.currentPlayerIndex];

  const handleDiceRoll = (value: number) => {
    const playerIndexAtRoll = state.currentPlayerIndex; // Capture current player index at time of roll
    dispatch({ type: 'ROLL_DICE', value });
    
    // Auto-move player after roll.
    setTimeout(() => {
      // Pass the actual roll value and the index of the player who rolled
      dispatch({ type: 'MOVE_PLAYER', rollValue: value, playerIndex: playerIndexAtRoll }); 
      
      // Check for game end condition after state update (might need another useEffect for this)
      // For simplicity, direct check is okay but less reactive
      const movedPlayer = state.players[playerIndexAtRoll]; // Re-access state, or better, derive from new state in reducer
      if (movedPlayer && movedPlayer.position === state.boardSize - 1) {
        // WIN CONDITION - This check might be slightly off if state hasn't updated yet from MOVE_PLAYER
        // dispatch({ type: 'END_GAME' }); 
        // alert(`${movedPlayer.name} has reached the end and wins!`);
      }
    }, 300); // Short delay for effect
  };

  const handleNextTurn = () => {
    if (state.diceValue !== null) { // Only allow next turn if current player has rolled
      dispatch({ type: 'NEXT_TURN' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column: Player Info & Controls (on larger screens) */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            {currentPlayer && (
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-primary flex items-center">
                    <GamePieceIcon Icon={currentPlayer.piece.Icon} colorClass={currentPlayer.piece.colorClass} size={8} className="mr-3"/>
                    {currentPlayer.name}'s Turn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">Position: <span className="font-semibold">{currentPlayer.position + 1}</span> / {state.boardSize}</p>
                  <p className="text-lg">Sips Taken: <span className="font-semibold">{currentPlayer.sipsTaken}</span></p>
                </CardContent>
              </Card>
            )}

            <Dice onRoll={handleDiceRoll} disabled={state.diceValue !== null || !currentPlayer} />
            <DareDisplay dare={state.currentDare} />
            <GameControls 
              canRoll={state.diceValue === null && !!currentPlayer} 
              onNextTurn={handleNextTurn} 
            />
          </div>

          {/* Middle Column: Game Board */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto"> {/* Max width for the board container */}
              <Board />
            </div>
          </div>
          
          {/* Right Column: All Players List (optional, or combined with left) */}
           <div className="lg:col-span-3 order-first lg:order-none pt-4 lg:pt-0"> {/* Display all players info at the top on mobile */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center lg:text-left">Players</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[100px] lg:h-[150px]"> {/* Adjust height as needed */}
                  <ul className="space-y-2">
                    {state.players.map((p, index) => (
                      <li key={p.id} className={`p-2 rounded-md flex items-center justify-between ${index === state.currentPlayerIndex ? 'bg-primary/20 ring-2 ring-primary' : 'bg-background'}`}>
                        <div className="flex items-center space-x-2">
                          <GamePieceIcon Icon={p.piece.Icon} colorClass={p.piece.colorClass} size={5} />
                          <span className={`font-medium ${index === state.currentPlayerIndex ? 'text-primary' : 'text-foreground'}`}>{p.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Pos: {p.position + 1}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            <Separator className="my-4 lg:hidden"/> {/* Separator for mobile view */}
          </div>


        </div>
      </main>
    </div>
  );
}


export default function PlayPage() {
  return <GamePageContent />;
}
