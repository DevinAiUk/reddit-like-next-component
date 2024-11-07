export interface Comment {
  id: number;
  reviewId: number;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}

export interface Review {
  id: number;
  title: string;
  author: string;
  timestamp: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  tags: string[];
}