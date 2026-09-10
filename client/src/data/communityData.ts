import { DEPARTMENTS } from "./mockData";

export interface CommunityAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorUsername: string; // e.g. u/karthik_senior
  authorDepartment: string;
  authorYear: number;
  authorFlair?: string; // e.g. "Senior Mentor", "CSE '26"
  content: string;
  codeSnippet?: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface CommunityQuestion {
  id: string;
  authorId: string;
  authorUsername: string; // e.g. u/rahul_v
  authorDepartment: string;
  authorYear: number;
  authorFlair?: string;
  subCommunity: "r/all" | "r/cse" | "r/aiml" | "r/ece" | "r/eee" | "r/mech" | "r/civil" | "r/placements" | "r/general";
  title: string;
  content: string;
  codeSnippet?: string;
  department: typeof DEPARTMENTS[number] | "General Engineering";
  subject: string;
  semester: number;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | 0;
  views: number;
  isResolved: boolean;
  acceptedAnswerId?: string;
  createdAt: string;
  answers: CommunityAnswer[];
}

export const SUB_COMMUNITIES = [
  { id: "r/all", label: "r/all", desc: "All-in-One Community Feed", icon: "🌐" },
  { id: "r/cse", label: "r/cse", desc: "Computer Science & Engineering", icon: "💻" },
  { id: "r/aiml", label: "r/aiml", desc: "CSE (AI & Machine Learning)", icon: "🤖" },
  { id: "r/datascience", label: "r/datascience", desc: "CSE (Data Science & Analytics)", icon: "📊" },
  { id: "r/cybersec", label: "r/cybersec", desc: "CSE (Cyber Security & Defense)", icon: "🛡️" },
  { id: "r/bigdata", label: "r/bigdata", desc: "CSE (Big Data Analytics)", icon: "🗄️" },
  { id: "r/ece", label: "r/ece", desc: "Electronics & Communication", icon: "⚡" },
  { id: "r/eee", label: "r/eee", desc: "Electrical & Electronics", icon: "🔋" },
  { id: "r/mech", label: "r/mech", desc: "Mechanical Engineering", icon: "⚙️" },
  { id: "r/civil", label: "r/civil", desc: "Civil Engineering", icon: "🏗️" },
  { id: "r/placements", label: "r/placements", desc: "Placements, Resumes & Drives", icon: "💼" },
  { id: "r/general", label: "r/general", desc: "General Campus & Student Life", icon: "🎓" },
] as const;

