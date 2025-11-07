// src/ai/ai-verse-reflection.ts
'use server';
/**
 * @fileOverview This file contains the AI-powered verse reflection flow.
 *
 * It takes a Bible verse as input and returns an AI-generated reflection or explanation of the verse.
 *
 * @interface AiVerseReflectionInput - Defines the input schema for the flow.
 * @interface AiVerseReflectionOutput - Defines the output schema for the flow.
 * @function aiVerseReflection - The main function to generate AI-powered verse reflections.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiVerseReflectionInputSchema = z.object({
  verseText: z.string().describe('The Bible verse text to generate a reflection for.'),
});

export type AiVerseReflectionInput = z.infer<typeof AiVerseReflectionInputSchema>;

const AiVerseReflectionOutputSchema = z.object({
  reflection: z.string().describe('The AI-generated reflection or explanation of the verse.'),
});

export type AiVerseReflectionOutput = z.infer<typeof AiVerseReflectionOutputSchema>;

export async function aiVerseReflection(input: AiVerseReflectionInput): Promise<AiVerseReflectionOutput> {
  return aiVerseReflectionFlow(input);
}

const aiVerseReflectionPrompt = ai.definePrompt({
  name: 'aiVerseReflectionPrompt',
  input: {schema: AiVerseReflectionInputSchema},
  output: {schema: AiVerseReflectionOutputSchema},
  prompt: `You are a helpful assistant that provides insightful and meaningful reflections on Bible verses.

  Please provide a reflection or explanation for the following verse:

  {{verseText}}

  The reflection should be suitable for a daily devotional and help the reader understand the verse's meaning and context.
  The reflection should be between 50 and 100 words.
  `,
});

const aiVerseReflectionFlow = ai.defineFlow(
  {
    name: 'aiVerseReflectionFlow',
    inputSchema: AiVerseReflectionInputSchema,
    outputSchema: AiVerseReflectionOutputSchema,
  },
  async input => {
    const {output} = await aiVerseReflectionPrompt(input);
    return output!;
  }
);
