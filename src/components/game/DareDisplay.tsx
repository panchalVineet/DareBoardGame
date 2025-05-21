// src/components/game/DareDisplay.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface DareDisplayProps {
  dare: string | null;
}

export const DareDisplay: React.FC<DareDisplayProps> = ({ dare }) => {
  return (
    <Card className="w-full shadow-lg bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-2xl text-accent">
          <Target className="mr-2 h-7 w-7" /> Dare Time!
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dare ? (
          <p className="text-lg text-foreground min-h-[60px] flex items-center justify-center text-center p-2 bg-background rounded-md shadow-inner">
            {dare}
          </p>
        ) : (
          <p className="text-lg text-muted-foreground min-h-[60px] flex items-center justify-center text-center p-2 bg-background rounded-md shadow-inner">
            Roll the dice to get your dare!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
