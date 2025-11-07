'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDailyVerse, getRandomVerse, type Verse } from '@/lib/verses';
import Header from '@/components/layout/header';
import VerseCard from '@/components/verse/verse-card';
import AdBanner from '@/components/ads/ad-banner';
import InterstitialAd from '@/components/ads/interstitial-ad';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { useUser } from '@/firebase';

const INTERSTITIAL_AD_FREQUENCY = 3;

export default function Home() {
  const { user } = useUser();
  const isAuthenticated = !!user;
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isDaily, setIsDaily] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [randomClickCount, setRandomClickCount] = useState(0);

  useEffect(() => {
    setCurrentVerse(getDailyVerse());
  }, []);

  const handleGetRandomVerse = useCallback(() => {
    if (!isAuthenticated) {
      // Optionally trigger sign-in flow
      return;
    }
    const newCount = randomClickCount + 1;
    setRandomClickCount(newCount);

    if (newCount % INTERSTITIAL_AD_FREQUENCY === 0) {
      setShowInterstitial(true);
    } else {
      setCurrentVerse(getRandomVerse());
      setIsDaily(false);
    }
  }, [randomClickCount, isAuthenticated]);

  const handleShowDailyVerse = () => {
    setCurrentVerse(getDailyVerse());
    setIsDaily(true);
  };

  const handleInterstitialClose = () => {
    setShowInterstitial(false);
    setCurrentVerse(getRandomVerse());
    setIsDaily(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {currentVerse && <VerseCard key={currentVerse.reference} verse={currentVerse} />}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetRandomVerse}
              disabled={!isAuthenticated}
              className="w-full sm:w-auto font-headline"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Get a Random Verse
            </Button>
            {!isDaily && (
              <Button size="lg" variant="outline" onClick={handleShowDailyVerse} className="w-full sm:w-auto font-headline">
                Back to Daily Verse
              </Button>
            )}
          </div>
          {!isAuthenticated && <p className="text-center text-muted-foreground">Sign in to enable random verses and favorites.</p>}
        </div>
      </main>
      <AdBanner />
      <InterstitialAd open={showInterstitial} onOpenChange={setShowInterstitial} onAdClosed={handleInterstitialClose} />
    </div>
  );
}
