'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, Share2, Copy, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/hooks/use-app';
import type { Verse } from '@/lib/verses';
import Reflection from './reflection';

interface VerseCardProps {
  verse: Verse;
}

export default function VerseCard({ verse }: VerseCardProps) {
  const { toast } = useToast();
  const { isAuthenticated, toggleFavorite, isFavorite } = useApp();
  const isVerseFavorite = isFavorite(verse.reference);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${verse.text} - ${verse.reference}`);
    toast({
      title: 'Copied to clipboard!',
      description: verse.reference,
    });
  };
  
  const handleFavoriteToggle = () => {
    if (isAuthenticated) {
      toggleFavorite(verse);
      toast({
        title: isVerseFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: verse.reference,
      });
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          {verse.reference}
        </CardTitle>
        <CardDescription>King James Version</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-body leading-relaxed text-foreground/90">
          "{verse.text}"
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            disabled={!isAuthenticated}
            aria-label="Favorite"
          >
            <Heart className={`h-6 w-6 ${isVerseFavorite ? 'fill-red-500 text-red-500' : 'text-accent'}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share">
                <Share2 className="h-6 w-6 text-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Text</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isAuthenticated && (
          <Reflection verseText={verse.text} verseReference={verse.reference} />
        )}
      </CardFooter>
    </Card>
  );
}
