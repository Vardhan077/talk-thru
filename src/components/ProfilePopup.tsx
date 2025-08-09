import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface User {
  _id?: string;
  username: string;
  photoURL?: string;
}

interface ProfilePopupProps {
  user: User | null;
  onClose: () => void;
}

export default function ProfilePopup({ user, onClose }: ProfilePopupProps) {
  if (!user) return null;

  const getDisplayName = (email: string) =>
    email.includes('@') ? email.split('@')[0] : email;

  const avatar = user.photoURL || 'https://res.cloudinary.com/dg9itycrz/image/upload/v1734767663/avatar_i8vrav.png';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback className="text-lg">
                {getDisplayName(user.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {getDisplayName(user.username)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {user.username}
              </p>
            </div>
            
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}