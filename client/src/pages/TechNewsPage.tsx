import React, { useState, useEffect, useMemo } from "react";
import { TechNewsItem,CURATED_TECH_NEWS,getBookmarkedNewsIds,getLikedNewsIds,fetchLiveHackerNews } from "@/data/techNewsData";
import { TechNewsCard } from "@/components/news/TechNewsCard";
import { TechNewsDetailModal } from "@/components/news/TechNewsDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search,RefreshCw,Newspaper,Bookmark } from "lucide-react";
import { toast } from "sonner";

export const TechNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<TechNewsItem[]>(CURATED_TECH_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [selectedNewsItem, setSelectedNewsItem] = useState<TechNewsItem | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    setBookmarkedIds(getBookmarkedNewsIds());
    setLikedIds(getLikedNewsIds());
    loadLiveNews();
  }, []);

  const loadLiveNews = async () => {
    setIsLoadingLive(true);
    try {
      const live = await fetchLiveHackerNews();
      if (live && live.length > 0) {
        const existingIds = new Set(CURATED_TECH_NEWS.map((n) => n.id));
        const newLive = live.filter((n) => !existingIds.has(n.id));
        setNewsList([...CURATED_TECH_NEWS, ...newLive]);
        toast.success(`Updated with ${newLive.length} live stories!`);
      }
    } catch {
      // silent fallback
    } finally {
      setIsLoadingLive(false);
    }
  };

  const handleBookmarkToggle = (id: string, state?: boolean) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const shouldAdd = state !== undefined ? state : !exists;
      if (shouldAdd) {
        return exists ? prev : [id, ...prev];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  const handleLikeToggle = (id: string, state?: boolean) => {
    setLikedIds((prev) => {
      const exists = prev.includes(id);
      const shouldAdd = state !== undefined ? state : !exists;
      if (shouldAdd) {
        return exists ? prev : [id, ...prev];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  // Filter & Search
  const filteredNews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return newsList.filter((item) => {
      if (showSavedOnly && !bookmarkedIds.includes(item.id)) {
        return false;
      }
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (!query) return true;

      const titleMatch = item.title.toLowerCase().includes(query);
      const summaryMatch = item.summary.toLowerCase().includes(query);
      const takeawayMatch = item.studentTakeaway.toLowerCase().includes(query);
      const tagsMatch = item.tags.some((t) => t.toLowerCase().includes(query));
      const sourceMatch = item.source.toLowerCase().includes(query);

      return titleMatch || summaryMatch || takeawayMatch || tagsMatch || sourceMatch;
    });
  }, [newsList, selectedCategory, searchQuery, showSavedOnly, bookmarkedIds]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Normal Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Tech News
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Latest industry news, technology updates, and career tips for students.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLiveNews}
              disabled={isLoadingLive}
              className="h-9 gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingLive ? "animate-spin text-primary" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search news by keyword, company, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm bg-card rounded-lg"
            />
          </div>

          {/* Saved Filter Button */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant={!showSavedOnly ? "default" : "outline"}
              onClick={() => setShowSavedOnly(false)}
              className="h-9 text-xs"
            >
              All Articles ({newsList.length})
            </Button>

            <Button
              size="sm"
              variant={showSavedOnly ? "default" : "outline"}
              onClick={() => setShowSavedOnly(true)}
              className="h-9 text-xs gap-1.5"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Saved ({bookmarkedIds.length})</span>
            </Button>
          </div>
        </div>

        {/* Normal Responsive Grid of News Cards (1 col mobile, 2 col tablet, 3 col desktop) */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNews.map((news) => (
              <TechNewsCard
                key={news.id}
                news={news}
                isBookmarked={bookmarkedIds.includes(news.id)}
                onBookmarkToggle={handleBookmarkToggle}
                isLiked={likedIds.includes(news.id)}
                onLikeToggle={handleLikeToggle}
                onSelect={(item) => setSelectedNewsItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
            <Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="font-semibold text-base mb-1">
              No articles found
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              {showSavedOnly
                ? "You haven't bookmarked any tech articles yet. Click the bookmark icon on any article to build your reading list!"
                : "Try adjusting your search terms or category filter to explore more tech news."}
            </p>
            {showSavedOnly ? (
              <Button
                size="sm"
                onClick={() => setShowSavedOnly(false)}
                variant="outline"
              >
                View All Articles
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Reset Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Full Information Reader Modal */}
      <TechNewsDetailModal
        news={selectedNewsItem}
        isOpen={!!selectedNewsItem}
        onClose={() => setSelectedNewsItem(null)}
        isBookmarked={selectedNewsItem ? bookmarkedIds.includes(selectedNewsItem.id) : false}
        onBookmarkToggle={handleBookmarkToggle}
        isLiked={selectedNewsItem ? likedIds.includes(selectedNewsItem.id) : false}
        onLikeToggle={handleLikeToggle}
      />
    </div>
  );
};

export default TechNewsPage;
