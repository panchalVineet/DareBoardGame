// src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGame } from '@/contexts/GameContext';
import { PLAYER_PIECE_OPTIONS, GamePieceIcon, getPieceConfigByName } from '@/components/icons/player-pieces';
import type { Player, PlayerPieceConfig } from '@/types';
import { INITIAL_DARES } from '@/constants/dares';
import { AppHeader } from '@/components/layout/Header';
import { Dices } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const { dispatch } = useGame(); // Assuming GameProvider is in RootLayout or a higher component for setup too. If not, this context usage might need adjustment or game setup might pass data via router. For simplicity, this assumes context is available.

  const [numPlayers, setNumPlayers] = useState(3);
  const [playerDetails, setPlayerDetails] = useState<Array<{ name: string; pieceName: string }>>([]);
  const [availablePieces, setAvailablePieces] = useState<PlayerPieceConfig[]>(PLAYER_PIECE_OPTIONS);

  useEffect(() => {
    // Initialize player details array based on numPlayers
    setPlayerDetails(
      Array(numPlayers)
        .fill(null)
        .map((_, i) => ({ name: `Player ${i + 1}`, pieceName: PLAYER_PIECE_OPTIONS[i % PLAYER_PIECE_OPTIONS.length].name }))
    );
    // Reset available pieces when numPlayers changes, ensuring no conflicts if players reduce
    setAvailablePieces(PLAYER_PIECE_OPTIONS); 
  }, [numPlayers]);

  const handlePlayerDetailChange = (index: number, field: 'name' | 'pieceName', value: string) => {
    const newDetails = [...playerDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };

    if (field === 'pieceName') {
      // Update available pieces: remove newly selected, add back previously selected by this player slot
      const oldPieceName = playerDetails[index].pieceName;
      const newAvailable = PLAYER_PIECE_OPTIONS.filter(p => 
        !newDetails.some(pd => pd.pieceName === p.name && pd !== newDetails[index]) || p.name === value
      );
       // This logic for available pieces needs refinement to correctly handle deselection and reselection.
       // For now, it's simplified: just ensure a piece isn't selected by multiple players.
    }
    setPlayerDetails(newDetails);
  };
  
  const handlePieceSelection = (playerIndex: number, newPieceName: string) => {
    const newDetails = [...playerDetails];
    const oldPieceNameForThisPlayer = newDetails[playerIndex].pieceName;
    
    // Check if the new piece is already selected by another player
    const isPieceTakenByOther = newDetails.some((pd, i) => i !== playerIndex && pd.pieceName === newPieceName);
    if (isPieceTakenByOther) {
      // Optionally, show a toast message here: "Piece already taken!"
      return; 
    }

    newDetails[playerIndex].pieceName = newPieceName;
    setPlayerDetails(newDetails);
  };


  const startGame = () => {
    const players: Player[] = playerDetails.map((detail, i) => {
      const pieceConfig = getPieceConfigByName(detail.pieceName) || PLAYER_PIECE_OPTIONS[i % PLAYER_PIECE_OPTIONS.length];
      return {
        id: `player-${i + 1}-${Date.now()}`,
        name: detail.name || `Player ${i + 1}`,
        piece: pieceConfig,
        position: 0, // Start at cell 0
        sipsTaken: 0,
      };
    });

    dispatch({ type: 'SETUP_GAME', players, dares: INITIAL_DARES });
    router.push('/play');
  };

  // Ensure client-side rendering for useState and useEffect
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      <AppHeader />
      <main className="container mx-auto p-4 flex-grow flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <Dices className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-4xl font-bold">Game Setup</CardTitle>
            <CardDescription className="text-lg">Configure your Drunk Steps adventure!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="numPlayers" className="text-lg">Number of Players (3-10)</Label>
              <Select
                value={String(numPlayers)}
                onValueChange={(value) => setNumPlayers(Number(value))}
              >
                <SelectTrigger id="numPlayers" className="w-full text-base">
                  <SelectValue placeholder="Select number of players" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 3).map(n => (
                    <SelectItem key={n} value={String(n)} className="text-base">{n} Players</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {playerDetails.map((player, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg bg-card/50 shadow">
                <h3 className="text-xl font-semibold text-primary">Player {index + 1}</h3>
                <div className="space-y-1">
                  <Label htmlFor={`playerName-${index}`} className="text-md">Name</Label>
                  <Input
                    id={`playerName-${index}`}
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerDetailChange(index, 'name', e.target.value)}
                    placeholder={`Enter Player ${index + 1}'s Name`}
                    className="text-base"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`playerPiece-${index}`} className="text-md">Piece</Label>
                  <Select
                    value={player.pieceName}
                    onValueChange={(value) => handlePieceSelection(index, value)}
                  >
                    <SelectTrigger id={`playerPiece-${index}`} className="w-full text-base">
                       {player.pieceName ? (
                        <div className="flex items-center gap-2">
                          <GamePieceIcon Icon={getPieceConfigByName(player.pieceName)?.Icon!} colorClass={getPieceConfigByName(player.pieceName)?.colorClass!} size={4} />
                          <span>{player.pieceName}</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a piece" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {PLAYER_PIECE_OPTIONS.map(p => (
                        <SelectItem key={p.name} value={p.name} className="text-base" disabled={playerDetails.some((pd, i) => i !== index && pd.pieceName === p.name)}>
                          <div className="flex items-center gap-2">
                            <GamePieceIcon Icon={p.Icon} colorClass={p.colorClass} size={4}/>
                            <span>{p.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={startGame} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Game!
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
