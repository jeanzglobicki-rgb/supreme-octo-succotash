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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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
            <Switch id="notifications" disabled />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
