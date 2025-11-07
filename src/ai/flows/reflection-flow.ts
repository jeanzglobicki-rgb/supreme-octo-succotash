'use server';
/**
 * @fileOverview A flow for generating a reflection on a Bible verse.
 *
 * - generateReflection - A function that calls the reflection generation flow.
 * - ReflectionRequest - The input type for the reflection flow.
 * - ReflectionResponse - The output type for the reflection flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReflectionRequestSchema = z.object({
  book: z.string().describe('The book of the Bible the verse is from.'),
  chapter: z.number().describe('The chapter of the book.'),
  verse: z.number().describe('The verse number.'),
  text: z.string().describe('The text of the Bible verse.'),
});
export type ReflectionRequest = z.infer<typeof ReflectionRequestSchema>;

const ReflectionResponseSchema = z.object({
  reflection: z
    .string()
    .describe('A short, insightful reflection on the provided Bible verse.'),
});
export type ReflectionResponse = z.infer<typeof ReflectionResponseSchema>;

export async function generateReflection(
  input: ReflectionRequest
): Promise<ReflectionResponse> {
  return reflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reflectionPrompt',
  input: { schema: ReflectionRequestSchema },
  output: { schema: ReflectionResponseSchema },
  prompt: `You are a thoughtful theologian providing a brief reflection on a Bible verse.
     The user has provided the following verse:
     Verse: {{{book}}} {{{chapter}}}:{{{verse}}} - "{{{text}}}"

     Please provide a short, insightful reflection (2-3 sentences) on its meaning and significance. Do not just rephrase the verse.`,
});

const reflectionFlow = ai.defineFlow(
  {
    name: 'reflectionFlow',
    inputSchema: ReflectionRequestSchema,
    outputSchema: ReflectionResponseSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
