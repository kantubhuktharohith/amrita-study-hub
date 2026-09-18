import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CareerPath } from "@/data/careerData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  ListTree,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export interface MindMapBranch {
  name: string;
  color: string;
  strokeColor: string;
  side: "left" | "right";
  subBranches: {
    name: string;
    items: string[];
  }[];
}

// Preset comprehensive tree mind-maps matching the Coggle aesthetic
export const COURSE_MIND_MAPS: Record<string, { left: MindMapBranch[]; right: MindMapBranch[] }> = {
  // 1. Full Stack Software Engineer (Matches the user's reference image closely!)
  "cse-fullstack-dev": {
    left: [
      {
        name: "Frontend",
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
        strokeColor: "#f59e0b",
        side: "left",
        subBranches: [
          {
            name: "Basic Web Tech",
            items: ["HTML5 Semantic", "CSS3 & Flex/Grid", "JavaScript (ES6+)", "TypeScript"],
          },
          {
            name: "Frontend Frameworks",
            items: ["React / Next.js", "State (Redux/Zustand)", "Tailwind CSS", "shadcn/ui & Radix"],
          },
          {
            name: "Build Tools & IDEs",
            items: ["VS Code", "Vite / Webpack", "NPM & PNPM", "Chrome DevTools"],
          },
        ],
      },
      {
        name: "Deployment & Cloud",
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        strokeColor: "#06b6d4",
        side: "left",
        subBranches: [
          {
            name: "Cloud Hosting",
            items: ["Vercel / Netlify", "AWS (EC2, S3, CloudFront)", "Render / Railway"],
          },
          {
            name: "Containers & CI/CD",
            items: ["Docker Basics", "GitHub Actions CI/CD", "Nginx Reverse Proxy"],
          },
        ],
      },
    ],
    right: [
      {
        name: "Backend",
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
        strokeColor: "#3b82f6",
        side: "right",
        subBranches: [
          {
            name: "Runtime & APIs",
            items: ["Node.js & Express", "Java Spring Boot / Python", "RESTful Architecture", "WebSockets"],
          },
          {
            name: "Security & Auth",
            items: ["JWT Authentication", "OAuth 2.0 / Google", "Password Hashing (Bcrypt)", "CORS & Rate Limiting"],
          },
        ],
      },
      {
        name: "Databases & Storage",
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
        strokeColor: "#8b5cf6",
        side: "right",
        subBranches: [
          {
            name: "Relational (RDBMS)",
            items: ["PostgreSQL", "MySQL", "Prisma / Hibernate ORM", "SQL Indexing & Joins"],
          },
          {
            name: "NoSQL & Caching",
            items: ["MongoDB", "Redis In-Memory Cache", "Supabase / Firebase"],
          },
        ],
      },
      {
        name: "Tools & Testing",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        strokeColor: "#10b981",
        side: "right",
        subBranches: [
          {
            name: "Dev Tools",
            items: ["Git & GitHub", "Postman / Thunder Client", "Linux CLI Terminal", "Docker CLI"],
          },
          {
            name: "Testing & Quality",
            items: ["Unit Testing (Jest/Vitest)", "API Integration Testing", "E2E Testing (Playwright)"],
          },
        ],
      },
    ],
  },

  // 2. Machine Learning & AI Engineer
  "aiml-ml-engineer": {
    left: [
      {
        name: "Mathematics & Data",
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
        strokeColor: "#f59e0b",
        side: "left",
        subBranches: [
          {
            name: "Mathematical Core",
            items: ["Linear Algebra (Matrices/Vectors)", "Multivariate Calculus", "Probability & Statistics"],
          },
          {
            name: "Data Wrangling",
            items: ["Python (NumPy, Pandas)", "Data Cleaning & Imputation", "Feature Engineering"],
          },
          {
            name: "Data Visualization",
            items: ["Matplotlib & Seaborn", "Plotly Dashboards", "Power BI / Tableau"],
          },
        ],
      },
      {
        name: "MLOps & Deployment",
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        strokeColor: "#06b6d4",
        side: "left",
        subBranches: [
          {
            name: "Model Serving",
            items: ["FastAPI REST Microservices", "Docker for ML Models", "Streamlit & Gradio UIs"],
          },
          {
            name: "Pipeline Tracking",
            items: ["MLflow Experiment Tracker", "Weights & Biases", "AWS SageMaker"],
          },
        ],
      },
    ],
    right: [
      {
        name: "Core Machine Learning",
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
        strokeColor: "#3b82f6",
        side: "right",
        subBranches: [
          {
            name: "Supervised Learning",
            items: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "XGBoost & LightGBM"],
          },
          {
            name: "Unsupervised Learning",
            items: ["K-Means Clustering", "PCA Dimensionality Reduction", "KNN & Anomaly Detection"],
          },
        ],
      },
      {
        name: "Deep Learning & GenAI",
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
        strokeColor: "#8b5cf6",
        side: "right",
        subBranches: [
          {
            name: "Neural Networks",
            items: ["PyTorch & TensorFlow", "CNNs (Computer Vision / YOLO)", "RNNs & LSTMs"],
          },
          {
            name: "Generative AI & LLMs",
            items: ["Hugging Face Transformers", "RAG Pipelines (Retrieval Augmentation)", "LangChain & LlamaIndex", "Vector DBs (Chroma/Pinecone)"],
          },
        ],
      },
      {
        name: "Toolkits & Hardware",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        strokeColor: "#10b981",
        side: "right",
        subBranches: [
          {
            name: "Environments",
            items: ["JupyterLab & Colab", "VS Code with Python", "Git / GitHub Version Control"],
          },
          {
            name: "Accelerated Compute",
            items: ["CUDA / NVIDIA GPUs", "TensorRT", "Google Cloud TPUs"],
          },
        ],
      },
    ],
  },

  // 3. Cloud & DevOps Engineer
  "cse-cloud-devops": {
    left: [
      {
        name: "Linux & Networking",
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
        strokeColor: "#f59e0b",
        side: "left",
        subBranches: [
          {
            name: "Linux Administration",
            items: ["Bash Scripting", "Systemd & Process Management", "SSH, Permissions & Crontab"],
          },
          {
            name: "Cloud Networking",
            items: ["TCP/IP & Subnetting (CIDR)", "DNS, Route 53 & SSL/TLS", "VPC, NAT Gateways & Firewalls"],
          },
        ],
      },
      {
        name: "CI/CD & Automation",
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        strokeColor: "#06b6d4",
        side: "left",
        subBranches: [
          {
            name: "Automation Pipelines",
            items: ["GitHub Actions Workflows", "Jenkins Declarative Pipelines", "GitLab CI"],
          },
          {
            name: "Security in CI/CD",
            items: ["Trivy Container Scanner", "SonarQube Code Analysis", "Secret Management (Vault)"],
          },
        ],
      },
    ],
    right: [
      {
        name: "Containers & K8s",
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
        strokeColor: "#3b82f6",
        side: "right",
        subBranches: [
          {
            name: "Containerization",
            items: ["Docker Architecture", "Multi-stage Dockerfiles", "Docker Compose Multi-Container"],
          },
          {
            name: "Kubernetes (K8s)",
            items: ["Pods, Services & Deployments", "Ingress Controllers", "Helm Package Manager", "EKS / GKE Clusters"],
          },
        ],
      },
      {
        name: "Infrastructure as Code",
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
        strokeColor: "#8b5cf6",
        side: "right",
        subBranches: [
          {
            name: "IaC Tools",
            items: ["Terraform HCL Modules", "Ansible Playbooks", "CloudFormation"],
          },
          {
            name: "Public Clouds",
            items: ["AWS (EC2, S3, IAM, RDS)", "Microsoft Azure Core", "Google Cloud Platform"],
          },
        ],
      },
      {
        name: "Monitoring & Observability",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        strokeColor: "#10b981",
        side: "right",
        subBranches: [
          {
            name: "Metrics & Logs",
            items: ["Prometheus Metrics Exporter", "Grafana Dashboards", "ELK / Loki Log Stacks"],
          },
          {
            name: "Reliability Engineering",
            items: ["SLAs, SLOs & Error Budgets", "Incident Management & PagerDuty", "Chaos Engineering"],
          },
        ],
      },
    ],
  },

  // 4. Cyber Security & Ethical Hacking
  "cse-cyber-security": {
    left: [
      {
        name: "Foundations & Networks",
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
        strokeColor: "#f59e0b",
        side: "left",
        subBranches: [
          {
            name: "Network Protocol Security",
            items: ["OSI 7 Layers", "Packet Inspection (Wireshark)", "VPNs, Firewalls & IDS/IPS"],
          },
          {
            name: "Operating System Auditing",
            items: ["Kali Linux & Parrot OS", "Windows Active Directory & Kerberos", "Bash & Python for Hackers"],
          },
        ],
      },
      {
        name: "Security Operations (Blue)",
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        strokeColor: "#06b6d4",
        side: "left",
        subBranches: [
          {
            name: "SOC & SIEM",
            items: ["Splunk Enterprise SIEM", "Wazuh EDR & Snort IDS", "Log Analysis & Threat Detection"],
          },
          {
            name: "Incident Response",
            items: ["Digital Forensics (Autopsy/Volatility)", "Malware Sandboxing", "Root Cause Incident Reports"],
          },
        ],
      },
    ],
    right: [
      {
        name: "Offensive Security (Red)",
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
        strokeColor: "#f43f5e",
        side: "right",
        subBranches: [
          {
            name: "Web Application Pentesting",
            items: ["OWASP Top 10 Vulnerabilities", "Burp Suite Professional", "SQL Injection, XSS, CSRF", "API Security Testing"],
          },
          {
            name: "Network Penetration",
            items: ["Nmap Port Scanning", "Metasploit Framework", "Privilege Escalation (Linux/Windows)"],
          },
        ],
      },
      {
        name: "Cloud & Cryptography",
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
        strokeColor: "#8b5cf6",
        side: "right",
        subBranches: [
          {
            name: "Cryptography",
            items: ["Symmetric (AES) & Asymmetric (RSA)", "Hashing (SHA-256) & Salt", "Public Key Infrastructure (PKI)"],
          },
          {
            name: "Cloud Security",
            items: ["AWS IAM Least Privilege", "CloudTrail & GuardDuty", "Kubernetes Pod Security"],
          },
        ],
      },
      {
        name: "CTF Platforms & Certs",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        strokeColor: "#10b981",
        side: "right",
        subBranches: [
          {
            name: "Hands-on Practice",
            items: ["TryHackMe Learning Paths", "HackTheBox Active Labs", "PicoCTF & OverTheWire"],
          },
          {
            name: "Certifications",
            items: ["CompTIA Security+", "eJPT (Junior Penetration Tester)", "CEH (Certified Ethical Hacker)"],
          },
        ],
      },
    ],
  },
};

