import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import NoteCard from "@/components/NoteCard";
import { mockNotes } from "@/data/mockData";

const BrowsePage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [semester, setSemester] = useState("all");
  const [year, setYear] = useState("all");

  const filtered = useMemo(() => {
    return mockNotes
      .filter((n) => n.status === "approved")
      .filter((n) => {
        if (search) {
          const q = search.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.subject.toLowerCase().includes(q) ||
            n.description?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .filter((n) => department === "all" || n.department === department)
      .filter((n) => semester === "all" || n.semester === Number(semester))
      .filter((n) => year === "all" || n.year === Number(year));
  }, [search, department, semester, year]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Browse Notes</h1>
        <p className="text-sm text-muted-foreground">
          Find notes by subject, semester, or department
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          department={department}
          semester={semester}
          year={year}
          onDepartmentChange={setDepartment}
          onSemesterChange={setSemester}
          onYearChange={setYear}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No notes found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
