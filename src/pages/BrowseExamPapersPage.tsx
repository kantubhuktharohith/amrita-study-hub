import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ExamPaperCard from "@/components/ExamPaperCard";
import { fetchExamPapersWithProfiles } from "@/lib/noteQueries";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EXAM_TYPES, EXAM_YEARS } from "@/data/mockData";
import { Loader2, ArrowUpDown, X } from "lucide-react";

type SortOption = "newest" | "oldest" | "most-downloaded" | "title-az" | "title-za" | "top-rated";

const BrowseExamPapersPage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [year, setYear] = useState("all");
  const [examType, setExamType] = useState("all");
  const [examYear, setExamYear] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const { data: papers = [], isLoading } = useQuery({
    queryKey: ["exam-papers"],
    queryFn: () => fetchExamPapersWithProfiles({ status: "approved" }),
  });

  const { data: ratingsMap = {} } = useQuery({
    queryKey: ["all-exam-paper-ratings"],
    queryFn: async () => {
      const { data } = await supabase.from("ratings").select("content_id, rating").eq("content_type", "exam_paper");
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

  const hasActiveFilters = search || department !== "all" || semester !== "all" || year !== "all" || examType !== "all" || examYear !== "all";

  const clearFilters = () => {
    setSearch("");
    setDepartment("all");
    setSemester("all");
    setYear("all");
    setExamType("all");
    setExamYear("all");
  };

  const filtered = useMemo(() => {
    const result = papers
      .filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      })
      .filter((p) => department === "all" || p.department === department)
      .filter((p) => semester === "all" || p.semester === Number(semester))
      .filter((p) => year === "all" || p.year === Number(year))
      .filter((p) => examType === "all" || p.exam_type === examType)
      .filter((p) => examYear === "all" || p.exam_year === Number(examYear));

    switch (sort) {
      case "newest": return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "oldest": return result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "most-downloaded": return result.sort((a, b) => b.downloads - a.downloads);
      case "title-az": return result.sort((a, b) => a.title.localeCompare(b.title));
      case "title-za": return result.sort((a, b) => b.title.localeCompare(a.title));
      case "top-rated": return result.sort((a, b) => (ratingsMap[b.id] ?? 0) - (ratingsMap[a.id] ?? 0));
      default: return result;
    }
  }, [papers, search, department, semester, year, examType, examYear, sort, ratingsMap]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Exam Papers</h1>
        <p className="text-sm text-muted-foreground">Browse previous exam papers by subject, type, or year</p>
      </div>
      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search exam papers..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterPanel department={department} semester={semester} year={year} onDepartmentChange={setDepartment} onSemesterChange={setSemester} onYearChange={setYear} />
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger className="w-full min-w-[120px] sm:w-[150px] bg-card"><SelectValue placeholder="Exam Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {EXAM_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={examYear} onValueChange={setExamYear}>
            <SelectTrigger className="w-[130px] bg-card"><SelectValue placeholder="Exam Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {EXAM_YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
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
        <div className="py-16 text-center"><p className="text-muted-foreground">No exam papers found. Upload the first one!</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((paper) => <ExamPaperCard key={paper.id} paper={paper} />)}
        </div>
      )}
    </div>
  );
};

export default BrowseExamPapersPage;
