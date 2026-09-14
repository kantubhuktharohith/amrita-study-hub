export interface TechNewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string[]; // Rich multi-paragraph complete article information
  keyPoints?: string[]; // Bullet highlights
  studentTakeaway: string;
  interviewQuestion?: {
    question: string;
    answer: string;
  };
  category: "ai" | "software" | "cyber" | "hardware" | "placements" | "cloud";
  source: string;
  sourceLogo?: string;
  sourceBadgeText?: string;
  sourceBadgeBg?: string;
  sourceBadgeColor?: string;
  url: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  isHot?: boolean;
  imageUrl: string;
  author?: string;
  likesCount?: number;
}

export interface TechVideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  channel: string;
  views: string;
  publishedAt: string;
  duration?: string;
  isLive?: boolean;
}

export const TECH_CATEGORIES = [
  { id: "all", label: "All News", icon: "🌐" },
  { id: "ai", label: "AI & GenAI", icon: "🤖" },
  { id: "software", label: "Software & Web", icon: "💻" },
  { id: "cyber", label: "Cyber Security", icon: "🛡️" },
  { id: "placements", label: "Hiring & Placements", icon: "💼" },
  { id: "hardware", label: "Chips & Hardware", icon: "⚡" },
  { id: "cloud", label: "Cloud & DevOps", icon: "☁️" },
] as const;

