
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
import VerseReflection from '@/components/verse/verse-reflection';
import { generateReflection, type ReflectionResponse } from '@/ai/flows/reflection-flow';

const INTERSTITIAL_AD_FREQUENCY = 10;

export default function Home() {
  const { user, isPremium } = useApp();
  const isAuthenticated = !!user;
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [isDaily, setIsDaily] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [randomClickCount, setRandomClickCount] = useState(0);
  const [reflection, setReflection] = useState<ReflectionResponse | null>(null);
  const [isReflectionLoading, setIsReflectionLoading] = useState(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);

  useEffect(() => {
    const verse = getDailyVerse();
    setCurrentVerse(verse);
    setReflection(null); // Clear reflection when verse changes
  }, []);

  const handleGetRandomVerse = useCallback(async () => {
    const verse = await getRandomVerse();
    setReflection(null); // Clear reflection when verse changes

    if (isPremium) {
      setCurrentVerse(verse);
      setIsDaily(false);
      return;
    }

    const newCount = randomClickCount + 1;
    setRandomClickCount(newCount);

    if (newCount % INTERSTITIAL_AD_FREQUENCY === 0) {
      setShowInterstitial(true);
    } else {
      setCurrentVerse(verse);
      setIsDaily(false);
    }
  }, [randomClickCount, isPremium]);

  const handleShowDailyVerse = () => {
    const verse = getDailyVerse();
    setCurrentVerse(verse);
    setIsDaily(true);
    setReflection(null); // Clear reflection when verse changes
  };

  const handleInterstitialClose = async () => {
    setShowInterstitial(false);
    const verse = await getRandomVerse();
    setCurrentVerse(verse);
    setIsDaily(false);
  };

  const handleGetReflection = async () => {
    if (!currentVerse) return;
    setIsReflectionLoading(true);
    setReflectionError(null);
    setReflection(null);
    try {
      const result = await generateReflection(currentVerse);
      setReflection(result);
    } catch (error) {
      console.error('Error generating reflection:', error);
      setReflectionError('Sorry, the reflection could not be generated at this time.');
    } finally {
      setIsReflectionLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {currentVerse && <VerseCard key={currentVerse.reference} verse={currentVerse} onGetReflection={handleGetReflection} />}
          <VerseReflection
            reflection={reflection}
            isLoading={isReflectionLoading}
            error={reflectionError}
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetRandomVerse}
              className="w-full sm:w-auto font-headline"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Get a Random Verse
            </Button>
            <Button size="lg" variant="outline" onClick={handleShowDailyVerse} className={`w-full sm:w-auto font-headline transition-opacity duration-300 ${isDaily ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              Back to Daily Verse
            </Button>
          </div>
          {!isAuthenticated && <p className="text-center text-muted-foreground">Sign in to save your favorite verses.</p>}
        </div>
      </main>
      {!isPremium && <AdBanner />}
      {!isPremium && <InterstitialAd open={showInterstitial} onOpenChange={setShowInterstitial} onAdClosed={handleInterstitialClose} />}
    </div>
  );
}
