import React, { useState } from "react";
import { TechNewsItem } from "@/data/techNewsData";
import { Dialog,DialogContent,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart,Bookmark,Share2,ExternalLink,Clock,Flame,Lightbulb,CheckCircle2,Sparkles,HelpCircle,User } from "lucide-react";
import { toast } from "sonner";

interface TechNewsDetailModalProps {
  news: TechNewsItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  isLiked: boolean;
  onLikeToggle: (id: string) => void;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  ai: { label: "AI & GenAI", bg: "bg-purple-500/15", text: "text-purple-600 dark:text-purple-300", border: "border-purple-500/30" },
  software: { label: "Software & Web", bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-300", border: "border-blue-500/30" },
  cyber: { label: "Cyber Security", bg: "bg-red-500/15", text: "text-red-600 dark:text-red-300", border: "border-red-500/30" },
  hardware: { label: "Chips & VLSI", bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-300", border: "border-amber-500/30" },
  placements: { label: "Hiring & Careers", bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300", border: "border-emerald-500/30" },
  cloud: { label: "Cloud & DevOps", bg: "bg-cyan-500/15", text: "text-cyan-600 dark:text-cyan-300", border: "border-cyan-500/30" },
};

export const TechNewsDetailModal: React.FC<TechNewsDetailModalProps> = ({
  news,
  isOpen,
  onClose,
  isBookmarked,
  onBookmarkToggle,
  isLiked,
  onLikeToggle,
}) => {
  const [imgError, setImgError] = useState(false);

  if (!news) return null;

  const catStyle = CATEGORY_STYLES[news.category] || CATEGORY_STYLES.software;

  const handleShare = async () => {
    const shareData = {
      title: news.title,
      text: `${news.title} - Full coverage on Amrita Sai Study Hub`,
      url: news.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Article shared successfully!");
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${news.title}\n\nRead more at: ${news.url}`);
      toast.success("News link copied to clipboard!");
    }
  };

  const handleLike = () => {
    onLikeToggle(news.id);
    toast.success(isLiked ? "Removed like" : "Liked article! ❤️");
  };

  const handleBookmark = () => {
    onBookmarkToggle(news.id);
    toast.success(isBookmarked ? "Removed from reading list" : "Saved to Reading List! 🔖");
  };

  const currentLikes = (news.likesCount || 0) + (isLiked ? 1 : 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl border bg-card text-foreground shadow-2xl focus:outline-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{news.title}</DialogTitle>
        </DialogHeader>

        {/* Top Hero Image Header with Full-Bleed Coverage */}
        <div className="relative w-full aspect-[16/9] max-h-72 sm:max-h-84 overflow-hidden bg-muted">
          {!imgError ? (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/30">
              <span className="text-4xl">📰</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md bg-card/90 shadow-sm ${catStyle.text} ${catStyle.border}`}
            >
              {catStyle.label}
            </span>

            {news.isHot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2.5 py-1 text-xs font-bold shadow-sm">
                <Flame className="h-3 w-3 fill-current" /> Trending Worldwide
              </span>
            )}
          </div>

          {/* Time & Read Time on Hero */}
          <div className="absolute bottom-3 left-3 sm:left-4 flex items-center gap-2 text-white/90 text-xs backdrop-blur-xs bg-black/60 px-3 py-1 rounded-full">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" /> {news.readTime}
            </span>
            <span>•</span>
            <span>Published {news.publishedAt}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Publisher Identity Row */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                  news.sourceBadgeBg || "bg-primary"
                } ${news.sourceBadgeColor || "text-primary-foreground"}`}
              >
                {news.sourceBadgeText || news.source.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {news.source}
                  </p>
                  <span className="inline-flex items-center text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.2 rounded-sm shrink-0">
                    Verified Source
                  </span>
                </div>
                {news.author && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <User className="h-3 w-3" /> By {news.author}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button
                type="button"
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={`h-8 px-2.5 text-xs gap-1.5 ${
                  isLiked ? "bg-red-500 hover:bg-red-600 text-white border-transparent" : ""
                }`}
                title="Like article"
              >
                <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
                <span>{currentLikes}</span>
              </Button>

              <Button
                type="button"
                variant={isBookmarked ? "secondary" : "outline"}
                size="sm"
                onClick={handleBookmark}
                className={`h-8 px-2.5 text-xs gap-1.5 ${
                  isBookmarked ? "text-primary font-semibold" : ""
                }`}
                title="Save article"
              >
                <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-primary" : ""}`} />
                <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 px-2.5 text-xs gap-1.5"
                title="Share article"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>

          {/* Full Headline */}
          <h2 className="font-display font-bold text-lg sm:text-2xl leading-tight text-foreground">
            {news.title}
          </h2>

          {/* Executive Summary Card */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <span className="font-bold text-primary mr-1.5">Overview:</span>
            {news.summary}
          </div>

          {/* Full Multi-Paragraph Information */}
          <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-foreground/85">
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground flex items-center gap-2 pt-2 border-t">
              <Sparkles className="h-4 w-4 text-primary" /> Full Story & Industry Analysis
            </h3>

            {news.fullContent && news.fullContent.length > 0 ? (
              news.fullContent.map((paragraph, index) => (
                <p key={index} className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {news.summary}
              </p>
            )}
          </div>

          {/* Key Bullet Highlights */}
          {news.keyPoints && news.keyPoints.length > 0 && (
            <div className="rounded-xl border bg-card p-4 space-y-2.5">
              <h4 className="font-display font-semibold text-xs sm:text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Key Takeaways
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                {news.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Amrita Sai Student Career & Placement Box */}
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  Amrita Sai Student Career Takeaway
                </p>
                <p className="text-xs sm:text-sm text-foreground/90 mt-1 leading-relaxed">
                  {news.studentTakeaway}
                </p>
              </div>
            </div>

            {/* Campus Placement Interview Q&A */}
            {news.interviewQuestion && (
              <div className="mt-3 rounded-xl border border-primary/20 bg-card p-3 sm:p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  <span>Placement Interview Question:</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-foreground/95 italic bg-muted/40 p-2.5 rounded-lg border-l-4 border-primary">
                  "{news.interviewQuestion.question}"
                </p>
                <div className="text-xs sm:text-sm text-muted-foreground pt-1">
                  <strong className="text-foreground font-semibold">How to answer: </strong>
                  {news.interviewQuestion.answer}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            <span className="text-xs text-muted-foreground font-medium mr-1">Tags:</span>
            {news.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Bottom Footer Actions */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground order-2 sm:order-1 text-center sm:text-left">
              Original publication: <strong className="text-foreground">{news.source}</strong>
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1 sm:flex-none text-xs"
              >
                Close
              </Button>

              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button
                  size="sm"
                  className="w-full gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  <span>Visit Official Source</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechNewsDetailModal;
