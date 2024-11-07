"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Wand2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { Review, Comment } from './types/review';
import { ReviewForm } from './components/ReviewForm';
import { ReviewCard } from './components/ReviewCard';
import { INITIAL_REVIEWS } from './data/initial-reviews';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [sortBy, setSortBy] = useState<'new' | 'top'>('new');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<number, 'up' | 'down' | null>>({});

  useEffect(() => {
    const savedVotes = Cookies.get('userVotes');
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = (reviewId: number, voteType: 'up' | 'down') => {
    const currentVote = userVotes[reviewId];
    let newVoteType: 'up' | 'down' | null = voteType;

    if (currentVote === voteType) {
      newVoteType = null;
    }

    const newUserVotes = {
      ...userVotes,
      [reviewId]: newVoteType
    };
    setUserVotes(newUserVotes);
    Cookies.set('userVotes', JSON.stringify(newUserVotes), { expires: 365 });

    setReviews(prevReviews => 
      prevReviews.map(review => {
        if (review.id === reviewId) {
          const updatedReview = { ...review };

          if (currentVote === 'up') updatedReview.upvotes--;
          if (currentVote === 'down') updatedReview.downvotes--;

          if (newVoteType === 'up') updatedReview.upvotes++;
          if (newVoteType === 'down') updatedReview.downvotes++;

          return updatedReview;
        }
        return review;
      })
    );
  };

  const handleNewReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
    setComments(prev => ({ ...prev, [review.id]: [] }));
  };

  const handleAddComment = (reviewId: number, content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      reviewId,
      author: 'current_user',
      content,
      timestamp: new Date().toISOString(),
      replies: []
    };

    setComments(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), newComment]
    }));

    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, comments: (review.comments || 0) + 1 }
          : review
      )
    );
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'new') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mage AI Reviews</h1>
                <p className="text-gray-600 mt-1">Community reviews and discussions</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <ReviewForm 
                  onSubmit={handleNewReview}
                  onClose={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex gap-4">
          <Button 
            variant={sortBy === 'new' ? 'default' : 'outline'}
            onClick={() => setSortBy('new')}
            className="min-w-[100px]"
          >
            Newest
          </Button>
          <Button 
            variant={sortBy === 'top' ? 'default' : 'outline'}
            onClick={() => setSortBy('top')}
            className="min-w-[100px]"
          >
            Top Rated
          </Button>
        </div>

        <div className="space-y-6">
          {sortedReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              userVote={userVotes[review.id]}
              onVote={handleVote}
              comments={comments[review.id] || []}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      </main>
    </div>
  );
}