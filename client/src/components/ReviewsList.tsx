import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Review } from '@/data/mockData';

interface ReviewsListProps {
  reviews: Review[];
}

export const ReviewsList = ({ reviews }: ReviewsListProps) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-2xl p-5 shadow-premium hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
                {review.avatar}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{review.author}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {review.vibeTag}
            </Badge>
          </div>

          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-warning text-warning'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{review.rating}/5</span>
          </div>

          <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">{review.text}</p>
        </div>
      ))}
    </div>
  );
};
