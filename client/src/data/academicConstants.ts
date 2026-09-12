export interface Note {
  id: string;
  title: string;
  subject: string;
  department: string;
  semester: number;
  year: number;
  fileURL: string;
  fileType: "pdf" | "image" | "doc";
  uploadedBy: string;
  uploadDate: string;
  description?: string;
  downloads: number;
  status: "approved" | "pending" | "rejected";
}

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Computer Science & Engineering (AIDS)",
  "Computer Science & Engineering (Big Data Analytics)",
  "Computer Science & Engineering (AI & ML)",
  "Computer Science & Engineering (Data Science)",
  "Computer Science & Engineering (Cyber Security)",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Programming & Tech",
  "General / All Branches",
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export const YEARS = [1, 2, 3, 4] as const;

export const EXAM_TYPES = [
  { value: "mid-1", label: "Mid 1" },
  { value: "mid-2", label: "Mid 2" },
  { value: "semester", label: "Semester End" },
  { value: "supply", label: "Supplementary" },
  { value: "internal", label: "Internal" },
] as const;

export const EXAM_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;
