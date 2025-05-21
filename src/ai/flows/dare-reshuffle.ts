// src/ai/flows/dare-reshuffle.ts
'use server';
/**
 * @fileOverview This file contains the AI Dare Reshuffle flow, which uses Genkit to reshuffle the order of dares.
 *
 * @remarks
 *   - reshuffleDares - A function that reshuffles the dares.
 *   - ReshuffleDaresInput - The input type for the reshuffleDares function.
 *   - ReshuffleDaresOutput - The return type for the reshuffleDares function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReshuffleDaresInputSchema = z.array(z.string()).describe('An array of dares to reshuffle.');
export type ReshuffleDaresInput = z.infer<typeof ReshuffleDaresInputSchema>;

const ReshuffleDaresOutputSchema = z.array(z.string()).describe('An array of reshuffled dares.');
export type ReshuffleDaresOutput = z.infer<typeof ReshuffleDaresOutputSchema>;

export async function reshuffleDares(dares: ReshuffleDaresInput): Promise<ReshuffleDaresOutput> {
  return reshuffleDaresFlow(dares);
}

const reshuffleDaresPrompt = ai.definePrompt({
  name: 'reshuffleDaresPrompt',
  input: {schema: ReshuffleDaresInputSchema},
  output: {schema: ReshuffleDaresOutputSchema},
  prompt: `You are a game designer who wants to create interesting drinking games.
Given the list of dares, please reshuffle them to ensure they are not predictable and the game stays fun and dynamic.

Dares:
{{#each this}}
- {{this}}
{{/each}}
`,
});

const reshuffleDaresFlow = ai.defineFlow(
  {
    name: 'reshuffleDaresFlow',
    inputSchema: ReshuffleDaresInputSchema,
    outputSchema: ReshuffleDaresOutputSchema,
  },
  async dares => {
    const {output} = await reshuffleDaresPrompt(dares);
    return output!;
  }
);
