import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS, SEMESTERS, YEARS } from "@/data/mockData";

interface FilterPanelProps {
  department: string;
  semester: string;
  year: string;
  onDepartmentChange: (v: string) => void;
  onSemesterChange: (v: string) => void;
  onYearChange: (v: string) => void;
}

const FilterPanel = ({
  department, semester, year,
  onDepartmentChange, onSemesterChange, onYearChange,
}: FilterPanelProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={department} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-full min-w-[140px] sm:w-[200px] bg-card">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {DEPARTMENTS.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={semester} onValueChange={onSemesterChange}>
        <SelectTrigger className="w-[140px] bg-card">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Semesters</SelectItem>
          {SEMESTERS.map((s) => (
            <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={onYearChange}>
        <SelectTrigger className="w-[120px] bg-card">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterPanel;
