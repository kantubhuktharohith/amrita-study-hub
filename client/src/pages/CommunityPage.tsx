import React, { useState, useMemo, useEffect } from "react";
import { CommunityQuestion } from "@/data/communityData";
import { getCommunityQuestions,fetchCommunityQuestions,voteOnQuestion,COMMUNITY_QUESTIONS_CONTENT_ID,COMMUNITY_ANSWERS_CONTENT_ID } from "@/lib/communityQueries";
import { QuestionCard } from "@/components/community/QuestionCard";
import { AskQuestionModal } from "@/components/community/AskQuestionModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Search,Plus,Flame,Sparkles,Award,HelpCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortTab, setSortTab] = useState<"hot" | "new" | "top" | "unanswered">(
    "hot",
  );
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const loadQuestions = async () => {
    // 1. Instant local render
    const local = getCommunityQuestions();
    if (local.length > 0) {
      setQuestions(local);
    }
    // 2. Fetch fresh from Supabase cloud database
    const remote = await fetchCommunityQuestions();
    setQuestions(remote);
  };

  useEffect(() => {
    loadQuestions();

    // Subscribe to realtime database changes so any post made in another account shows immediately
    const channel = supabase
      .channel("community-posts-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload: any) => {
          if (
            payload.new?.content_id === COMMUNITY_QUESTIONS_CONTENT_ID ||
            payload.new?.content_id === COMMUNITY_ANSWERS_CONTENT_ID ||
            payload.old?.content_id === COMMUNITY_QUESTIONS_CONTENT_ID
          ) {
            fetchCommunityQuestions().then(setQuestions);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = (id: string, dir: 1 | -1, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    voteOnQuestion(id, dir);
    loadQuestions();
  };

  // Filter & Sort
  const filteredQuestions = useMemo(() => {
    const qTerm = (searchQuery || "").toLowerCase();
    return questions
      .filter((q) => {
        if (!q) return false;
        // Search query
        const titleMatch = (q.title || "").toLowerCase().includes(qTerm);
        const contentMatch = (q.content || "").toLowerCase().includes(qTerm);
        const subjectMatch = (q.subject || "").toLowerCase().includes(qTerm);
        const deptMatch = (q.department || "").toLowerCase().includes(qTerm);
        const tagsMatch =
          Array.isArray(q.tags) &&
          q.tags.some((t) => (t || "").toLowerCase().includes(qTerm));

        const matchesSearch =
          !qTerm ||
          titleMatch ||
          contentMatch ||
          subjectMatch ||
          deptMatch ||
          tagsMatch;

        // Unanswered filter
        let matchesUnanswered = true;
        if (sortTab === "unanswered") {
          matchesUnanswered = (q.answers || []).length === 0;
        }

        return matchesSearch && matchesUnanswered;
      })
      .sort((a, b) => {
        const aUp = a.upvotes || 0;
        const aDown = a.downvotes || 0;
        const bUp = b.upvotes || 0;
        const bDown = b.downvotes || 0;
        const aAns = (a.answers || []).length;
        const bAns = (b.answers || []).length;

        if (sortTab === "top") {
          return bUp - bDown - (aUp - aDown);
        }
        if (sortTab === "new") {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        }
        // Hot sort: score + answer activity
        const aScore = aUp - aDown + aAns * 3;
        const bScore = bUp - bDown + bAns * 3;
        return bScore - aScore;
      });
  }, [questions, searchQuery, sortTab]);

  return (
    <div className="min-h-screen bg-muted/20 pb-28 sm:pb-16 overflow-x-hidden">
      {/* Mobile Community Header Banner */}
      <div className="bg-card border-b py-4 px-4 sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-hero-gradient text-white flex items-center justify-center font-bold text-sm shadow-xs">
              🌐
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-foreground leading-tight">
                r/all Community
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Amrita Sai Student Doubt Clarification
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsAskModalOpen(true)}
            size="sm"
            className="bg-hero-gradient text-white text-xs gap-1 h-8 px-3 rounded-lg"
          >
            <Plus className="h-3.5 w-3.5" /> Ask
          </Button>
        </div>
      </div>

      {/* Main Feed + Sidebar Layout */}
      <div className="container px-3 sm:px-6 mt-4 sm:mt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main 2-Column Feed */}
          <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
            {/* Reddit-style "Create Post" Quick Prompt Box */}
            <div className="rounded-xl border bg-card p-3 sm:p-4 shadow-xs flex items-center gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <input
                type="text"
                placeholder="Ask a doubt in r/all community..."
                onClick={() => setIsAskModalOpen(true)}
                readOnly
                className="flex-1 bg-muted/50 hover:bg-muted/80 border rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm cursor-pointer transition-colors text-muted-foreground focus:outline-none truncate"
              />
              <Button
                onClick={() => setIsAskModalOpen(true)}
                size="sm"
                className="bg-hero-gradient text-white text-xs shrink-0 gap-1 sm:gap-1.5 h-8 sm:h-9 px-3 sm:px-4"
              >
                <Plus className="h-3.5 w-3.5" />{" "}
                <span className="hidden sm:inline">Post Doubt</span>
                <span className="sm:hidden">Post</span>
              </Button>
            </div>

            {/* Sorting & Search Control Bar */}
            <div className="rounded-xl border bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
              {/* Reddit Sort Buttons (Scrollable horizontally on mobile) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
                <Button
                  size="sm"
                  variant={sortTab === "hot" ? "secondary" : "ghost"}
                  onClick={() => setSortTab("hot")}
                  className={`h-8 text-xs gap-1.5 rounded-lg shrink-0 px-2.5 ${
                    sortTab === "hot"
                      ? "font-semibold text-orange-500 bg-orange-500/10"
                      : "text-muted-foreground"
                  }`}
                >
                  <Flame className="h-3.5 w-3.5" /> Hot
                </Button>
                <Button
                  size="sm"
                  variant={sortTab === "new" ? "secondary" : "ghost"}
                  onClick={() => setSortTab("new")}
                  className={`h-8 text-xs gap-1.5 rounded-lg shrink-0 px-2.5 ${
                    sortTab === "new"
                      ? "font-semibold text-primary bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> New
                </Button>
                <Button
                  size="sm"
                  variant={sortTab === "top" ? "secondary" : "ghost"}
                  onClick={() => setSortTab("top")}
                  className={`h-8 text-xs gap-1.5 rounded-lg shrink-0 px-2.5 ${
                    sortTab === "top"
                      ? "font-semibold text-amber-500 bg-amber-500/10"
                      : "text-muted-foreground"
                  }`}
                >
                  <Award className="h-3.5 w-3.5" /> Top
                </Button>
                <Button
                  size="sm"
                  variant={sortTab === "unanswered" ? "secondary" : "ghost"}
                  onClick={() => setSortTab("unanswered")}
                  className={`h-8 text-xs gap-1.5 rounded-lg shrink-0 px-2.5 ${
                    sortTab === "unanswered"
                      ? "font-semibold text-emerald-500 bg-emerald-500/10"
                      : "text-muted-foreground"
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" /> Unanswered
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search doubts, subjects, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs rounded-lg"
                />
              </div>
            </div>

            {/* Posts Feed */}
            {filteredQuestions.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onVote={handleVote}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
                <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                <h3 className="font-semibold text-base mb-1">No posts found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                  Be the first student to ask a doubt or start a discussion in
                  r/all!
                </p>
                <Button
                  onClick={() => setIsAskModalOpen(true)}
                  className="bg-hero-gradient text-white text-xs gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Create First Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onQuestionCreated={loadQuestions}
      />
    </div>
  );
};

export default CommunityPage;