// Helper: Generates a dynamic, high-quality mind map for any career that does not have a hardcoded preset
function generateDynamicMindMap(career: CareerPath): { left: MindMapBranch[]; right: MindMapBranch[] } {
  const tools = career.toolsAndFrameworks || [];
  const primary = career.primarySkills || [];
  const secondary = career.secondarySkills || [];
  const college = career.recommendedCoursesInCollege || [];

  return {
    left: [
      {
        name: "Core Foundations",
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
        strokeColor: "#f59e0b",
        side: "left",
        subBranches: [
          {
            name: "Fundamental Concepts",
            items: primary.slice(0, 3).length > 0 ? primary.slice(0, 3) : ["Basics & Principles", "Problem Solving", "Core Logic"],
          },
          {
            name: "Academic Subjects",
            items: college.slice(0, 3).length > 0 ? college.slice(0, 3) : ["Theory & Lab Practice", "Department Core Courses"],
          },
        ],
      },
      {
        name: "Tools & Frameworks",
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        strokeColor: "#06b6d4",
        side: "left",
        subBranches: [
          {
            name: "Software & IDEs",
            items: tools.slice(0, 4).length > 0 ? tools.slice(0, 4) : ["Industry Standard Software", "Development Environments"],
          },
        ],
      },
    ],
    right: [
      {
        name: "Specialized Stack",
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30",
        strokeColor: "#3b82f6",
        side: "right",
        subBranches: [
          {
            name: "Technical Competencies",
            items: primary.slice(3).concat(secondary.slice(0, 2)).slice(0, 4),
          },
        ],
      },
      {
        name: "Advanced & Industry",
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
        strokeColor: "#8b5cf6",
        side: "right",
        subBranches: [
          {
            name: "Projects & Production",
            items: career.projectIdeas?.map((p) => p.title).slice(0, 3) || ["Capstone Industry Project", "Practical Mini Project"],
          },
        ],
      },
      {
        name: "Career & Credentials",
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        strokeColor: "#10b981",
        side: "right",
        subBranches: [
          {
            name: "Certifications",
            items: career.keyCertifications?.map((c) => c.name).slice(0, 2) || ["Professional Certificate", "Industry Endorsement"],
          },
        ],
      },
    ],
  };
}

