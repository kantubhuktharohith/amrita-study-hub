import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ExamPaperCard from "@/components/ExamPaperCard";
import { fetchExamPapersWithProfiles } from "@/lib/noteQueries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXAM_TYPES, EXAM_YEARS } from "@/data/mockData";
import { Loader2 } from "lucide-react";

const BrowseExamPapersPage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [year, setYear] = useState("all");
  const [examType, setExamType] = useState("all");
  const [examYear, setExamYear] = useState("all");

  const { data: papers = [], isLoading } = useQuery({
    queryKey: ["exam-papers"],
    queryFn: () => fetchExamPapersWithProfiles({ status: "approved" }),
  });

  const filtered = useMemo(() => {
    return papers
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
  }, [papers, search, department, semester, year, examType, examYear]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Exam Papers</h1>
        <p className="text-sm text-muted-foreground">Browse previous exam papers by subject, type, or year</p>
      </div>
      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search exam papers..." />
        <div className="flex flex-wrap gap-3">
          <FilterPanel department={department} semester={semester} year={year} onDepartmentChange={setDepartment} onSemesterChange={setSemester} onYearChange={setYear} />
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder="Exam Type" /></SelectTrigger>
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
        </div>
      </div>
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
