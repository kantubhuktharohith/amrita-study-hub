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
  "Computer Science & Engineering (Big Data Analytics)",
  "Computer Science & Engineering (AI & ML)",
  "Computer Science & Engineering (Data Science)",
  "Computer Science & Engineering (Cyber Security)",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
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

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Data Structures Complete Notes",
    subject: "Data Structures & Algorithms",
    department: "Computer Science & Engineering",
    semester: 3,
    year: 2,
    fileURL: "#",
    fileType: "pdf",
    uploadedBy: "Ravi Kumar",
    uploadDate: "2026-02-15",
    description: "Comprehensive notes covering arrays, linked lists, trees, graphs, and sorting algorithms with examples.",
    downloads: 234,
    status: "approved",
  },
  {
    id: "2",
    title: "Digital Electronics Unit 1-3",
    subject: "Digital Electronics",
    department: "Electronics & Communication",
    semester: 4,
    year: 2,
    fileURL: "#",
    fileType: "pdf",
    uploadedBy: "Priya Sharma",
    uploadDate: "2026-02-10",
    description: "Covers Boolean algebra, logic gates, combinational circuits, and flip-flops.",
    downloads: 189,
    status: "approved",
  },
  {
    id: "3",
    title: "Engineering Mathematics III",
    subject: "Mathematics",
    department: "Computer Science & Engineering",
    semester: 3,
    year: 2,
    fileURL: "#",
    fileType: "pdf",
    uploadedBy: "Anil Reddy",
    uploadDate: "2026-01-28",
    description: "Laplace transforms, Fourier series, and partial differential equations.",
    downloads: 312,
    status: "approved",
  },
  {
    id: "4",
    title: "DBMS Lab Manual",
    subject: "Database Management Systems",
    department: "Computer Science & Engineering",
    semester: 4,
    year: 2,
    fileURL: "#",
    fileType: "pdf",
    uploadedBy: "Sneha Patel",
    uploadDate: "2026-03-01",
    description: "Complete lab manual with SQL queries, ER diagrams, and normalization examples.",
    downloads: 156,
    status: "approved",
  },
  {
    id: "5",
    title: "Thermodynamics Notes",
    subject: "Engineering Thermodynamics",
    department: "Mechanical Engineering",
    semester: 3,
    year: 2,
    fileURL: "#",
    fileType: "pdf",
    uploadedBy: "Karthik Rao",
    uploadDate: "2026-02-20",
    description: "Laws of thermodynamics, entropy, and heat engine cycles.",
    downloads: 98,
    status: "approved",
  },
  {
    id: "6",
    title: "Operating Systems Handwritten Notes",
    subject: "Operating Systems",
    department: "Computer Science & Engineering",
    semester: 5,
    year: 3,
    fileURL: "#",
    fileType: "image",
    uploadedBy: "Meera Nair",
    uploadDate: "2026-03-05",
    description: "Process scheduling, memory management, and deadlock concepts.",
    downloads: 45,
    status: "pending",
  },
];
