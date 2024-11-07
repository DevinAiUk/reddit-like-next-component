"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Review, Comment } from '../types/review';
import { CommentThread } from './CommentThread';
import { SocialShare } from './SocialShare';
import { useState } from 'react';

interface ReviewCardProps {
  review: Review;
  userVote: 'up' | 'down' | null;
  onVote: (reviewId: number, voteType: 'up' | 'down') => void;
  comments: Comment[];
  onAddComment: (reviewId: number, content: string) => void;
}

export function ReviewCard({ review, userVote, onVote, comments, onAddComment }: ReviewCardProps) {
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl text-gray-900 hover:text-blue-600 transition-colors">
              {review.title}
            </CardTitle>
            <CardDescription className="mt-1">
              Posted by {review.author} • {new Date(review.timestamp).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {review.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {review.content}
        </p>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onVote(review.id, 'up')}
              className={`hover:text-blue-600 ${userVote === 'up' ? 'text-blue-600' : ''}`}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {review.upvotes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onVote(review.id, 'down')}
              className={`hover:text-red-600 ${userVote === 'down' ? 'text-red-600' : ''}`}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {review.downvotes}
            </Button>
          </div>
          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:text-blue-600">
                <MessageSquare className="w-4 h-4 mr-1" />
                {comments.length} Comments
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>
              <CommentThread
                reviewId={review.id}
                comments={comments}
                onAddComment={onAddComment}
              />
            </DialogContent>
          </Dialog>
          <SocialShare reviewId={review.id} title={review.title} />
        </div>
      </CardFooter>
    </Card>
  );
}