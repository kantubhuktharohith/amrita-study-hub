import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: "sm" | "md";
  interactive?: boolean;
}

const StarRating = ({ rating, onRate, size = "md", interactive = false }: StarRatingProps) => {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default"
          )}
        >
          <Star
            className={cn(
              starSize,
              star <= rating
                ? "fill-warning text-warning"
                : "fill-none text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
