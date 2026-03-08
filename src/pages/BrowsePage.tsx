import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import NoteCard from "@/components/NoteCard";
import { fetchNotesWithProfiles } from "@/lib/noteQueries";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpDown, X } from "lucide-react";

type SortOption = "newest" | "oldest" | "most-downloaded" | "title-az" | "title-za" | "top-rated";

const BrowsePage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotesWithProfiles({ status: "approved" }),
  });

  const { data: ratingsMap = {} } = useQuery({
    queryKey: ["all-note-ratings"],
    queryFn: async () => {
      const { data } = await supabase.from("ratings").select("content_id, rating").eq("content_type", "note");
      if (!data) return {};
      const map: Record<string, { sum: number; count: number }> = {};
      data.forEach((r) => {
        if (!map[r.content_id]) map[r.content_id] = { sum: 0, count: 0 };
        map[r.content_id].sum += r.rating;
        map[r.content_id].count += 1;
      });
      return Object.fromEntries(
        Object.entries(map).map(([id, { sum, count }]) => [id, sum / count])
      );
    },
  });

  const hasActiveFilters = search || department !== "all" || semester !== "all" || year !== "all";

  const clearFilters = () => {
    setSearch("");
    setDepartment("all");
    setSemester("all");
    setYear("all");
  };

  const filtered = useMemo(() => {
    const result = notes
      .filter((n) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q);
      })
      .filter((n) => department === "all" || n.department === department)
      .filter((n) => semester === "all" || n.semester === Number(semester))
      .filter((n) => year === "all" || n.year === Number(year));

    switch (sort) {
      case "newest": return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "oldest": return result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "most-downloaded": return result.sort((a, b) => b.downloads - a.downloads);
      case "title-az": return result.sort((a, b) => a.title.localeCompare(b.title));
      case "title-za": return result.sort((a, b) => b.title.localeCompare(a.title));
      case "top-rated": return result.sort((a, b) => (ratingsMap[b.id] ?? 0) - (ratingsMap[a.id] ?? 0));
      default: return result;
    }
  }, [notes, search, department, semester, year, sort, ratingsMap]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Browse Notes</h1>
        <p className="text-sm text-muted-foreground">Find notes by subject, semester, or department</p>
      </div>
      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex flex-wrap items-center gap-3">
          <FilterPanel department={department} semester={semester} year={year} onDepartmentChange={setDepartment} onSemesterChange={setSemester} onYearChange={setYear} />
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[170px] bg-card">
              <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-downloaded">Most Downloaded</SelectItem>
              <SelectItem value="top-rated">Top Rated</SelectItem>
              <SelectItem value="title-az">Title A → Z</SelectItem>
              <SelectItem value="title-za">Title Z → A</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-1 h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      {!isLoading && filtered.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
      )}

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center"><p className="text-muted-foreground">No notes found. Try adjusting your filters or upload the first one!</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((note) => <NoteCard key={note.id} note={note} />)}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