export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: "q-1",
    authorId: "u-101",
    authorUsername: "u/rahul_varma",
    authorDepartment: "Computer Science & Engineering",
    authorYear: 2,
    authorFlair: "CSE '27",
    subCommunity: "r/cse",
    title: "How to avoid infinite recursion when implementing DFS in an undirected graph?",
    content: "I am writing a Depth First Search (DFS) in C++ for my Data Structures lab assignment, but my code keeps hitting a segmentation fault on cyclic graphs. How should I properly keep track of visited nodes?",
    codeSnippet: `void dfs(int u, vector<int> adj[]) {
    cout << u << " ";
    for (int v : adj[u]) {
        dfs(v, adj); // Segfault happens here on cycles!
    }
}`,
    department: "Computer Science & Engineering",
    subject: "Data Structures & Algorithms",
    semester: 3,
    tags: ["C++", "Graphs", "DFS", "Recursion"],
    upvotes: 24,
    downvotes: 1,
    views: 182,
    isResolved: true,
    acceptedAnswerId: "ans-1",
    createdAt: "2026-03-08T10:30:00Z",
    answers: [
      {
        id: "ans-1",
        questionId: "q-1",
        authorId: "u-201",
        authorUsername: "u/karthik_reddy",
        authorDepartment: "Computer Science & Engineering",
        authorYear: 4,
        authorFlair: "Senior Mentor 🎖️",
        content: "In an undirected graph, every edge goes both ways (u <-> v). Without a boolean `visited` array or `unordered_set`, node A calls node B, which calls node A again endlessly until stack overflow.\n\nPass a `vector<bool>& visited` and mark `visited[u] = true` before exploring neighbors.",
        codeSnippet: `void dfs(int u, vector<int> adj[], vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v, adj, visited);
        }
    }
}`,
        upvotes: 31,
        isAccepted: true,
        createdAt: "2026-03-08T11:15:00Z",
      },
    ],
  },
  {
    id: "q-2",
    authorId: "u-102",
    authorUsername: "u/ananya_ece",
    authorDepartment: "Electronics & Communication",
    authorYear: 3,
    authorFlair: "ECE '26",
    subCommunity: "r/ece",
    title: "Difference between blocking (=) and non-blocking (<=) assignments in Verilog?",
    content: "I am preparing for Digital System Design and VLSI lab exam. When should we strictly use non-blocking `<=` versus blocking `=` assignments inside always blocks?",
    department: "Electronics & Communication",
    subject: "VLSI Design & Technology",
    semester: 5,
    tags: ["Verilog", "VLSI", "Digital Logic", "FPGA"],
    upvotes: 35,
    downvotes: 0,
    views: 245,
    isResolved: true,
    acceptedAnswerId: "ans-2",
    createdAt: "2026-03-07T14:20:00Z",
    answers: [
      {
        id: "ans-2",
        questionId: "q-2",
        authorId: "u-202",
        authorUsername: "u/sai_kiran_vlsi",
        authorDepartment: "Electronics & Communication",
        authorYear: 4,
        authorFlair: "VLSI Specialist ⚡",
        content: "Rule of Thumb for FPGA & ASIC synthesis:\n1. Sequential Logic (e.g. `always @(posedge clk)`): Always use Non-Blocking (`<=`). This evaluates right-hand sides concurrently, modeling flip-flops without race conditions.\n2. Combinational Logic (e.g. `always @(*)`): Always use Blocking (`=`). Statements evaluate in sequential order.",
        upvotes: 42,
        isAccepted: true,
        createdAt: "2026-03-07T15:00:00Z",
      },
    ],
  },
  {
    id: "q-3",
    authorId: "u-104",
    authorUsername: "u/sneha_ai",
    authorDepartment: "Computer Science & Engineering (AI & ML)",
    authorYear: 3,
    authorFlair: "AIML '26",
    subCommunity: "r/aiml",
    title: "Why does PyTorch model loss not decrease during training with BCEWithLogitsLoss?",
    content: "I am training a binary classifier in PyTorch. I noticed my loss is stuck around 0.693 and accuracy is 50%. I applied `nn.Sigmoid()` inside my forward pass and then used `nn.BCEWithLogitsLoss()`. What is wrong?",
    codeSnippet: `class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(128, 1)
        self.sigmoid = nn.Sigmoid()
        
    def forward(self, x):
        return self.sigmoid(self.fc(x)) # Warning!

criterion = nn.BCEWithLogitsLoss()`,
    department: "Computer Science & Engineering (AI & ML)",
    subject: "Deep Learning & Neural Networks",
    semester: 6,
    tags: ["PyTorch", "DeepLearning", "LossFunction", "Python"],
    upvotes: 28,
    downvotes: 1,
    views: 195,
    isResolved: true,
    acceptedAnswerId: "ans-4",
    createdAt: "2026-03-06T16:45:00Z",
    answers: [
      {
        id: "ans-4",
        questionId: "q-4",
        authorId: "u-204",
        authorUsername: "u/praveen_ml",
        authorDepartment: "Computer Science & Engineering (AI & ML)",
        authorYear: 4,
        authorFlair: "AI Fellow 🤖",
        content: "`BCEWithLogitsLoss` combines a `Sigmoid` layer and standard `BCELoss` internally for numerical stability.\n\nIf you pass already sigmoided outputs (range 0 to 1) into `BCEWithLogitsLoss`, it applies Sigmoid twice, saturating gradients!\n\nFix: Remove `self.sigmoid` from your `forward()` and return raw linear logits `return self.fc(x)`.",
        upvotes: 36,
        isAccepted: true,
        createdAt: "2026-03-06T17:10:00Z",
      },
    ],
  },
  {
    id: "q-4",
    authorId: "u-105",
    authorUsername: "u/manoj_eee",
    authorDepartment: "Electrical & Electronics",
    authorYear: 3,
    authorFlair: "EEE '26",
    subCommunity: "r/eee",
    title: "How to choose capacitor and inductor values for a Buck Converter in MATLAB Simulink?",
    content: "For our Power Electronics mini project, we need to design a step-down buck converter (Vin = 24V, Vout = 12V, Iout = 2A, Switching freq = 50kHz, Ripple <= 1%). What are the design formulas for L and C?",
    department: "Electrical & Electronics",
    subject: "Power Electronics",
    semester: 5,
    tags: ["PowerElectronics", "Simulink", "MATLAB", "BuckConverter"],
    upvotes: 16,
    downvotes: 0,
    views: 140,
    isResolved: false,
    createdAt: "2026-03-09T18:00:00Z",
    answers: [],
  },
  {
    id: "q-5",
    authorId: "u-103",
    authorUsername: "u/venkat_mech",
    authorDepartment: "Mechanical Engineering",
    authorYear: 2,
    authorFlair: "ME '27",
    subCommunity: "r/mech",
    title: "How to calculate Principal Stresses using Mohr's Circle for combined bending and torsion?",
    content: "In Strength of Materials Unit 2, we have a circular shaft subjected to both bending moment M and twisting moment T. What is the standard formula for maximum normal stress and shear stress?",
    department: "Mechanical Engineering",
    subject: "Strength of Materials",
    semester: 3,
    tags: ["SOM", "MohrsCircle", "Mechanics", "Formulas"],
    upvotes: 19,
    downvotes: 0,
    views: 110,
    isResolved: false,
    createdAt: "2026-03-09T09:10:00Z",
    answers: [
      {
        id: "ans-3",
        questionId: "q-5",
        authorId: "u-203",
        authorUsername: "u/suresh_senior",
        authorDepartment: "Mechanical Engineering",
        authorYear: 3,
        authorFlair: "CAD/SOM Topper",
        content: "For circular solid shaft:\n- Equivalent Bending Moment: Me = 0.5 * (M + sqrt(M^2 + T^2))\n- Equivalent Twisting Moment: Te = sqrt(M^2 + T^2)\n- Max Normal Stress: sigma_1 = (16 / (pi * d^3)) * (M + sqrt(M^2 + T^2))\n- Max Shear Stress: tau_max = (16 / (pi * d^3)) * sqrt(M^2 + T^2).",
        upvotes: 14,
        isAccepted: false,
        createdAt: "2026-03-09T10:05:00Z",
      },
    ],
  },
  {
    id: "q-6",
    authorId: "u-106",
    authorUsername: "u/divya_civil",
    authorDepartment: "Civil Engineering",
    authorYear: 3,
    authorFlair: "Civil '26",
    subCommunity: "r/civil",
    title: "Minimum & maximum percentage of steel reinforcement required for RC columns as per IS 456:2000?",
    content: "While designing short RC columns in Design of RC Structures, what is the minimum and maximum longitudinal reinforcement percentage per IS 456 Clause 26.5.3.1?",
    department: "Civil Engineering",
    subject: "Design of Reinforced Concrete Structures",
    semester: 5,
    tags: ["IS456", "RCC", "StructuralDesign", "CivilCodes"],
    upvotes: 22,
    downvotes: 0,
    views: 160,
    isResolved: true,
    acceptedAnswerId: "ans-6",
    createdAt: "2026-03-05T12:00:00Z",
    answers: [
      {
        id: "ans-6",
        questionId: "q-6",
        authorId: "u-206",
        authorUsername: "u/ramesh_structural",
        authorDepartment: "Civil Engineering",
        authorYear: 4,
        authorFlair: "Structural Senior 🏗️",
        content: "Per IS 456:2000 Clause 26.5.3.1:\n1. Minimum steel = 0.8% of Gross Cross-sectional Area (Ag).\n2. Maximum steel = 6% of Ag (restricted to 4% where bars are lapped).\n3. Min bar diameter = 12mm, min 4 bars for rectangular and 6 for circular columns.",
        upvotes: 27,
        isAccepted: true,
        createdAt: "2026-03-05T12:30:00Z",
      },
    ],
  },
];
