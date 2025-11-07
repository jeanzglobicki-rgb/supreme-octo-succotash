'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, AlertTriangle } from 'lucide-react';
import type { ReflectionResponse } from '@/ai/flows/reflection-flow';

interface VerseReflectionProps {
  reflection: ReflectionResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function VerseReflection({ reflection, isLoading, error }: VerseReflectionProps) {
  if (!reflection && !isLoading && !error) {
    return null; // Don't render anything if there's no data, no loading, and no error
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3 text-primary">
          <Sparkles className="h-6 w-6" />
          Reflection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        {reflection && (
          <p className="text-lg font-body text-foreground/90">
            {reflection.reflection}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
