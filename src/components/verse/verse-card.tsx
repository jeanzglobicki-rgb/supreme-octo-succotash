'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/hooks/use-app';
import type { Verse } from '@/lib/verses';
import { useUser } from '@/firebase';
import React from 'react';

interface VerseCardProps {
  verse: Verse;
}

export default function VerseCard({ verse }: VerseCardProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const isAuthenticated = !!user;
  const { toggleFavorite, isFavorite } = useApp();
  const isVerseFavorite = isFavorite(verse.reference);

  const handleShare = async () => {
    const verseRefUrl = verse.reference.replace(/\s+/g, '-').toLowerCase();
    const shareUrl = `${window.location.origin}/verse/${verseRefUrl}`;
    const shareText = `"${verse.text}" - ${verse.reference}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Script Verse',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // This can happen if the user cancels the share dialog.
        // We will not show an error toast in this case.
        console.log('Share dismissed or failed:', error);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({
        title: 'Link Copied',
        description: 'Sharing not supported, so we copied the verse and link to your clipboard.',
      });
    }
  };

  const handleFavoriteToggle = () => {
    if (isAuthenticated) {
      toggleFavorite(verse);
      toast({
        title: isVerseFavorite ? 'Removed from favorites' : 'Added to favorites',
        description: verse.reference,
      });
    } else {
        toast({
            variant: "destructive",
            title: "Sign in to save favorites",
            description: "Please create an account to save your favorite verses."
        });
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-3">
          {verse.reference}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-body leading-relaxed text-foreground/90">
          "{verse.text}"
        </p>
      </CardContent>
      <CardFooter className="flex justify-start items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            aria-label="Favorite"
            className="h-10 w-10"
          >
            <Heart className={`h-6 w-6 ${isVerseFavorite ? 'fill-red-500 text-red-500' : 'text-accent'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label="Share"
            className="h-10 w-10"
          >
            <Share2 className="h-6 w-6 text-accent" />
          </Button>
      </CardFooter>
    </Card>
  );
}
