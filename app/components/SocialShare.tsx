"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Share2, Link2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  reviewId: number;
  title: string;
}

export function SocialShare({ reviewId, title }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getShareUrl = () => {
    const baseUrl = 'https://aimage.uk';
    return `${baseUrl}/review/${reviewId}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
    setIsOpen(false);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      getUrl: () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      getUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:text-blue-600">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          {shareLinks.map((platform) => (
            <Button
              key={platform.name}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleShare(platform.getUrl())}
            >
              <platform.icon className="w-4 h-4 mr-2" />
              {platform.name}
            </Button>
          ))}
          <hr className="my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleCopyLink}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}