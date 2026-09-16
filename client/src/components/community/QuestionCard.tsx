import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CommunityQuestion } from "@/data/communityData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp,ChevronDown,MessageSquare,Share2,Bookmark,CheckCircle2,Code2,Eye } from "lucide-react";
import { toast } from "sonner";

interface QuestionCardProps {
  question: CommunityQuestion;
  onVote?: (id: string, dir: 1 | -1, e: React.MouseEvent) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onVote,
}) => {
  const navigate = useNavigate();
  const netScore = (question.upvotes || 0) - (question.downvotes || 0);

  const formattedTime = new Date(question.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/community/${question.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div
      onClick={() => navigate(`/community/${question.id}`)}
      className="group rounded-xl border bg-card hover:border-primary/50 transition-all duration-200 overflow-hidden shadow-xs flex cursor-pointer"
    >
      {/* Reddit-style Left Vote Bar */}
      <div className="w-10 sm:w-12 bg-muted/30 p-1.5 sm:p-2 flex flex-col items-center justify-start border-r shrink-0 select-none">
        <button
          type="button"
          onClick={(e) => onVote && onVote(question.id, 1, e)}
          className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors ${
            question.userVote === 1
              ? "text-orange-500 bg-orange-500/10"
              : "text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10"
          }`}
          title="Upvote"
        >
          <ChevronUp className="h-5 w-5" />
        </button>

        <span
          className={`text-xs font-bold my-1 ${
            question.userVote === 1
              ? "text-orange-500"
              : question.userVote === -1
                ? "text-blue-500"
                : "text-foreground"
          }`}
        >
          {netScore}
        </span>

        <button
          type="button"
          onClick={(e) => onVote && onVote(question.id, -1, e)}
          className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors ${
            question.userVote === -1
              ? "text-blue-500 bg-blue-500/10"
              : "text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
          }`}
          title="Downvote"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Main Post Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Post Header */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
            <span className="font-bold text-foreground hover:text-primary transition-colors">
              {question.subCommunity || "r/all"}
            </span>
            <span>•</span>
            <span className="hidden xs:inline">Posted by</span>
            <Link
              to={`/profile/${question.authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
              title="View student profile"
            >
              {question.authorUsername}
            </Link>
            {question.authorFlair && (
              <Badge
                variant="secondary"
                className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-4 bg-muted"
              >
                {question.authorFlair}
              </Badge>
            )}
            <span>•</span>
            <span>{formattedTime}</span>

            {question.isResolved && (
              <Badge className="ml-auto bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] sm:text-[10px] flex items-center gap-1 h-4 sm:h-5">
                <CheckCircle2 className="h-3 w-3" /> Solved
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-sm sm:text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5 sm:mb-2">
            {question.title}
          </h3>

          {/* Body preview */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2.5 sm:mb-3">
            {question.content}
          </p>

          {/* Code block snippet preview */}
          {question.codeSnippet && (
            <div className="mb-2.5 sm:mb-3 rounded-md bg-muted/80 text-foreground p-2 sm:p-2.5 font-mono text-[10px] sm:text-[11px] overflow-hidden border border-border max-h-16 sm:max-h-20 relative">
              <div className="absolute right-2 top-1 text-[9px] text-muted-foreground flex items-center gap-1">
                <Code2 className="h-3 w-3 text-primary" /> code
              </div>
              <pre className="overflow-hidden truncate">
                {question.codeSnippet}
              </pre>
            </div>
          )}

          {/* Badges & Tags */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
            <Badge
              variant="outline"
              className="text-[9px] sm:text-[10px] border-primary/20 bg-primary/5 text-primary"
            >
              {question.department}
            </Badge>
            <Badge variant="secondary" className="text-[9px] sm:text-[10px]">
              {question.semester && question.semester > 0
                ? `Sem ${question.semester} • ${question.subject}`
                : question.subject || "Programming"}
            </Badge>
            {question.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[9px] sm:text-[10px] text-muted-foreground bg-secondary/40 px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reddit-style Action Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 sm:gap-2 pt-2 border-t text-[11px] sm:text-xs text-muted-foreground"
        >
          <Link to={`/community/${question.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] sm:text-xs gap-1 hover:bg-muted font-medium"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{question.answers.length} Comments</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-7 px-2 text-[11px] sm:text-xs gap-1 hover:bg-muted"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.success("Post saved to bookmarks!")}
            className="h-7 px-2 text-[11px] sm:text-xs gap-1 hover:bg-muted"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          <div className="ml-auto text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
            <Eye className="h-3 w-3" /> {question.views}
          </div>
        </div>
      </div>
    </div>
  );
};
