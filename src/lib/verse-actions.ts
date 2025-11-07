
'use server';

import { collection, getDocs, query } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { getRandomLocalVerse, type Verse } from './verses';

export const getRandomVerse = async (): Promise<Verse> => {
  try {
    // initializeFirebase is safe to call here because this is a server action.
    const { firestore } = initializeFirebase();
    const versesCol = collection(firestore, 'verses');
    const q = query(versesCol);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        console.log('No verses in Firestore, using local fallback.');
        return getRandomLocalVerse();
    }

    const allVerses = snapshot.docs.map(doc => doc.data() as Verse);
    const randomIndex = Math.floor(Math.random() * allVerses.length);
    return allVerses[randomIndex];

  } catch (error) {
    console.error("Could not fetch from Firestore, using local verses as fallback", error);
    // Fallback to local if firestore fails for any reason
    return getRandomLocalVerse();
  }
};
