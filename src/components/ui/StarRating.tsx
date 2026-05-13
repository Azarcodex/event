'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  hoverRating?: number;
  onHoverChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
  hoverRating = 0,
  onHoverChange,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isActive = interactive 
          ? (hoverRating || rating) >= starValue 
          : rating >= starValue;

        return (
          <motion.div
            key={index}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onClick={() => interactive && onRatingChange?.(starValue)}
            onMouseEnter={() => interactive && onHoverChange?.(starValue)}
            onMouseLeave={() => interactive && onHoverChange?.(0)}
            className={`${interactive ? 'cursor-pointer' : ''} transition-colors duration-300`}
          >
            <Star
              size={size}
              className={`${
                isActive 
                  ? 'fill-brand text-brand' 
                  : 'text-zinc-700 fill-transparent'
              } transition-all duration-300`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
