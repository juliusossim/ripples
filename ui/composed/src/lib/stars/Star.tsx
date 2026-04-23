import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

/**
 * StarRating component that displays a rating from 1-5 with partial fill support.
 * Supports decimal ratings like 3.5, 3.2, etc.
 */
export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className = '',
  showValue = false,
}: Readonly<StarRatingProps>) {
  // Clamp rating between 0 and maxRating
  const clampedRating = Math.max(0, Math.min(rating, maxRating));

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starIndex = index + 1;
          // Calculate fill percentage for this star
          const fillPercentage = Math.max(
            0,
            Math.min(100, (clampedRating - index) * 100)
          );

          return (
            <div
              key={starIndex}
              className="relative"
              style={{ width: size, height: size }}
            >
              {/* Empty star (background) */}
              <Star
                size={size}
                className="absolute text-gray-300"
                strokeWidth={1.5}
              />
              {/* Filled star with clip based on percentage */}
              <div
                className="absolute overflow-hidden"
                style={{ width: `${fillPercentage}%`, height: size }}
              >
                <Star
                  size={size}
                  className="text-yellow-400 fill-yellow-400"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm text-gray-600">
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default StarRating;
