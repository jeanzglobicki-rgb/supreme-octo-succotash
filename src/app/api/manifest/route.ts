import { NextResponse } from 'next/server';

export function GET() {
  const manifest = {
    name: 'Daily Script',
    short_name: 'DailyScript',
    description: 'Daily Bible Verses & Random Verse App',
    start_url: '/',
    display: 'standalone',
    background_color: '#E8EAF6',
    theme_color: '#7c7bad',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifest), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
