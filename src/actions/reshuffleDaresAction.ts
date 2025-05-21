// src/actions/reshuffleDaresAction.ts
"use server";

import { reshuffleDares as reshuffleDaresFlow, type ReshuffleDaresInput } from '@/ai/flows/dare-reshuffle';

export async function reshuffleDaresAction(currentDares: ReshuffleDaresInput): Promise<string[] | { error: string }> {
  try {
    console.log("Attempting to reshuffle dares:", currentDares.slice(0, 5)); // Log first 5 for brevity
    const newDares = await reshuffleDaresFlow(currentDares);
    console.log("Dares reshuffled successfully:", newDares.slice(0, 5));
    return newDares;
  } catch (error) {
    console.error("Error reshuffling dares:", error);
    // Check if error is an instance of Error and has a message property
    if (error instanceof Error) {
      return { error: `Failed to reshuffle dares: ${error.message}` };
    }
    return { error: "Failed to reshuffle dares due to an unknown error." };
  }
}
