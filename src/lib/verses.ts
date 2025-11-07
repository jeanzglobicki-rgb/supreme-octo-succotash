import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

const verses: Omit<Verse, 'reference'>[] = [
  { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.' },
  { book: 'Romans', chapter: 8, verse: 28, text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.' },
  { book: 'Philippians', chapter: 4, verse: 13, text: 'I can do all things through him who strengthens me.' },
  { book: 'Proverbs', chapter: 3, verse: 5, text: 'Trust in the LORD with all your heart, and do not lean on your own understanding.' },
  { book: 'Jeremiah', chapter: 29, verse: 11, text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.' },
  { book: 'Psalm', chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
  { book: 'Isaiah', chapter: 41, verse: 10, text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.' },
  { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning, God created the heavens and the earth.' },
  { book: 'Joshua', chapter: 1, verse: 9, text: 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go.' },
  { book: 'Psalm', chapter: 46, verse: 1, text: 'God is our refuge and strength, a very present help in trouble.' },
  { book: 'Galatians', chapter: 5, verse: 22, text: 'But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness,' },
  { book: 'Ephesians', chapter: 2, verse: 8, text: 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God,' },
  { book: 'Hebrews', chapter: 11, verse: 1, text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.' },
  { book: '1 Corinthians', chapter: 13, verse: 4, text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude.' },
  { book: 'Matthew', chapter: 11, verse: 28, text: 'Come to me, all who labor and are heavy laden, and I will give you rest.' },
  { book: 'Psalm', chapter: 119, verse: 105, text: 'Your word is a lamp to my feet and a light to my path.' },
  { book: '2 Timothy', chapter: 3, verse: 16, text: 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness,' },
  { book: 'Romans', chapter: 12, verse: 2, text: 'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.' },
  { book: 'John', chapter: 14, verse: 6, text: 'Jesus said to him, "I am the way, and the truth, and the life. No one comes to the Father except through me."' },
  { book: 'Matthew', chapter: 6, verse: 33, text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.' },
];

const processedVerses: Verse[] = verses.map(v => ({
  ...v,
  reference: `${v.book} ${v.chapter}:${v.verse}`,
}));

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export const getDailyVerse = (): Verse => {
  const dayOfYear = getDayOfYear();
  return processedVerses[dayOfYear % processedVerses.length];
};

export const getRandomLocalVerse = (): Verse => {
  const randomIndex = Math.floor(Math.random() * processedVerses.length);
  return processedVerses[randomIndex];
}

export const getRandomVerse = async (): Promise<Verse> => {
  try {
    const { firestore } = initializeFirebase();
    const versesCol = collection(firestore, 'verses');
    const q = query(versesCol);
    const snapshot = await getDocs(q);
    const allVerses = snapshot.docs.map(doc => doc.data() as Verse);
    if (allVerses.length > 0) {
      const randomIndex = Math.floor(Math.random() * allVerses.length);
      return allVerses[randomIndex];
    }
  } catch (error) {
    console.error("Could not fetch from firestore, using local verses as fallback", error);
  }
  // Fallback to local if firestore is empty or fails
  return getRandomLocalVerse();
};

export const allVerses = processedVerses;
