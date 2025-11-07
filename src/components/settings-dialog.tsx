'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/providers/theme-provider';
import { useEffect, useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const { user, isPremium, upgradeToPremium, notificationPreference, setNotificationPreference } = useApp();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Signed In",
            description: "You must be signed in to upgrade.",
        });
        return;
    }
    try {
      await upgradeToPremium();
      toast({
        title: 'Upgrade Successful!',
        description: "You are now a premium member. Enjoy the ad-free experience!",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Upgrade failed:", error);
      toast({
        variant: "destructive",
        title: "Upgrade Failed",
        description: "Something went wrong. Please try again.",
      });
    }
  }

  const handleNotificationChange = (checked: boolean) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Signed In",
            description: "You must be signed in to manage notifications.",
        });
        return;
    }
    const newPreference = checked ? 'daily' : 'off';
    setNotificationPreference(newPreference);
    toast({
        title: `Notifications ${checked ? 'Enabled' : 'Disabled'}`,
        description: `Your daily verse notifications are now ${checked ? 'on' : 'off'}.`
    });
  }

  if (!isClient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Customize your Daily Script experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="dark-mode" className="col-span-2">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="bible-version" className="col-span-2">
              Bible Version
            </Label>
            <Select defaultValue="kjv" disabled>
              <SelectTrigger id="bible-version" className="w-full">
                <SelectValue placeholder="Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kjv">KJV</SelectItem>
                <SelectItem value="niv">NIV (soon)</SelectItem>
                <SelectItem value="esv">ESV (soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="notifications" className="col-span-2">
              Daily Notifications
            </Label>
            <Switch 
              id="notifications" 
              disabled={!user}
              checked={notificationPreference === 'daily'}
              onCheckedChange={handleNotificationChange}
            />
          </div>
           {user && !isPremium && (
            <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex flex-col items-start gap-2">
                    <h3 className="font-headline text-lg flex items-center gap-2 text-primary">
                        <Zap className="h-5 w-5" />
                        Go Premium
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Remove all ads and support the app for just $1.
                    </p>
                </div>
                 <Button onClick={handleUpgrade} className="w-full font-bold">
                    Upgrade for $1
                 </Button>
            </div>
           )}
           {isPremium && (
             <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="font-bold text-green-600 dark:text-green-400">You are a Premium member!</p>
                <p className="text-sm text-muted-foreground">Enjoy your ad-free experience.</p>
             </div>
           )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full" variant="outline">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
