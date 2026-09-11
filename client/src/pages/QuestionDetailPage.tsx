import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getQuestionById,
  createAnswer,
  voteOnQuestion,
  voteOnAnswer,
  acceptAnswer,
  incrementQuestionViews,
} from "@/lib/communityQueries";
import { CommunityQuestion } from "@/data/communityData";
import { AnswerItem } from "@/components/community/AnswerItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  Code2,
  Send,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const authorName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "student");
  const authorYear = profile?.year || 3;

  const [question, setQuestion] = useState<CommunityQuestion | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentCode, setCommentCode] = useState("");
  const [showCommentCode, setShowCommentCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadQuestion = () => {
    if (id) {
      const q = getQuestionById(id);
      setQuestion(q ? { ...q } : null);
    }
  };

  useEffect(() => {
    if (id) {
      incrementQuestionViews(id);
      const q = getQuestionById(id);
      setQuestion(q ? { ...q } : null);
    }
  }, [id]);

  if (!question) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Post not found</h2>
        <p className="text-xs text-muted-foreground mb-4">
          This question may have been deleted or the link is incorrect.
        </p>
        <Link to="/community">
          <Button size="sm" variant="outline">
            Back to Community
          </Button>
        </Link>
      </div>
    );
  }

  const handlePostVote = (dir: 1 | -1) => {
    voteOnQuestion(question.id, dir);
    loadQuestion();
  };

  const handleCommentVote = (answerId: string) => {
    voteOnAnswer(question.id, answerId, 1);
    toast.success("Upvoted comment!");
    loadQuestion();
  };

  const handleAcceptComment = (answerId: string) => {
    acceptAnswer(question.id, answerId);
    toast.success("Marked as Accepted Solution!");
    loadQuestion();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Post link copied to clipboard!");
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Please enter your comment/solution");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanUname = authorName.replace(/^u\//, "");

      createAnswer({
        questionId: question.id,
        content: commentText.trim(),
        codeSnippet: commentCode.trim() ? commentCode.trim() : undefined,
        authorUsername: `u/${cleanUname}`,
        authorDepartment: profile?.department || question.department,
        authorYear: Number(authorYear),
        authorFlair:
          Number(authorYear) >= 3
            ? "Senior Mentor ⭐"
            : `${(profile?.department || question.department).slice(0, 4)} Year ${authorYear}`,
        authorId: user?.id,
      });

      toast.success("Comment posted!");
      setCommentText("");
      setCommentCode("");
      setShowCommentCode(false);
      loadQuestion();
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const netScore = (question.upvotes || 0) - (question.downvotes || 0);

  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="min-h-screen bg-muted/20 pb-6 overflow-x-hidden">
      <div className="container px-3 sm:px-6 mt-4 sm:mt-6 max-w-5xl">
        {/* Back Link */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/community")}
            className="text-xs gap-1.5 hover:bg-muted h-8 px-2.5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to r/all Community
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="text-xs gap-1.5 h-8 px-2.5"
          >
            <Share2 className="h-3.5 w-3.5" />{" "}
            <span className="hidden sm:inline">Share Post</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
          {/* Main Content (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
            {/* Main Reddit-style Post Card */}
            <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
              <div className="flex">
                {/* Vote column — hidden on mobile, shown sm+ */}
                <div className="hidden sm:flex w-12 bg-muted/30 p-2 flex-col items-center justify-start border-r shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => handlePostVote(1)}
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
                    onClick={() => handlePostVote(-1)}
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

                {/* Post Details */}
                <div className="p-3 sm:p-5 flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-muted-foreground mb-2">
                    <span className="font-bold text-foreground">
                      {question.subCommunity || "r/all"}
                    </span>
                    <span>•</span>
                    <span className="hidden sm:inline">Posted by</span>
                    <span className="font-semibold text-foreground truncate max-w-[140px] sm:max-w-none">
                      {question.authorUsername}
                    </span>
                    {question.authorFlair && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-4 bg-muted"
                      >
                        {question.authorFlair}
                      </Badge>
                    )}
                    <span>•</span>
                    <span>{formattedDate}</span>

                    {question.isResolved && (
                      <Badge className="ml-auto bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] sm:text-[10px] flex items-center gap-1 h-4 sm:h-5">
                        <CheckCircle2 className="h-3 w-3" /> Solved
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-display text-base sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 leading-snug break-words">
                    {question.title}
                  </h1>

                  {/* Content */}
                  <div className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line mb-3 sm:mb-4 break-words">
                    {question.content}
                  </div>

                  {/* Code Block if any */}
                  {question.codeSnippet && (
                    <div className="mb-4 rounded-lg bg-muted/80 text-foreground p-3 sm:p-4 font-mono text-xs overflow-x-auto border border-border">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2 border-b border-border pb-1">
                        <span className="flex items-center gap-1">
                          <Code2 className="h-3.5 w-3.5 text-primary" /> Code
                          Snippet / Terminal Output
                        </span>
                      </div>
                      <pre className="overflow-x-auto leading-normal">
                        {question.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/20 bg-primary/5 text-primary"
                    >
                      {question.department}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Sem {question.semester} • {question.subject}
                    </Badge>
                    {question.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Action footer — includes inline vote on mobile */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t text-xs text-muted-foreground">
                    {/* Inline vote buttons on mobile only */}
                    <div className="flex items-center gap-0.5 sm:hidden mr-1">
                      <button
                        type="button"
                        onClick={() => handlePostVote(1)}
                        className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${
                          question.userVote === 1
                            ? "text-orange-500 bg-orange-500/10"
                            : "text-muted-foreground hover:text-orange-500"
                        }`}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <span
                        className={`text-[11px] font-bold min-w-[16px] text-center ${
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
                        onClick={() => handlePostVote(-1)}
                        className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${
                          question.userVote === -1
                            ? "text-blue-500 bg-blue-500/10"
                            : "text-muted-foreground hover:text-blue-500"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />{" "}
                      {question.answers.length} Comments
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success("Saved post!")}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <Bookmark className="h-3.5 w-3.5" /> Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* "Comment as u/username" Input Box */}
            <div className="rounded-xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span>Commenting as</span>
                <span className="font-semibold text-foreground">
                  u/{authorName.replace(/^u\//, "")}
                </span>
                {profile?.year && (
                  <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full text-[10px]">
                    Year {profile.year}
                  </span>
                )}
                {profile?.department && (
                  <span className="hidden sm:inline text-muted-foreground text-[11px]">
                    • {profile.department}
                  </span>
                )}
              </div>

              <form onSubmit={handlePostComment} className="space-y-3">

                <Textarea
                  placeholder="What are your thoughts or solution to this problem? Explain step-by-step..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  required
                  className="text-xs sm:text-sm"
                />

                {/* Code Attachment Toggle */}
                <div>
                  {!showCommentCode ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCommentCode(true)}
                      className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Code2 className="h-3.5 w-3.5" /> + Attach Code Snippet
                    </Button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs font-semibold flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-primary" /> Code
                          Solution
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowCommentCode(false);
                            setCommentCode("");
                          }}
                          className="h-6 text-[11px] text-muted-foreground"
                        >
                          Remove Code
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Paste code snippet here..."
                        value={commentCode}
                        onChange={(e) => setCommentCode(e.target.value)}
                        rows={3}
                        className="font-mono text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-hero-gradient text-white text-xs gap-1.5 h-8 px-4"
                  >
                    <Send className="h-3.5 w-3.5" /> Comment
                  </Button>
                </div>
              </form>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span className="font-bold text-foreground">
                  {question.answers.length} Comments
                </span>
                <span>
                  Sorted by: <strong>Top Helpful</strong>
                </span>
              </div>

              {question.answers.length > 0 ? (
                <div className="space-y-3">
                  {question.answers.map((ans) => (
                    <AnswerItem
                      key={ans.id}
                      answer={ans}
                      isQuestionAuthor={true}
                      onUpvote={handleCommentVote}
                      onAccept={handleAcceptComment}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border bg-card/60 p-8 text-center text-muted-foreground text-xs">
                  No comments yet. Be the first to share an explanation!
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-5">
            {/* Subreddit Card */}
            <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
              <div className="h-12 bg-hero-gradient p-3 flex items-center text-white font-bold text-xs">
                {question.subCommunity || "r/all"} Channel Info
              </div>
              <div className="p-4 text-xs space-y-3">
                <div className="font-semibold text-foreground">
                  {question.department}
                </div>
                <p className="text-muted-foreground">
                  Semester {question.semester} discussions for{" "}
                  {question.subject}.
                </p>
                <div className="pt-2 border-t">
                  <Link to="/browse">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5"
                    >
                      <BookOpen className="h-3.5 w-3.5" /> Browse Notes for{" "}
                      {question.subject}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-xl border bg-card p-4 shadow-xs text-xs space-y-2.5">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Quick
                Guidelines
              </h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• Verify your solution steps before posting.</li>
                <li>• Use markdown code blocks for formatted code.</li>
                <li>• Give credit if referencing standard textbook proofs.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
