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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Heart, Share2, Copy, BookOpen, MessageCircle, Twitter } from 'lucide-react';
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

  const shareText = `"${verse.text}" - ${verse.reference}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    toast({
      title: 'Copied to clipboard!',
      description: verse.reference,
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Script Verse',
          text: shareText,
        });
      } catch (error) {
        console.log('Share dismissed:', error);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Share not supported',
        description: 'Your browser does not support native sharing. Verse copied instead.',
      });
      handleCopy();
    }
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
              <DropdownMenuItem asChild>
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Twitter className="mr-2 h-4 w-4" />
                  <span>Share on X</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                 <button onClick={handleShare} className="flex items-center w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Share via...</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
