'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ReflectionProps {
  verseText: string;
  verseReference: string;
}

export default function Reflection({ verseText, verseReference }: ReflectionProps) {
  const [reflection, setReflection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchReflection = async () => {
    if (reflection) {
      // Already fetched
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verse: `${verseText} (${verseReference})` }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reflection.');
      }

      const data = await response.json();
      setReflection(data.reflection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccordionToggle = (value: string) => {
    const newIsOpen = value === 'reflection-item';
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      fetchReflection();
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionToggle}>
      <AccordionItem value="reflection-item">
        <AccordionTrigger className="text-accent hover:text-primary data-[state=open]:text-primary font-headline [&[data-state=open]>svg]:text-primary">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Reflection
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
            {reflection && <p className="text-base font-body leading-relaxed">{reflection}</p>}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
