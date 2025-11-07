import { ScrollText } from 'lucide-react';
import { UserNav } from '@/components/auth/user-nav';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-4 items-center">
          <ScrollText className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary tracking-tight">
            Daily Script
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
