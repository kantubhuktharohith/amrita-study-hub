import React, { useState } from "react";
import { TechNewsItem, toggleBookmarkNews, toggleLikeNews } from "@/data/techNewsData";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Bookmark,
  Share2,
  Flame,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface TechNewsCardProps {
  news: TechNewsItem;
  isBookmarked: boolean;
  onBookmarkToggle?: (id: string, state: boolean) => void;
  isLiked?: boolean;
  onLikeToggle?: (id: string, state: boolean) => void;
  onSelect?: (news: TechNewsItem) => void;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  ai: { label: "AI & GenAI", bg: "bg-purple-500/15", text: "text-purple-600 dark:text-purple-300", border: "border-purple-500/30" },
  software: { label: "Software & Web", bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-300", border: "border-blue-500/30" },
  cyber: { label: "Cyber Security", bg: "bg-red-500/15", text: "text-red-600 dark:text-red-300", border: "border-red-500/30" },
  hardware: { label: "Chips & VLSI", bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-300", border: "border-amber-500/30" },
  placements: { label: "Hiring & Careers", bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300", border: "border-emerald-500/30" },
  cloud: { label: "Cloud & DevOps", bg: "bg-cyan-500/15", text: "text-cyan-600 dark:text-cyan-300", border: "border-cyan-500/30" },
};

export const TechNewsCard: React.FC<TechNewsCardProps> = ({
  news,
  isBookmarked: initialBookmarked,
  onBookmarkToggle,
  isLiked: initialLiked = false,
  onLikeToggle,
  onSelect,
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(news.likesCount || 100);
  const [imgError, setImgError] = useState(false);

  const catStyle = CATEGORY_STYLES[news.category] || CATEGORY_STYLES.software;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(news);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleBookmarkNews(news.id);
    setBookmarked(newState);
    if (onBookmarkToggle) {
      onBookmarkToggle(news.id, newState);
    }
    toast.success(newState ? "Saved to Reading List! 🔖" : "Removed from Saved");
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleLikeNews(news.id);
    setLiked(newState);
    setLikesCount((prev) => (newState ? prev + 1 : Math.max(0, prev - 1)));
    if (onLikeToggle) {
      onLikeToggle(news.id, newState);
    }
    toast.success(newState ? "Liked article! ❤️" : "Unliked article");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: news.title,
      text: `${news.title} - Read full story on Amrita Sai Study Hub`,
      url: news.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Article shared successfully!");
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${news.title}\n${news.url}`);
      toast.success("News link copied to clipboard! 📋");
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative rounded-2xl border bg-card p-0 transition-all duration-300 hover:border-primary/60 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Full-Bleed Visual Topic Image (Matching Google Discover / Inshorts style) */}
        {news.imageUrl && !imgError ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges on Top */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-semibold backdrop-blur-md bg-card/90 shadow-sm ${catStyle.text} ${catStyle.border}`}
              >
                {catStyle.label}
              </span>

              {news.isHot && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2 py-0.5 text-[10px] font-bold shadow-sm">
                  <Flame className="h-2.5 w-2.5 fill-current" /> Trending
                </span>
              )}
            </div>

            {/* Bottom Info on Image */}
            <div className="absolute bottom-2 right-2.5 flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-xs px-2 py-0.5 text-[10px] text-white/90">
              <Clock className="h-3 w-3" /> {news.readTime}
            </div>
          </div>
        ) : (
          <div className="h-24 bg-gradient-to-r from-primary/10 via-secondary/15 to-primary/10 p-3 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {catStyle.label}
            </span>
            <span className="text-xs text-muted-foreground">{news.readTime}</span>
          </div>
        )}

        {/* Card Content Area */}
        <div className="p-3.5 sm:p-4 pb-2">
          {/* Headline */}
          <h3 className="font-display font-bold text-sm sm:text-base leading-snug text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-2">
            {news.title}
          </h3>

          {/* Short Excerpt */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
            {news.summary}
          </p>

          {/* Student Career Highlight Callout Banner */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-2 sm:p-2.5 text-[11px] flex items-start gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-semibold text-primary">Student Impact: </span>
              <span className="text-muted-foreground line-clamp-1">
                {news.studentTakeaway}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Publisher Row & Action Icons (Exact Match to User's Mobile Feed Screenshot) */}
      <div className="px-3.5 sm:px-4 py-2.5 border-t flex items-center justify-between gap-2 mt-1 bg-card/60">
        {/* Publisher Avatar + Name + Relative Time */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 shadow-xs ${
              news.sourceBadgeBg || "bg-primary"
            } ${news.sourceBadgeColor || "text-primary-foreground"}`}
          >
            {news.sourceBadgeText || news.source.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground truncate">
            <span className="font-medium text-foreground truncate max-w-[110px] sm:max-w-[160px]">
              {news.source}
            </span>
            <span>•</span>
            <span className="shrink-0">{news.publishedAt}</span>
          </div>
        </div>

        {/* Action Buttons (Heart / Like, Share, Bookmark / More) */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Heart / Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`h-7 px-1.5 rounded-full flex items-center gap-1 text-xs transition-colors hover:bg-muted ${
              liked ? "text-red-500 font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Like story"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            <span className="text-[10px] hidden sm:inline">{likesCount}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Share story"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors hover:bg-muted ${
              bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Save to Reading List"
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TechNewsCard;
