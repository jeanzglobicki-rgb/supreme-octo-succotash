import {NextRequest, NextResponse} from 'next/server';
import {run} from '@genkit-ai/next';
import { generateReflectionFlow } from '@/ai/flows/reflection';

export async function POST(req: NextRequest) {
  const { verse } = await req.json();

  if (!verse || typeof verse !== 'string') {
    return NextResponse.json({ error: 'Verse is required.' }, { status: 400 });
  }

  try {
    const reflection = await run(generateReflectionFlow, { verse });
    return NextResponse.json({ reflection });
  } catch (error) {
    console.error('Error generating reflection:', error);
    return NextResponse.json({ error: 'Failed to generate reflection.' }, { status: 500 });
  }
}
