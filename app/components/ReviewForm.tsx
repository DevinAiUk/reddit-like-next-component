"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '../types/review';

export const AVAILABLE_TAGS = [
  "Content Creation",
  "AI Tools",
  "Productivity",
  "Data Analysis",
  "Integration",
  "User Experience",
  "Performance",
  "Cost Value",
  "Enterprise"
];

interface ReviewFormProps {
  onSubmit: (review: Review) => void;
  onClose: () => void;
}

export function ReviewForm({ onSubmit, onClose }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now(),
      author: 'current_user',
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comments: 0
    });
    onClose();
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Write a descriptive title for your review"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Review Content</label>
        <Textarea
          required
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Share your experience with Ai Mage..."
          className="min-h-[200px] w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map(tag => (
            <Button
              key={tag}
              type="button"
              variant={formData.tags.includes(tag) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTag(tag)}
              className="transition-colors"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Post Review
        </Button>
      </div>
    </form>
  );
}