interface CourseMindMapRoadmapProps {
  career: CareerPath;
}

export const CourseMindMapRoadmap: React.FC<CourseMindMapRoadmapProps> = ({ career }) => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItemComplete = (item: string) => {
    setCompletedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleBrowseNotes = (item: string) => {
    // Extract a clean search term from the item name
    const searchTerm = item.replace(/\s*\(.*?\)\s*/g, '').replace(/\s*\/\s*/g, ' ').trim();
    navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
  };

  const mindMapData = useMemo(() => {
    return COURSE_MIND_MAPS[career.id] || generateDynamicMindMap(career);
  }, [career]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.65, Number((prev + delta).toFixed(2)))));
  };

  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      className={`relative w-full rounded-xl border bg-card/60 backdrop-blur-xs overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-2 sm:inset-6 z-50 bg-background/95 shadow-2xl border-primary/40 flex flex-col"
          : "min-h-[550px]"
      }`}
    >
      {/* Mind Map Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:px-4 border-b bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs bg-primary/10 border-primary/30 text-primary py-0.5 px-2 font-semibold flex items-center gap-1"
          >
            <ListTree className="h-3.5 w-3.5" /> Interactive Tree Mind Map
          </Badge>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Hover branches or click concepts to track learning
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.1)}
            title="Zoom Out"
            className="h-7 w-7 p-0"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-mono px-1 text-muted-foreground min-w-[42px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.1)}
            title="Zoom In"
            className="h-7 w-7 p-0"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mind Map"}
            className="h-7 px-2 text-xs"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Pannable / Scrollable SVG & HTML Mind Map Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-[460px] relative select-none">
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="origin-center w-full max-w-5xl py-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-11 items-center gap-4 lg:gap-2">
            
            {/* LEFT SIDE BRANCHES (YELLOW / TEAL) */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:items-end order-2 lg:order-1">
              {mindMapData.left.map((branch, bIdx) => (
                <div
                  key={branch.name}
                  onMouseEnter={() => setActiveBranch(branch.name)}
                  onMouseLeave={() => setActiveBranch(null)}
                  className={`w-full max-w-sm rounded-xl border p-3.5 sm:p-4 transition-all duration-300 shadow-xs relative ${
                    activeBranch === branch.name
                      ? "ring-2 ring-primary/40 shadow-md scale-[1.01]"
                      : ""
                  } ${branch.color}`}
                >
                  {/* Branch Title Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-border/50">
                    <span className="font-bold text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: branch.strokeColor }}
                      />
                      {branch.name}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {branch.subBranches.reduce((acc, sb) => acc + sb.items.length, 0)} items
                    </Badge>
                  </div>

                  {/* Sub-branches & leaf concepts */}
                  <div className="space-y-3">
                    {branch.subBranches.map((sub, sIdx) => (
                      <div key={sub.name} className="space-y-1">
                        <div className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1">
                          <span
                            className="inline-block h-1 w-3 rounded-full"
                            style={{ backgroundColor: branch.strokeColor }}
                          />
                          {sub.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-3">
                          {sub.items.map((item) => {
                            const isDone = completedItems[item];
                            return (
                              <div key={item} className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => toggleItemComplete(item)}
                                  className={`text-[11px] px-2 py-1 rounded-md border text-left transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                                    isDone
                                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 line-through"
                                      : "bg-background/80 hover:bg-background text-foreground/90 hover:border-primary/50 shadow-xs"
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                  ) : (
                                    <span
                                      className="h-1.5 w-1.5 rounded-full shrink-0 opacity-60"
                                      style={{ backgroundColor: branch.strokeColor }}
                                    />
                                  )}
                                  <span>{item}</span>
                                </button>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleBrowseNotes(item);
                                      }}
                                      className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                                      aria-label={`Browse notes for ${item}`}
                                    >
                                      <BookOpen className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-[11px]">
                                    Browse notes for "{item}"
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER ROOT NODE (COGGLE STYLE CORE) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-2 order-1 lg:order-2">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-primary to-blue-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />

                {/* Central Pill Box */}
                <div className="relative bg-card border-2 border-primary/40 rounded-xl p-4 sm:p-5 text-center shadow-xl max-w-xs mx-auto">
                  <Badge className="bg-hero-gradient text-white text-[10px] uppercase tracking-wider mb-2 font-bold px-2 py-0.5 border-0">
                    Target Role Roadmap
                  </Badge>
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-foreground leading-snug">
                    {career.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 line-clamp-2">
                    {career.department} · {career.category}
                  </p>
                  <div className="mt-3 pt-2 border-t text-[10px] text-primary font-semibold flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" /> Branching Concept Map
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE BRANCHES (BLUE / PURPLE / GREEN) */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:items-start order-3">
              {mindMapData.right.map((branch) => (
                <div
                  key={branch.name}
                  onMouseEnter={() => setActiveBranch(branch.name)}
                  onMouseLeave={() => setActiveBranch(null)}
                  className={`w-full max-w-sm rounded-xl border p-3.5 sm:p-4 transition-all duration-300 shadow-xs relative ${
                    activeBranch === branch.name
                      ? "ring-2 ring-primary/40 shadow-md scale-[1.01]"
                      : ""
                  } ${branch.color}`}
                >
                  {/* Branch Title Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-border/50">
                    <span className="font-bold text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: branch.strokeColor }}
                      />
                      {branch.name}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {branch.subBranches.reduce((acc, sb) => acc + sb.items.length, 0)} items
                    </Badge>
                  </div>

                  {/* Sub-branches & leaf concepts */}
                  <div className="space-y-3">
                    {branch.subBranches.map((sub) => (
                      <div key={sub.name} className="space-y-1">
                        <div className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1">
                          <span
                            className="inline-block h-1 w-3 rounded-full"
                            style={{ backgroundColor: branch.strokeColor }}
                          />
                          {sub.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-3">
                          {sub.items.map((item) => {
                            const isDone = completedItems[item];
                            return (
                              <div key={item} className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => toggleItemComplete(item)}
                                  className={`text-[11px] px-2 py-1 rounded-md border text-left transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                                    isDone
                                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 line-through"
                                      : "bg-background/80 hover:bg-background text-foreground/90 hover:border-primary/50 shadow-xs"
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                  ) : (
                                    <span
                                      className="h-1.5 w-1.5 rounded-full shrink-0 opacity-60"
                                      style={{ backgroundColor: branch.strokeColor }}
                                    />
                                  )}
                                  <span>{item}</span>
                                </button>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleBrowseNotes(item);
                                      }}
                                      className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                                      aria-label={`Browse notes for ${item}`}
                                    >
                                      <BookOpen className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-[11px]">
                                    Browse notes for "{item}"
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>

      {/* Footer Instructions / Progress Tracking status */}
      <div className="p-2.5 sm:px-4 border-t bg-muted/20 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span>
            Learned:{" "}
            <strong className="text-foreground">
              {Object.values(completedItems).filter(Boolean).length}
            </strong>{" "}
            topics
          </span>
        </div>
        <div className="text-[11px]">
          Tip: Click any concept to mark as learned · Click the 📖 icon to browse related notes!
        </div>
      </div>
    </div>
  );
};
