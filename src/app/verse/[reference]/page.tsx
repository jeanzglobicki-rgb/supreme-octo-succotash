'use client';

import { useParams, useRouter } from 'next/navigation';
import { allVerses, type Verse } from '@/lib/verses';
import Header from '@/components/layout/header';
import VerseCard from '@/components/verse/verse-card';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

function findVerseByReference(ref: string): Verse | undefined {
  const decodedRef = ref.replace(/-/g, ' ');
  return allVerses.find((v) => v.reference.toLowerCase() === decodedRef.toLowerCase());
}

export default function VersePage() {
  const router = useRouter();
  const params = useParams();
  const { reference } = params;
  const [verse, setVerse] = useState<Verse | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof reference === 'string' && reference) {
      const foundVerse = findVerseByReference(reference.replace(/ /g, '-'));
      setVerse(foundVerse);
    }
    setLoading(false);
  }, [reference]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {loading ? (
             <Card className="w-full shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
             </Card>
          ) : verse ? (
            <VerseCard verse={verse} />
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Verse Not Found</h2>
              <p className="text-muted-foreground">The verse you are looking for could not be found.</p>
            </div>
          )}
          <div className="flex justify-center">
            <Button size="lg" onClick={() => router.push('/')} className="font-headline">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
