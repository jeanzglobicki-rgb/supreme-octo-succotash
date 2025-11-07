'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InterstitialAdProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdClosed: () => void;
}

export default function InterstitialAd({ open, onOpenChange, onAdClosed }: InterstitialAdProps) {
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      setShowCloseButton(false);
      timer = setTimeout(() => {
        setShowCloseButton(true);
      }, 2500); // Show close button after 2.5 seconds
    }
    return () => clearTimeout(timer);
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
    onAdClosed();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 bg-black w-screen h-screen max-w-full sm:max-w-full max-h-full sm:max-h-full flex flex-col items-center justify-center gap-0 sm:rounded-none">
        <div className="absolute top-4 right-4 z-20">
          {showCloseButton && (
            <Button
              variant="secondary"
              size="icon"
              onClick={handleClose}
              className="rounded-full h-8 w-8"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close ad</span>
            </Button>
          )}
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
          <h2 className="text-4xl font-bold font-headline mb-4">Interstitial Ad</h2>
          <p className="text-lg text-muted-foreground">Your content will resume shortly.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
