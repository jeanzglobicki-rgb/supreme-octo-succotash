'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const generateReflectionFlow = ai.defineFlow(
  {
    name: 'generateReflectionFlow',
    inputSchema: z.object({ verse: z.string() }),
    outputSchema: z.string(),
  },
  async ({ verse }) => {
    const llmResponse = await ai.generate({
        prompt: `Write a short, insightful, and encouraging reflection on the following Bible verse. The reflection should be about 3-4 sentences long and suitable for a daily devotional app. Verse: "${verse}"`,
        model: 'googleai/gemini-2.5-flash',
    });
    return llmResponse.text;
  }
);
