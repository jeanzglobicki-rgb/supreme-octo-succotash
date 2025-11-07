'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/hooks/use-app';
import { Heart, Trash2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface FavoritesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FavoritesSheet({ open, onOpenChange }: FavoritesSheetProps) {
  const { favorites, toggleFavorite, favoritesLoading } = useApp();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Favorite Verses
          </SheetTitle>
          <SheetDescription>
            Your collection of saved scriptures for reflection and encouragement.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            {favoritesLoading ? (
                 <div className="space-y-4 py-4">
                    <div className="p-4 border rounded-lg space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                     <div className="p-4 border rounded-lg space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                 </div>
            ) : favorites.length > 0 ? (
              <div className="space-y-4 py-4">
                {favorites.map((verse) => (
                  <div key={verse.reference} className="group relative p-4 border rounded-lg bg-card/50 hover:bg-card transition-colors">
                    <p className="font-body text-base mb-2">"{verse.text}"</p>
                    <p className="font-headline text-sm text-primary font-semibold">{verse.reference}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toggleFavorite(verse)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove favorite</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-semibold">No favorites yet</p>
                <p className="text-sm text-muted-foreground">
                  Tap the heart icon on a verse to save it here.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
        <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Close
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
