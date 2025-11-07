'use client';

import { useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';
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
import { useUser, useAuth, useFirebaseApp } from '@/firebase';
import { User, LogIn, Heart, Settings, LogOut, BookOpen, UserCircle } from 'lucide-react';

import FavoritesSheet from '@/components/verse/favorites-sheet';
import SettingsDialog from '@/components/settings-dialog';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const {toast} = useToast();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showFavoritesSheet, setShowFavoritesSheet] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const handleSignIn = async (providerName: 'google' | 'anonymous') => {
    if (!auth) return;
    setShowSignInDialog(false);
    try {
      if (providerName === 'google') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else if (providerName === 'anonymous') {
        await signInAnonymously(auth);
      }
      toast({ title: 'Successfully signed in!' });
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your sign in.',
      });
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      toast({ title: 'Successfully signed out.' });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your sign out.',
      });
    }
  };


  if (!user) {
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
              <Button onClick={() => handleSignIn('google')} variant="outline">Sign in with Google</Button>
              <Button onClick={() => handleSignIn('anonymous')}>Continue Anonymously</Button>
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
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>
                {user.isAnonymous ? <UserCircle/> : (user.displayName?.charAt(0) || <User />)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.isAnonymous ? "Anonymous User" : (user.displayName || 'Signed In')}</p>
              <p className="text-xs leading-none text-muted-foreground">
                 {user.isAnonymous ? "Sign up to sync favorites" : (user.email || 'Enjoy your daily inspiration!')}
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
          <DropdownMenuItem onSelect={handleSignOut}>
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