export const CURATED_TECH_NEWS: TechNewsItem[] = [
  {
    id: "news-rust-tier1",
    title: "Microsoft Elevates Rust to a Tier-1 Language for Windows Kernel & Azure Cloud",
    summary:
      "Microsoft has officially elevated Rust to Tier-1 status across engineering divisions, mandating its use for new low-level Windows systems and cloud hypervisors to eliminate memory safety vulnerabilities.",
    fullContent: [
      "In a landmark shift for systems engineering, Microsoft has officially designated the Rust programming language as a Tier-1 supported language across its Windows Core OS and Azure Cloud infrastructure teams. This places Rust on an equal operational footing with legacy C and C++ toolchains.",
      "According to Microsoft Security Response Center (MSRC) research, approximately 70% of all critical Common Vulnerabilities and Exposures (CVEs) patched by Microsoft over the past two decades stem from memory safety bugs — specifically heap-buffer overflows, use-after-free conditions, and null-pointer dereferences. Rust's strict compile-time borrow checker and ownership model mathematically prevent these classes of errors without requiring a garbage collector runtime.",
      "Mark Russinovich, Chief Technology Officer of Microsoft Azure, confirmed that critical kernel drivers, network packet parsing daemons, and hypervisor components are already being rewritten in Rust. The Windows OS build pipelines now natively integrate Cargo and rustc alongside MSVC, enabling engineers to ship hybrid C++/Rust binaries without performance regressions.",
      "For engineering students, this policy change signals the long-term phase-out of pure C/C++ in modern systems development. Tech giants including Google (Android kernel), Amazon (Firecracker microVM), Meta, and Apple are all actively deploying Rust, making memory safety literacy one of the most lucrative and future-proof skills for campus placements."
    ],
    keyPoints: [
      "Microsoft officially designates Rust as Tier-1 alongside C and C++.",
      "Over 70% of past critical Windows vulnerabilities were memory safety defects.",
      "Rust's compile-time borrow checker eliminates buffer overflows without GC overhead.",
      "Windows kernel drivers and Azure cloud hypervisors are actively migrating to Rust."
    ],
    studentTakeaway:
      "Amrita Sai Career Edge: Learning Rust alongside C++ will make your resume instantly stand out in Microsoft, Google, and Amazon campus hiring rounds. Add a project demonstrating Rust concurrency or a network proxy to your portfolio.",
    interviewQuestion: {
      question: "Why are tech giants like Microsoft and Google rewriting C/C++ components in Rust?",
      answer: "Rust guarantees memory safety at compile-time through ownership, borrowing, and lifetime rules without runtime garbage collection latency. This completely prevents 70%+ of historic security flaws like buffer overflows and use-after-free."
    },
    category: "software",
    source: "AIM Network",
    sourceBadgeText: "AIM",
    sourceBadgeBg: "bg-amber-500",
    sourceBadgeColor: "text-slate-950",
    url: "https://analyticsindiamag.com",
    publishedAt: "1d",
    readTime: "3 min read",
    tags: ["Rust", "Microsoft", "MemorySafety", "Systems", "Windows"],
    isHot: true,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80",
    author: "AIM Technical Desk",
    likesCount: 1420,
  },
  {
    id: "news-openai-codex",
    title: "OpenAI Unveils Next-Gen Codex & Frontier Autonomous Coding Agents",
    summary:
      "OpenAI has introduced advanced autonomous coding models capable of multi-file refactoring, resolving real-world GitHub issues, and executing automated test-driven development in isolated sandbox environments.",
    fullContent: [
      "OpenAI has unveiled its next-generation Codex foundation model and autonomous developer agent framework, marking a significant leap from simple single-line autocompletion to end-to-end software engineering assistance.",
      "Trained on millions of verified open-source repositories and test suites, the new agent architecture can clone entire repositories, inspect failing unit tests, hypothesize root causes, edit multiple interdependent files, and verify fixes in isolated Linux micro-containers before submitting pull requests.",
      "On industry-standard SWE-bench benchmarks evaluating full repository problem solving, the model achieved unprecedented pass rates, outperforming prior coding assistants in complex algorithmic debugging and framework migrations.",
      "Engineering leaders emphasize that rather than replacing software engineers, these tools are turning developers into system architects who design specifications, review automated code drafts, and verify security constraints."
    ],
    keyPoints: [
      "Models can now refactor across multiple files and self-correct via test execution.",
      "Integrated Linux sandbox allows models to run compilers and unit test suites.",
      "Shifts developer roles toward architectural design, specification writing, and code review.",
      "High demand for engineers who understand how to orchestrate AI agents with APIs."
    ],
    studentTakeaway:
      "Amrita Sai Placement Tip: Master prompt engineering, API orchestration, and system design. Knowing how to leverage AI tools to build scalable production full-stack apps faster is now a top recruiter requirement.",
    interviewQuestion: {
      question: "How do modern agentic coding models differ from traditional autocomplete LLMs?",
      answer: "Autocomplete models predict the next token based on current file context. Agentic models execute iterative loops: reading requirements, querying multiple files, formulating plans, modifying code, and running test suites to verify correctness."
    },
    category: "ai",
    source: "OpenAI Research",
    sourceBadgeText: "OAI",
    sourceBadgeBg: "bg-emerald-600",
    sourceBadgeColor: "text-white",
    url: "https://openai.com/blog",
    publishedAt: "2d",
    readTime: "4 min read",
    tags: ["OpenAI", "Codex", "GenAI", "CodingAgents", "FutureOfDev"],
    isHot: true,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
    author: "AI Research Team",
    likesCount: 2310,
  },
  {
    id: "news-ap-education-schedule",
    title: "AP Higher Education: Semester Exam Calendar & Technical Hackathons Announced",
    summary:
      "The State Department of Higher Education and universities have published the academic schedules, festival holidays, and statewide technical innovation hackathons for engineering students.",
    fullContent: [
      "The Andhra Pradesh State Council of Higher Education (APSCHE) and state technical universities have released the comprehensive academic calendar for the ongoing semester, detailing examination schedules, mid-term dates, and university holiday breaks.",
      "As part of the academic notification, the department also launched statewide innovation hackathons in collaboration with regional IT development boards, offering cash prizes and incubation support for top student software and hardware prototypes.",
      "College administrations across the state, including Amrita Sai Institute of Science & Technology, are aligning project submission deadlines and placement training bootcamps to ensure students are fully prepared ahead of peak recruitment season.",
      "Students are advised to balance semester coursework with hands-on coding practice on platforms like LeetCode and GitHub to maximize campus placement readiness."
    ],
    keyPoints: [
      "Official academic calendar, exam dates, and semester breaks announced.",
      "Statewide technical innovation hackathons offering cash prizes and incubation support.",
      "Engineering colleges aligning placement prep bootcamps with university timelines.",
      "Emphasis on practical project submissions and industry certifications."
    ],
    studentTakeaway:
      "Academic Advice: Check your semester timetable on the portal early. Utilize holiday periods to complete major project documentation, portfolio updates, and LeetCode DSA sprints.",
    interviewQuestion: {
      question: "How do you balance academic coursework with hands-on technical project development?",
      answer: "I allocate structured weekly time blocks: dedicated weekday hours for core university curriculum and weekend sprints for open-source contributions, hackathons, and deploying real full-stack web applications."
    },
    category: "placements",
    source: "Sakshi Education",
    sourceBadgeText: "SE",
    sourceBadgeBg: "bg-blue-600",
    sourceBadgeColor: "text-white",
    url: "https://www.sakshieducation.com",
    publishedAt: "2d",
    readTime: "3 min read",
    tags: ["AndhraPradesh", "HigherEducation", "SemesterExams", "Hackathons", "Campus"],
    isHot: false,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
    author: "Education Bureau",
    likesCount: 980,
  },
  {
    id: "news-deepseek-reasoning",
    title: "DeepSeek & Open-Source Reasoning Models Disrupt Global AI Engineering",
    summary:
      "Open-source reasoning models (R1 architecture) have matched proprietary frontier models in coding and mathematical benchmarks at a fraction of training compute, sparking widespread enterprise adoption.",
    fullContent: [
      "The global artificial intelligence landscape witnessed a seismic disruption with the release of open-source reasoning models employing the R1 architecture. By utilizing large-scale reinforcement learning (RL) without heavy reliance on human-labeled supervised fine-tuning, the models exhibited emergent chain-of-thought capabilities on complex coding and mathematical problems.",
      "Benchmark evaluations showed these open weights matching or exceeding leading closed-source frontier models in competitive programming challenges, theorem proving, and multi-step bug localization. Crucially, the training compute required was estimated at less than one-tenth of traditional frontier runs.",
      "Enterprises and developer teams around the world are rapidly downloading and running these models locally using high-throughput inference engines like vLLM, Ollama, and SGLang. This shifts competitive advantage away from pure proprietary API access toward customized local fine-tuning and retrieval-augmented generation (RAG).",
      "For computer science students, understanding chain-of-thought prompting, model distillation, and running open-source LLMs on edge hardware has become one of the hottest topics in technical interviews."
    ],
    keyPoints: [
      "Open-source reasoning models match proprietary systems in mathematical reasoning and coding.",
      "Trained using reinforcement learning with self-verification incentives.",
      "Massive cost reduction enables small startups and universities to host local models.",
      "Inference engines like vLLM and Ollama are seeing record developer adoption."
    ],
    studentTakeaway:
      "Interview Tip: Expect questions on chain-of-thought prompting, model quantization (4-bit/8-bit GGUF), and deploying local AI agents. Showcase an Ollama or vLLM project on your resume.",
    interviewQuestion: {
      question: "What is chain-of-thought reasoning in modern LLMs and how does it improve accuracy?",
      answer: "Chain-of-thought allows a model to generate intermediate reasoning tokens before arriving at a final answer. This breaks complex problems into manageable sequential deductions, significantly reducing hallucination in math and algorithmic tasks."
    },
    category: "ai",
    source: "MIT Tech Review & Hugging Face",
    sourceBadgeText: "MIT",
    sourceBadgeBg: "bg-purple-600",
    sourceBadgeColor: "text-white",
    url: "https://huggingface.co/blog",
    publishedAt: "Today",
    readTime: "3 min read",
    tags: ["ArtificialIntelligence", "DeepSeek", "LLMs", "OpenSource"],
    isHot: true,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80",
    author: "Dr. Elena Vance",
    likesCount: 3410,
  },
  {
    id: "news-india-semiconductor",
    title: "India Semiconductor Mission: New Chip Fabs in Dholera & Morigaon Begin Talent Hiring",
    summary:
      "Tata Electronics and PSMC have accelerated construction of India's first commercial semiconductor fabrication plants, creating over 20,000 engineering roles across VLSI, cleanroom automation, and embedded systems.",
    fullContent: [
      "The India Semiconductor Mission (ISM) reached a historic milestone as civil construction and cleanroom tooling at the Tata Electronics fabrication facility in Dholera, Gujarat, entered an advanced stage alongside the packaging plant in Morigaon, Assam.",
      "In partnership with Taiwan's Powerchip Semiconductor Manufacturing Corporation (PSMC), the Dholera fab will manufacture chips on 28nm, 40nm, and legacy nodes catering to automotive, power management, consumer electronics, and defense applications.",
      "Recruitment teams have initiated campus engagement programs and specialized lateral hiring to onboard over 20,000 engineers and technicians. Roles span RTL design, physical design, wafer inspection, EDA automation, and RF test engineering.",
      "State and central bodies are actively sponsoring university labs with licensed EDA software suites (Cadence, Synopsys, Mentor Graphics) to train student cohorts in modern VLSI design workflows."
    ],
    keyPoints: [
      "Tata Electronics and PSMC fab in Dholera enters cleanroom installation phase.",
      "20,000+ core engineering jobs being created across semiconductor hardware verticals.",
      "High demand for ECE, EEE, and Mechatronics students skilled in Verilog and RTL design.",
      "Government expanding university access to industry-standard EDA software tools."
    ],
    studentTakeaway:
      "ECE & EEE Career Tip: Core chip design is booming in India. Gain hands-on practice with Verilog/VHDL, FPGA synthesis, and static timing analysis (STA) to secure high-paying hardware roles.",
    interviewQuestion: {
      question: "What is the difference between front-end and back-end VLSI design?",
      answer: "Front-end VLSI focuses on architecture specification, RTL coding (Verilog/VHDL), and functional simulation. Back-end VLSI takes the synthesized gate netlist and handles floorplanning, placement, routing, and physical timing closure (DRC/LVS)."
    },
    category: "hardware",
    source: "Electronics Weekly",
    sourceBadgeText: "EW",
    sourceBadgeBg: "bg-amber-600",
    sourceBadgeColor: "text-white",
    url: "https://www.electronicsweekly.com",
    publishedAt: "Today",
    readTime: "4 min read",
    tags: ["VLSI", "Semiconductors", "ECE", "HardwareJobs", "MakeInIndia"],
    isHot: true,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
    author: "K. Ramanathan",
    likesCount: 1870,
  },
  {
    id: "news-placement-system-design",
    title: "Campus Hiring Shift: Product MNCs Prioritize System Design & Live Debugging Over LeetCode",
    summary:
      "Top tech recruiters report reducing reliance on rote LeetCode hard puzzle questions. Instead, technical interviews now focus on building scalable systems, debugging production code, and API design.",
    fullContent: [
      "A comprehensive survey conducted across leading tech recruiters and engineering managers revealed a major realignment in entry-level engineering evaluations. While basic data structures and algorithms remain a hygiene check, rote memorization of obscure competitive programming puzzles is being deemphasized.",
      "Recruiters note that candidates who memorized complex graph algorithms often struggled with basic real-world requirements such as writing clean modular code, handling race conditions, configuring database indices, or debugging an HTTP 500 error in a live service.",
      "In response, major product companies (including Amazon, Uber, Atlassian, and high-growth fintech unicorns) have shifted their interview format to include live pair-programming sessions, modular system design for freshers (e.g., designing a URL shortener or rate limiter), and practical concurrency scenarios.",
      "Hiring managers strongly recommend that students showcase end-to-end full-stack projects featuring authentication, caching (Redis), relational database migrations, and CI/CD automated test pipelines."
    ],
    keyPoints: [
      "Recruiters move away from memorized LeetCode Hard trick questions.",
      "Evaluation prioritizes clean code structure, error handling, and debugging ability.",
      "Freshers are increasingly asked basic Low-Level Design (LLD) and system trade-offs.",
      "Portfolio projects with real deployments and unit tests carry significant weight."
    ],
    studentTakeaway:
      "Amrita Sai Student Roadmap: Don't spend all your time grinding 800 DSA questions in isolation. Build and deploy two complete full-stack web or backend projects with Redis caching and Docker containers.",
    interviewQuestion: {
      question: "How would you handle high traffic spikes on a relational database?",
      answer: "Implement a caching layer using Redis/Memcached to serve frequent read queries, add database read replicas, optimize query indices, and utilize connection pooling and message queues (like Kafka or RabbitMQ) to buffer asynchronous write operations."
    },
    category: "placements",
    source: "HackerRank & Tech Benchmark",
    sourceBadgeText: "HR",
    sourceBadgeBg: "bg-emerald-700",
    sourceBadgeColor: "text-white",
    url: "https://www.hackerrank.com/research",
    publishedAt: "Yesterday",
    readTime: "5 min read",
    tags: ["Placements", "SystemDesign", "Interviews", "DSA", "Careers"],
    isHot: true,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
    author: "Campus Recruitment Desk",
    likesCount: 2890,
  },
  {
    id: "news-cyber-zero-day",
    title: "Critical OpenSSL & Linux Kernel Zero-Day Patched: Memory Safety Gains Global Mandate",
    summary:
      "US CISA and global cybersecurity authorities have urged organizations to migrate critical infrastructure to memory-safe languages following discoveries of buffer overflow vulnerabilities in legacy C network daemons.",
    fullContent: [
      "Cybersecurity defense teams globally responded to coordinated patches addressing high-severity buffer overflow vulnerabilities in widely deployed Linux kernel network subsystems and legacy cryptographic libraries.",
      "The vulnerabilities, which allowed unauthenticated remote code execution (RCE) via specially crafted network packets, once again highlighted the fundamental fragility of manual memory management in languages like C and C++.",
      "In an official advisory, the Cybersecurity and Infrastructure Security Agency (CISA) reiterated its urgent recommendation for software manufacturers and critical national infrastructure providers to publish memory-safe software roadmaps.",
      "As a result, specialized roles in memory forensics, kernel security, and automated fuzzing are experiencing rapid compensation growth, with security consultancies actively recruiting students possessing deep operating systems knowledge."
    ],
    keyPoints: [
      "Zero-day buffer overflow vulnerability discovered in legacy C networking stacks.",
      "Global cyber agencies mandate migration to memory-safe languages for critical systems.",
      "Spike in demand for ethical hackers, reverse engineers, and secure software architects.",
      "Knowledge of memory layout (stack, heap, registers) is essential for security roles."
    ],
    studentTakeaway:
      "Cyber Career Edge: Understanding memory layout (stack vs heap, buffer overflows, ASLR, and DEP) is critical for offensive and defensive cyber roles. Participate in CTF (Capture the Flag) competitions!",
    interviewQuestion: {
      question: "What is a buffer overflow vulnerability and how does it lead to arbitrary code execution?",
      answer: "A buffer overflow occurs when a program writes more data to a block of allocated memory than the buffer can hold. In C/C++, this can overwrite adjacent memory, including the function's return instruction pointer on the stack, allowing an attacker to divert execution to injected payload code."
    },
    category: "cyber",
    source: "The Hacker News",
    sourceBadgeText: "THN",
    sourceBadgeBg: "bg-red-600",
    sourceBadgeColor: "text-white",
    url: "https://thehackernews.com",
    publishedAt: "Yesterday",
    readTime: "4 min read",
    tags: ["CyberSecurity", "Linux", "ZeroDay", "CISA", "InfoSec"],
    isHot: false,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80",
    author: "Security Research Group",
    likesCount: 1640,
  },
  {
    id: "news-react19-nextjs",
    title: "React 19 & Next.js Server Actions Become the Standard for Production Web Apps",
    summary:
      "With React 19 stable release, Server Components, optimistic UI hooks, and automated asset preloading have redefined how modern web software is developed, eliminating boilerplate state managers.",
    fullContent: [
      "The official release of React 19 has transformed front-end architecture across modern technology companies. By introducing native Server Actions, async transitions, and declarative asset preloading, the framework eliminates hundreds of lines of legacy Redux and custom API fetching boilerplate.",
      "The new `useActionState` and `useOptimistic` hooks allow developers to build lightning-fast interactive interfaces where UI changes render instantaneously while network requests resolve gracefully in the background.",
      "Next.js App Router has further consolidated this pattern, allowing database queries to execute directly inside server components with zero client-side JavaScript bundle penalty, dramatically improving Core Web Vitals and SEO scores.",
      "For student web developers, modernizing portfolio projects to use Next.js, Server Components, and Tailwind CSS provides an immediate competitive advantage over outdated tutorials built on legacy patterns."
    ],
    keyPoints: [
      "React 19 simplifies async forms with native Server Actions and useActionState.",
      "Optimistic UI updates give applications instant desktop-grade responsiveness.",
      "Server Components keep heavy libraries on the server, speeding up mobile load times.",
      "Modern full-stack developers need deep comprehension of server-client boundaries."
    ],
    studentTakeaway:
      "Web Developer Tip: Upgrade your college projects to React 19 / Next.js with TypeScript. Employers instantly appreciate seeing modern hooks and clean server-client architectural separation.",
    interviewQuestion: {
      question: "What problem do React Server Components (RSC) solve compared to standard client components?",
      answer: "RSC execute exclusively on the server, allowing direct database access without exposing credentials or shipping bulky dependencies (like markdown parsers or date libraries) to the client, which shrinks bundle sizes and improves page load speed."
    },
    category: "software",
    source: "React Dev Team & Vercel",
    sourceBadgeText: "RCT",
    sourceBadgeBg: "bg-cyan-600",
    sourceBadgeColor: "text-white",
    url: "https://react.dev/blog",
    publishedAt: "3d",
    readTime: "3 min read",
    tags: ["React19", "Nextjs", "WebDev", "TypeScript", "Frontend"],
    isHot: false,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80",
    author: "Web Platform Team",
    likesCount: 2150,
  },
  {
    id: "news-cloud-kubernetes",
    title: "Kubernetes & Cloud-Native Foundation Announces Free Student Certifications",
    summary:
      "CNCF and Linux Foundation have launched dedicated student learning paths for Kubernetes, Docker, and Prometheus monitoring to bridge the global cloud engineer shortage.",
    fullContent: [
      "To address a critical shortage of cloud-native systems engineers, the Cloud Native Computing Foundation (CNCF) and The Linux Foundation unveiled an expanded university access initiative offering subsidized and free exam vouchers for foundational Kubernetes certifications.",
      "The program covers hands-on labs for Docker containerization, Kubernetes cluster orchestration, Helm packaging, and Prometheus metrics collection, preparing engineering undergraduates for production DevOps environments.",
      "Industry data indicates that over 84% of Fortune 500 companies run containerized workloads on Kubernetes across AWS EKS, Google GKE, and Microsoft AKS, making cloud-native tooling a standard prerequisite for backend roles.",
      "Students completing the course gain practical experience deploying microservices architectures, configuring horizontal pod autoscaling, and troubleshooting network ingress controllers."
    ],
    keyPoints: [
      "Free and subsidized cloud-native learning tracks launched for university students.",
      "Hands-on labs focus on Docker, Kubernetes pod management, and Prometheus monitoring.",
      "Over 84% of enterprise backends now rely on Kubernetes clusters.",
      "High placement conversion rate for freshers holding recognized cloud credentials."
    ],
    studentTakeaway:
      "DevOps Skill: Containerizing your college final year projects with Docker and writing a simple docker-compose file immediately demonstrates practical cloud literacy to recruiters.",
    interviewQuestion: {
      question: "What is the difference between a Docker container and a virtual machine (VM)?",
      answer: "A VM virtualizes the entire hardware stack including a complete guest OS kernel, which incurs heavy memory and startup overhead. A container virtualizes only the OS user space and shares the host OS kernel, making it extremely lightweight and fast to boot."
    },
    category: "cloud",
    source: "CNCF Foundation",
    sourceBadgeText: "K8S",
    sourceBadgeBg: "bg-blue-700",
    sourceBadgeColor: "text-white",
    url: "https://www.cncf.io",
    publishedAt: "3d",
    readTime: "3 min read",
    tags: ["DevOps", "Kubernetes", "Docker", "Cloud", "CNCF"],
    isHot: false,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80",
    author: "Cloud Native Desk",
    likesCount: 1530,
  },
  {
    id: "news-isro-hackathon",
    title: "ISRO Releases Satellite Data for Student Hackathons: AI for Space Imagery & GIS",
    summary:
      "The Indian Space Research Organisation has made high-resolution multispectral imagery from Chandrayaan and Cartosat public for university innovation challenges and environmental monitoring hackathons.",
    fullContent: [
      "In a major boost for academic research and student innovation, the Indian Space Research Organisation (ISRO) opened extensive multispectral Earth observation datasets from the Cartosat, Resourcesat, and Chandrayaan missions via the Bhuvan Geoportal.",
      "The initiative is accompanied by national-level hackathons challenging university teams to develop AI and computer vision models for automated urban flood mapping, agricultural yield prediction, forest fire detection, and lunar surface crater classification.",
      "Engineering teams participating in the challenge will receive mentorship from senior ISRO scientists and cloud computing credits to train convolutional neural networks and vision transformers on massive geospatial satellite tiles.",
      "Several student prototypes from previous editions have transitioned into funded deep-tech startups operating in precision agriculture and remote sensing analytics."
    ],
    keyPoints: [
      "High-resolution Cartosat and Chandrayaan satellite imagery open for student research.",
      "National hackathons focus on applying computer vision to real environmental challenges.",
      "Mentorship and compute credits provided by ISRO scientists.",
      "Exceptional project topic for college final-year engineering capstones."
    ],
    studentTakeaway:
      "Capstone Project Idea: Use OpenCV and PyTorch on ISRO Bhuvan satellite datasets to build an environmental hazard or flood detection model. It makes an outstanding resume headline project.",
    interviewQuestion: {
      question: "How do Convolutional Neural Networks (CNNs) process multi-spectral satellite imagery?",
      answer: "Standard images have 3 color channels (RGB), whereas multi-spectral satellite data contains additional bands (near-infrared, thermal). CNN 2D convolutional kernels are adapted to accept N input channels, extracting spectral and spatial feature maps simultaneously."
    },
    category: "ai",
    source: "ISRO Bhuvan Portal",
    sourceBadgeText: "ISRO",
    sourceBadgeBg: "bg-orange-600",
    sourceBadgeColor: "text-white",
    url: "https://bhuvan.nrsc.gov.in",
    publishedAt: "4d",
    readTime: "4 min read",
    tags: ["ISRO", "ComputerVision", "Satellite", "Hackathon", "DeepTech"],
    isHot: false,
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&auto=format&fit=crop&q=80",
    author: "Space Exploration Bureau",
    likesCount: 3100,
  },
];

