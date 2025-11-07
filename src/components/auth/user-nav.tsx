'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useApp } from '@/hooks/use-app';
import { User, LogIn, Heart, Settings, LogOut, Bookmark, BookOpen } from 'lucide-react';

import FavoritesSheet from '@/components/verse/favorites-sheet';
import SettingsDialog from '@/components/settings-dialog';

export function UserNav() {
  const { isAuthenticated, signIn, signOut } = useApp();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showFavoritesSheet, setShowFavoritesSheet] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Button onClick={() => setShowSignInDialog(true)}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create an Account or Sign In</DialogTitle>
              <DialogDescription>
                Sign in to save your favorite verses and sync across devices.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => { signIn('google'); setShowSignInDialog(false); }} variant="outline">Sign in with Google</Button>
              <Button onClick={() => { signIn('apple'); setShowSignInDialog(false); }} variant="outline">Sign in with Apple</Button>
              <Button onClick={() => { signIn('anonymous'); setShowSignInDialog(false); }}>Continue Anonymously</Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="@user" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Signed In</p>
              <p className="text-xs leading-none text-muted-foreground">
                Enjoy your daily inspiration!
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowFavoritesSheet(true)}>
              <Heart className="mr-2 h-4 w-4" />
              <span>Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowSettingsDialog(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Bible Version (KJV)</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FavoritesSheet open={showFavoritesSheet} onOpenChange={setShowFavoritesSheet} />
      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} />
    </>
  );
}
