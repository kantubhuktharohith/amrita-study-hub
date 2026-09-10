import React from "react";
import { CommunityAnswer } from "@/data/communityData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Check,
  Code2,
  Share2,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface AnswerItemProps {
  answer: CommunityAnswer;
  isQuestionAuthor: boolean;
  onUpvote: (answerId: string) => void;
  onAccept?: (answerId: string) => void;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  isQuestionAuthor,
  onUpvote,
  onAccept,
}) => {
  const formattedDate = new Date(answer.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all flex gap-3 ${
        answer.isAccepted
          ? "border-emerald-500/60 bg-emerald-500/[0.03] shadow-xs"
          : "border-border bg-card"
      }`}
    >
      {/* Reddit-style Comment Vote Column */}
      <div className="flex flex-col items-center shrink-0 select-none pt-1">
        <button
          type="button"
          onClick={() => onUpvote(answer.id)}
          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
          title="Upvote comment"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <span className="text-xs font-bold text-foreground my-0.5">{answer.upvotes}</span>
        <button
          type="button"
          onClick={() => toast.info("Downvoted")}
          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
          title="Downvote comment"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Comment Body & Header */}
      <div className="flex-1">
        {/* Accepted solution pill */}
        {answer.isAccepted && (
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" /> Accepted Answer
          </div>
        )}

        {/* Comment Author info */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
            {answer.authorUsername.replace("u/", "").charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-foreground hover:underline cursor-pointer">
            {answer.authorUsername}
          </span>
          {answer.authorFlair && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted">
              {answer.authorFlair}
            </Badge>
          )}
          <span>•</span>
          <span>{formattedDate}</span>
        </div>

        {/* Comment Text */}
        <div className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line mb-3">
          {answer.content}
        </div>

        {/* Code Snippet if present */}
        {answer.codeSnippet && (
          <div className="mb-3 rounded-lg bg-muted/80 text-foreground p-3.5 font-mono text-xs overflow-x-auto border border-border">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5 border-b border-border pb-1">
              <span className="flex items-center gap-1">
                <Code2 className="h-3 w-3 text-primary" /> Solution Code
              </span>
            </div>
            <pre className="overflow-x-auto leading-normal">{answer.codeSnippet}</pre>
          </div>
        )}

        {/* Comment Actions */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t">
          {isQuestionAuthor && !answer.isAccepted && onAccept && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAccept(answer.id)}
              className="h-7 px-2 text-xs text-emerald-600 hover:bg-emerald-500/10 gap-1 font-medium"
            >
              <Check className="h-3.5 w-3.5" /> Mark as Accepted
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="h-7 px-2 text-xs gap-1 hover:bg-muted"
          >
            <Share2 className="h-3 w-3" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
};