// Local Storage for Bookmarks
const BOOKMARKS_KEY = "amrita_tech_news_bookmarks_v1";
const LIKES_KEY = "amrita_tech_news_likes_v1";

export const getBookmarkedNewsIds = (): string[] => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleBookmarkNews = (id: string): boolean => {
  try {
    const current = getBookmarkedNewsIds();
    let updated: string[];
    let isBookmarked: boolean;

    if (current.includes(id)) {
      updated = current.filter((item) => item !== id);
      isBookmarked = false;
    } else {
      updated = [id, ...current];
      isBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return isBookmarked;
  } catch {
    return false;
  }
};

export const getLikedNewsIds = (): string[] => {
  try {
    const data = localStorage.getItem(LIKES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleLikeNews = (id: string): boolean => {
  try {
    const current = getLikedNewsIds();
    let updated: string[];
    let isLiked: boolean;

    if (current.includes(id)) {
      updated = current.filter((item) => item !== id);
      isLiked = false;
    } else {
      updated = [id, ...current];
      isLiked = true;
    }

    localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    return isLiked;
  } catch {
    return false;
  }
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80",
  software: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80",
  cyber: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80",
  hardware: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
  cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80",
  placements: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
};

/**
 * Fetch live top technology stories from HackerNews API to supplement curated student awareness news
 */
export const fetchLiveHackerNews = async (): Promise<TechNewsItem[]> => {
  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json?limitToFirst=15&orderBy=%22$key%22"
    );
    if (!res.ok) return [];

    const storyIds: number[] = await res.json();
    const selectedIds = storyIds.slice(0, 6);

    const storyPromises = selectedIds.map(async (id) => {
      try {
        const itemRes = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        if (!itemRes.ok) return null;
        return await itemRes.json();
      } catch {
        return null;
      }
    });

    const stories = await Promise.all(storyPromises);

    const liveItems: TechNewsItem[] = stories
      .filter((s) => s && s.title && s.url)
      .map((s) => {
        const titleLower = s.title.toLowerCase();
        let cat: TechNewsItem["category"] = "software";
        let takeaway =
          "Trending in tech: Knowing real-world engineering architecture choices helps you speak with authority in technical rounds.";

        if (titleLower.includes("ai") || titleLower.includes("llm") || titleLower.includes("gpt") || titleLower.includes("model")) {
          cat = "ai";
          takeaway = "AI Evolution: Study how this tool or technique solves real compute or latency constraints in production.";
        } else if (titleLower.includes("security") || titleLower.includes("vulnerability") || titleLower.includes("hack") || titleLower.includes("cve")) {
          cat = "cyber";
          takeaway = "Cyber Insight: Research how this vulnerability occurs at the code level (memory, authentication, or protocol flaw).";
        } else if (titleLower.includes("chip") || titleLower.includes("gpu") || titleLower.includes("arm") || titleLower.includes("hardware")) {
          cat = "hardware";
          takeaway = "Hardware Impact: Keep track of semiconductor architecture shifts that drive next-gen edge computing.";
        } else if (titleLower.includes("cloud") || titleLower.includes("k8s") || titleLower.includes("docker") || titleLower.includes("database")) {
          cat = "cloud";
          takeaway = "DevOps Tip: Modern backend engineers are expected to know how data flows from cloud servers to client devices.";
        }

        const domain = new URL(s.url).hostname.replace(/^www\./, "");
        const fallbackImg = CATEGORY_IMAGE_MAP[cat] || CATEGORY_IMAGE_MAP.software;

        return {
          id: `hn-${s.id}`,
          title: s.title,
          summary: `Global developer community discussion (${s.score || 100}+ points on Hacker News). Trending story covering modern engineering practices and industry tooling.`,
          fullContent: [
            `This story is currently trending across the global software engineering and research community with over ${s.score || 100} upvotes and hundreds of active technical discussions on Hacker News.`,
            `The topic covers significant shifts in developer workflows, infrastructure reliability, or novel software libraries that are being evaluated by production engineering teams worldwide.`,
            `Students interested in modern system design are encouraged to read the original release notes, inspect source code repositories, and explore how these tools solve concurrency, latency, or developer productivity bottlenecks in high-scale environments.`
          ],
          keyPoints: [
            `Top trending engineering topic on Hacker News with ${s.score || 100}+ developer upvotes.`,
            `Direct relevance to production software stacks and architectural best practices.`,
            `Provides real-world case studies for technical interview discussions.`
          ],
          studentTakeaway: takeaway,
          category: cat,
          source: domain,
          sourceBadgeText: domain.slice(0, 3).toUpperCase(),
          sourceBadgeBg: "bg-slate-700",
          sourceBadgeColor: "text-white",
          url: s.url,
          publishedAt: "Live",
          readTime: "3 min read",
          tags: ["LiveFeed", "TechTrending", cat.toUpperCase()],
          isHot: (s.score || 0) > 150,
          imageUrl: fallbackImg,
          likesCount: s.score || 120,
        };
      });

    return liveItems;
  } catch (err) {
    console.warn("Could not fetch live tech feed, falling back to curated news:", err);
    return [];
  }
};
