import { DEPARTMENTS } from "./mockData";

export interface YearlyMilestone {
  year: number;
  title: string;
  focusArea: string;
  academicGoals: string[];
  technicalSkills: string[];
  certifications: string[];
  projectsAndActivities: string[];
  placementPrep: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  department: typeof DEPARTMENTS[number] | "All Departments";
  category: "Software & IT" | "AI & Data" | "Hardware & Core" | "Cyber & Cloud" | "Civil & Structural" | "Government & Higher Studies";
  summary: string;
  demandLevel: "Very High" | "High" | "Growing";
  avgSalary: string; // e.g. "₹6 - ₹18 LPA"
  topRecruiters: string[];
  primarySkills: string[];
  secondarySkills: string[];
  toolsAndFrameworks: string[];
  keyCertifications: { name: string; issuer: string; isFree?: boolean }[];
  projectIdeas: { title: string; difficulty: "Beginner" | "Intermediate" | "Advanced"; description: string }[];
  roadmap: {
    year1: string[];
    year2: string[];
    year3: string[];
    year4: string[];
  };
  recommendedCoursesInCollege: string[];
  freeResources: { title: string; url: string; platform: string }[];
}

export interface CareerQuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    description: string;
    suggestedCategory: CareerPath["category"];
    suggestedDepartments: string[];
  }[];
}

export const CAREER_CATEGORIES = [
  "All Categories",
  "Software & IT",
  "AI & Data",
  "Cyber & Cloud",
  "Hardware & Core",
  "Civil & Structural",
  "Government & Higher Studies",
] as const;

export const YEARLY_ROADMAPS_BY_STREAM: Record<string, YearlyMilestone[]> = {
  "Computer Science & IT Streams": [
    {
      year: 1,
      title: "Year 1: Foundation & Algorithmic Thinking",
      focusArea: "Mastering C / Python, Basic Math, Git & Problem Solving",
      academicGoals: [
        "Maintain CGPA > 8.0 in Mathematics & Basic Programming",
        "Understand computer organization & logic fundamentals",
      ],
      technicalSkills: ["C Programming", "Python basics", "Linux Command Line", "Git & GitHub"],
      certifications: ["CS50 by Harvard (Free)", "Python for Everybody (Coursera / YouTube)"],
      projectsAndActivities: [
        "CLI-based calculator or student record system",
        "Solve 50+ basic problems on LeetCode / HackerRank",
      ],
      placementPrep: [
        "Build a clean LinkedIn profile",
        "Start practicing mental math and basic aptitude",
      ],
    },
    {
      year: 2,
      title: "Year 2: Core Computer Science & Specialization",
      focusArea: "Data Structures & Algorithms, OOPs, Web Development / Core Branch Foundations",
      academicGoals: [
        "Deep dive into Data Structures, DBMS, and OS",
        "Score high in Design & Analysis of Algorithms",
      ],
      technicalSkills: ["Data Structures in C++/Java", "SQL & Database Design", "HTML/CSS/JavaScript or TypeScript", "Object Oriented Design"],
      certifications: ["Oracle Certified Associate Java", "Meta Front-End / Back-End Certificate"],
      projectsAndActivities: [
        "Full-stack Web application (CRUD with Auth & Database)",
        "Participate in College Hackathons & CodeChef contests",
      ],
      placementPrep: [
        "Target 150+ LeetCode problems (Arrays, Strings, Trees, DP)",
        "Prepare clean GitHub repositories with live demo links",
      ],
    },
    {
      year: 3,
      title: "Year 3: Advanced Projects & Internship Drive",
      focusArea: "System Design, Cloud Basics, Competitive Coding & Summer Internships",
      academicGoals: [
        "Computer Networks, Software Engineering, and Electives",
        "Pre-final year Mini Project completion",
      ],
      technicalSkills: ["System Design Fundamentals", "React / Next.js / Spring Boot", "Docker & AWS Basics", "RESTful & GraphQL APIs"],
      certifications: ["AWS Certified Cloud Practitioner", "Google Cloud Associate"],
      projectsAndActivities: [
        "Industry-grade SaaS project or Open Source contribution",
        "Apply for Summer Internships via Internshala, LinkedIn, and Campus Drives",
      ],
      placementPrep: [
        "Resume building (ATS-friendly format)",
        "Mock technical & HR interviews, group discussions",
        "Master quantitative aptitude and verbal reasoning",
      ],
    },
    {
      year: 4,
      title: "Year 4: Campus Placements & Industry Transition",
      focusArea: "Campus Placement Drives, Final Year Capstone Project & Transition to Full-Time",
      academicGoals: [
        "Publish or complete high-quality Major Capstone Project",
        "Clear all backlogs and maintain strong graduation CGPA",
      ],
      technicalSkills: ["Advanced System Design", "Microservices", "DevOps CI/CD pipelines"],
      certifications: ["Kubernetes (CKA) or Specialist AWS/Azure Certification"],
      projectsAndActivities: [
        "Production-ready Capstone Project with automated deployment",
        "Research paper publication in IEEE / UGC-CARE journal (if aspiring higher studies)",
      ],
      placementPrep: [
        "Company-specific coding rounds (TCS, Infosys, Wipro, Cognizant, Product Companies)",
        "Core subject revision (OS, DBMS, CN, OOPS, System Design)",
        "Negotiate and evaluate job offers",
      ],
    },
  ],
  "Electronics & Electrical Streams": [
    {
      year: 1,
      title: "Year 1: Circuit Foundations & C Programming",
      focusArea: "Basic Electrical, Engineering Physics, Mathematics & C/Embedded C",
      academicGoals: ["Master Network Analysis & Semiconductor Physics", "Maintain CGPA > 8.0"],
      technicalSkills: ["C Programming", "Circuit Simulation (Multisim/Proteus)", "MATLAB basics"],
      certifications: ["Introduction to Electronics (Coursera)", "MATLAB Onramp (MathWorks - Free)"],
      projectsAndActivities: ["Breadboard LED chaser and basic operational amplifier circuits", "Microcontroller introduction with Arduino"],
      placementPrep: ["Explore core vs IT career preferences", "Join IEEE or college robotics club"],
    },
    {
      year: 2,
      title: "Year 2: Digital Electronics, Microcontrollers & HDL",
      focusArea: "Analog & Digital ICs, Verilog/VHDL, Microprocessors (8051/ARM)",
      academicGoals: ["Score high in Digital Logic Design, Signals & Systems, Control Systems"],
      technicalSkills: ["Verilog HDL", "Xilinx Vivado / ModelSim", "Embedded C & Arduino/STM32", "Python for Data Analysis"],
      certifications: ["VLSI Design Fundamentals (NPTEL)", "ARM Cortex-M Programming"],
      projectsAndActivities: ["Digital Clock or ALU in Verilog FPGA", "IoT Smart Home Sensor using ESP32 & MQTT"],
      placementPrep: ["Practice digital electronics aptitude & basic C puzzles", "Build portfolio of hardware and simulation projects"],
    },
    {
      year: 3,
      title: "Year 3: VLSI / Embedded Systems & Core Internships",
      focusArea: "CMOS Design, Embedded RTOS, PCB Design & Core Industry Internships",
      academicGoals: ["Master Microcontrollers & Interfacing, Microwave & Antenna / Power Electronics"],
      technicalSkills: ["PCB Design (KiCAD / Altium)", "FreeRTOS", "ASIC Design Flow & Synthesis", "C++ for Embedded Systems"],
      certifications: ["Cadence / Synopsys tools workshop", "Certified Embedded Systems Engineer"],
      projectsAndActivities: ["Custom 2-layer PCB IoT tracker", "FPGA implementation of a cryptographic accelerator or RISC-V core"],
      placementPrep: ["Core company interview prep (Qualcomm, Texas Instruments, Intel, Bosch, L&T)", "GATE preparation if targeting PSU/M.Tech"],
    },
    {
      year: 4,
      title: "Year 4: Core Placement, GATE & Capstone Hardware",
      focusArea: "Campus Placement, GATE Exam, Capstone Project & Core Engineering Careers",
      academicGoals: ["Capstone hardware/firmware design and testing", "Graduation with top honors"],
      technicalSkills: ["High-speed PCB routing", "SoC Design", "Industrial Automation & PLC/SCADA (EEE)"],
      certifications: ["IPC PCB Standards Certification or Certified Automation Professional"],
      projectsAndActivities: ["Industrial IoT / Smart Grid / EV Battery Management System Capstone"],
      placementPrep: ["Attend campus interviews for Core & IT roles", "GATE exam revision and PSU applications"],
    },
  ],
  "Mechanical & Civil Engineering Streams": [
    {
      year: 1,
      title: "Year 1: Engineering Mechanics & 2D Drafting",
      focusArea: "Engineering Mechanics, Engineering Graphics, Material Science & Python/C",
      academicGoals: ["Strong foundation in Statics, Dynamics & Calculus", "Maintain CGPA > 8.0"],
      technicalSkills: ["AutoCAD (2D Drafting)", "Basic Python for numerical calculations", "Engineering Drawing standards"],
      certifications: ["Autodesk Certified User (AutoCAD)", "Engineering Mechanics on Coursera/NPTEL"],
      projectsAndActivities: ["Drafting building blueprints or standard machine elements in AutoCAD", "Hands-on workshop tooling & fabrication"],
      placementPrep: ["Explore GATE / PSU / Core private sectors and software hybrid roles"],
    },
    {
      year: 2,
      title: "Year 2: 3D Modeling & Solid Mechanics / Structural Analysis",
      focusArea: "SolidWorks / CATIA (Mech) or Revit / STAAD.Pro (Civil), Strength of Materials",
      academicGoals: ["Thermodynamics & Fluid Mechanics (Mech) or Surveying & Fluid Mechanics (Civil)"],
      technicalSkills: ["SolidWorks / Creo / Fusion 360", "STAAD.Pro / ETABS (Civil)", "Ansys FEA basics", "Excel VBA / Python"],
      certifications: ["CSWA (Certified SolidWorks Associate)", "Bentley STAAD.Pro Specialist"],
      projectsAndActivities: ["3D assembly of an internal combustion engine or drone chassis", "Structural analysis of a multi-storey RC frame building"],
      placementPrep: ["Prepare for Core companies (L&T, Tata Projects, Mahindra, Hyundai, Afcons)", "Start GATE syllabus self-study"],
    },
    {
      year: 3,
      title: "Year 3: Simulation, BIM & Site/Industrial Internships",
      focusArea: "Finite Element Analysis (FEA), CFD, BIM, Site/Plant Internships",
      academicGoals: ["Design of Machine Elements (Mech) or Design of Steel & RC Structures (Civil)"],
      technicalSkills: ["ANSYS Mechanical / Fluent", "Revit Architecture & BIM 360", "Primavera P6 / MS Project", "Robotics basics"],
      certifications: ["Autodesk Certified Professional: Revit / Inventor", "Certified Project Management Associate"],
      projectsAndActivities: ["Aerodynamic analysis of airfoil / drone blade", "BIM 3D modeling and cost estimation for sustainable green building"],
      placementPrep: ["Summer Industrial Internship at construction sites, manufacturing plants or design firms", "Aptitude, GD, and Technical test prep"],
    },
    {
      year: 4,
      title: "Year 4: Core & Tech Placements, GATE / PSU & Capstone",
      focusArea: "Core & Tech Placements, GATE Examination, Capstone Project & Higher Studies",
      academicGoals: ["Complete Comprehensive Capstone Engineering Project", "Clear GATE with top percentile"],
      technicalSkills: ["Advanced CAE & Multiphysics", "Structural Health Monitoring / EV Powertrain Design"],
      certifications: ["Six Sigma Green Belt", "PMP Foundation / LEED Green Associate"],
      projectsAndActivities: ["Solar-powered EV buggy prototype or Earthquake-resistant modular structure model"],
      placementPrep: ["Attend campus interviews for L&T, Tata Motors, JSW, Tech Mahindra, Capgemini", "Apply for PSU jobs (IOCL, ONGC, NTPC, BHEL)"],
    },
  ],
};

export const CAREER_PATHS: CareerPath[] = [
  // 1. Computer Science & Engineering (Core)
  {
    id: "cse-fullstack-dev",
    title: "Full-Stack Software Engineer",
    department: "Computer Science & Engineering",
    category: "Software & IT",
    summary: "Architect and build end-to-end web and cloud applications powering modern digital companies, from interactive frontends to scalable microservice backends.",
    demandLevel: "Very High",
    avgSalary: "₹6 - ₹20 LPA",
    topRecruiters: ["Google", "Microsoft", "Amazon", "Infosys", "TCS", "Cognizant", "Zoho", "Accenture", "Startups"],
    primarySkills: ["Data Structures & Algorithms", "JavaScript / TypeScript", "React / Next.js", "Node.js / Express or Java Spring Boot", "SQL & NoSQL Databases"],
    secondarySkills: ["Docker & CI/CD", "RESTful APIs & GraphQL", "System Design", "Unit Testing (Jest/Vitest)"],
    toolsAndFrameworks: ["VS Code", "Git/GitHub", "Postman", "PostgreSQL", "MongoDB", "Redis", "AWS / Vercel"],
    keyCertifications: [
      { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services" },
      { name: "Meta Front-End & Back-End Professional Certificate", issuer: "Meta (Coursera)" },
      { name: "PostgreSQL Database Administrator", issuer: "PostgreSQL Guild", isFree: true },
    ],
    projectIdeas: [
      {
        title: "Campus Study Notes & Resource Exchange Platform",
        difficulty: "Intermediate",
        description: "Full-stack web application with role-based access, document upload/viewing, ratings, search indexing, and real-time notifications.",
      },
      {
        title: "Real-time Collaborative Code & Whiteboard Editor",
        difficulty: "Advanced",
        description: "WebSocket-powered collaborative workspace with live code execution, syntax highlighting, and audio/video WebRTC integration.",
      },
      {
        title: "E-Commerce Microservices Engine with Payment Gateway",
        difficulty: "Advanced",
        description: "Decoupled services for inventory, orders, payments (Stripe/Razorpay), and email notifications using message queues like Kafka/RabbitMQ.",
      },
    ],
    roadmap: {
      year1: ["Master C / Python basics", "Learn HTML5, CSS3, and modern JavaScript (ES6+)", "Solve 75+ beginner problems on LeetCode/HackerRank", "Use Git & GitHub for every project"],
      year2: ["Deep dive into Data Structures & Algorithms in Java/C++", "Master React, TypeScript, and TailwindCSS", "Learn Node.js, Express, and PostgreSQL", "Build 2 full-stack CRUD applications with authentication"],
      year3: ["Study System Design (caching, indexing, load balancing)", "Learn Docker, Redis, and basic AWS (S3, EC2)", "Complete a 3-month Summer Internship", "Solve 200+ LeetCode Medium problems"],
      year4: ["Build Capstone production SaaS application", "Revise core OS, DBMS, Computer Networks, and System Design", "Participate in campus placement drives and mock interviews"],
    },
    recommendedCoursesInCollege: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Web Technologies",
      "Object Oriented Software Engineering",
      "Computer Networks",
    ],
    freeResources: [
      { title: "The Odin Project (Full Stack Curriculum)", url: "https://www.theodinproject.com", platform: "Open Source" },
      { title: "Full Stack Open (University of Helsinki)", url: "https://fullstackopen.com/en/", platform: "Helsinki Uni" },
      { title: "NeetCode DSA Roadmap", url: "https://neetcode.io", platform: "Interactive DSA" },
    ],
  },
  {
    id: "cse-cloud-devops",
    title: "Cloud & DevOps Engineer",
    department: "Computer Science & Engineering",
    category: "Cyber & Cloud",
    summary: "Automate build, deployment, and infrastructure scaling across public clouds like AWS, Azure, and GCP using modern DevOps & Kubernetes tools.",
    demandLevel: "Very High",
    avgSalary: "₹7 - ₹22 LPA",
    topRecruiters: ["Amazon Web Services", "Microsoft", "Oracle", "Red Hat", "TCS", "Wipro", "HCL", "FinTech Companies"],
    primarySkills: ["Linux Administration", "Docker & Containerization", "Kubernetes", "CI/CD Pipelines (GitHub Actions/Jenkins)", "Infrastructure as Code (Terraform)"],
    secondarySkills: ["Python / Bash Scripting", "Cloud Architecture (AWS/Azure)", "Prometheus & Grafana Monitoring", "Security & Networking"],
    toolsAndFrameworks: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Ansible", "AWS EC2/S3/EKS", "Grafana"],
    keyCertifications: [
      { name: "AWS Certified Solutions Architect – Associate", issuer: "AWS" },
      { name: "Certified Kubernetes Administrator (CKA)", issuer: "Linux Foundation" },
      { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp" },
    ],
    projectIdeas: [
      {
        title: "Automated Multi-Stage CI/CD Deployment with GitHub Actions",
        difficulty: "Intermediate",
        description: "Pipeline that runs automated tests, builds Docker containers, performs vulnerability scanning, and deploys to a Kubernetes cluster.",
      },
      {
        title: "Infrastructure as Code (IaC) AWS Multi-Tier Setup",
        difficulty: "Intermediate",
        description: "Provision a VPC, public/private subnets, RDS database, and auto-scaling EC2 web cluster completely using Terraform scripts.",
      },
    ],
    roadmap: {
      year1: ["Master Linux terminal, bash scripting, and basic networking (IPs, DNS, ports)", "Learn Python for scripting"],
      year2: ["Learn Git version control deeply", "Master Docker containerization for web and database apps", "Understand AWS core services (EC2, S3, IAM)"],
      year3: ["Learn Kubernetes (Pods, Services, Ingress, Deployments)", "Write CI/CD pipelines with GitHub Actions", "Learn Terraform for Infrastructure as Code"],
      year4: ["Build monitoring dashboard with Prometheus & Grafana", "Clear AWS Solutions Architect / CKA exam", "Apply for DevOps / SRE campus and off-campus roles"],
    },
    recommendedCoursesInCollege: ["Operating Systems", "Computer Networks", "Cloud Computing", "Information Security"],
    freeResources: [
      { title: "DevOps Roadmap", url: "https://roadmap.sh/devops", platform: "Roadmap.sh" },
      { title: "KodeKloud Free DevOps Courses", url: "https://kodekloud.com", platform: "KodeKloud" },
    ],
  },

  // 2. CSE (AI & ML)
  {
    id: "aiml-ml-engineer",
    title: "Machine Learning & AI Engineer",
    department: "Computer Science & Engineering (AI & ML)",
    category: "AI & Data",
    summary: "Design, train, and deploy predictive machine learning models, deep learning neural networks, and generative AI agents that power autonomous systems.",
    demandLevel: "Very High",
    avgSalary: "₹8 - ₹24 LPA",
    topRecruiters: ["Google DeepMind", "Microsoft", "NVIDIA", "Amazon", "IBM", "TCS AI Labs", "Infosys", "Analytics Vidhya"],
    primarySkills: ["Python", "Linear Algebra & Probability", "Machine Learning (Scikit-Learn)", "Deep Learning (PyTorch / TensorFlow)", "MLOps & Model Deployment"],
    secondarySkills: ["NLP & Large Language Models (LangChain, HuggingFace)", "Computer Vision (OpenCV)", "FastAPI / Docker for ML", "Data Preprocessing & Pandas"],
    toolsAndFrameworks: ["PyTorch", "TensorFlow", "Scikit-Learn", "Hugging Face", "LangChain", "FastAPI", "Weights & Biases", "JupyterLab"],
    keyCertifications: [
      { name: "Deep Learning Specialization (Andrew Ng)", issuer: "DeepLearning.AI / Coursera" },
      { name: "TensorFlow Developer Certificate", issuer: "Google" },
      { name: "AWS Certified Machine Learning – Specialty", issuer: "AWS" },
    ],
    projectIdeas: [
      {
        title: "Intelligent Document Q&A Assistant using RAG & LLMs",
        difficulty: "Intermediate",
        description: "Build a Retrieval-Augmented Generation system using LangChain, ChromaDB vector store, and open-source Llama-3 to answer questions from lecture PDFs.",
      },
      {
        title: "Real-Time Campus Surveillance & Attendance using Face Recognition",
        difficulty: "Advanced",
        description: "Deep learning computer vision pipeline with YOLOv8 & OpenCV running real-time face detection, anti-spoofing, and automatic attendance logging.",
      },
      {
        title: "Medical Imaging Disease Classification with PyTorch",
        difficulty: "Advanced",
        description: "Convolutional Neural Network (ResNet/Vision Transformer) trained on chest X-ray datasets with Grad-CAM explainability heatmaps.",
      },
    ],
    roadmap: {
      year1: ["Master Python programming, NumPy, Pandas, and Matplotlib", "Strengthen Linear Algebra, Multivariable Calculus, and Probability"],
      year2: ["Study classical Machine Learning algorithms (Linear/Logistic Regression, Random Forests, SVM, PCA)", "Learn Scikit-Learn and complete 5 Kaggle competitions"],
      year3: ["Master Deep Learning & PyTorch (CNNs, RNNs, Transformers)", "Explore Generative AI, LangChain, Vector Databases, and HuggingFace", "Deploy models with FastAPI and Docker"],
      year4: ["Publish ML research paper or build advanced Capstone AI project", "Master MLOps (MLflow, DVC, model serving)", "Apply for AI/ML Specialist roles"],
    },
    recommendedCoursesInCollege: [
      "Artificial Intelligence",
      "Machine Learning Techniques",
      "Deep Learning & Neural Networks",
      "Natural Language Processing",
      "Probability & Statistics",
    ],
    freeResources: [
      { title: "Deep Learning Specialization (Coursera / YouTube notes)", url: "https://www.deeplearning.ai", platform: "DeepLearning.AI" },
      { title: "Fast.ai Practical Deep Learning for Coders", url: "https://course.fast.ai", platform: "Fast.ai" },
      { title: "Hugging Face NLP & Diffusion Course", url: "https://huggingface.co/learn", platform: "Hugging Face" },
    ],
  },

  // 3. CSE (Data Science)
  {
    id: "ds-data-scientist",
    title: "Data Scientist & Analytics Architect",
    department: "Computer Science & Engineering (Data Science)",
    category: "AI & Data",
    summary: "Transform raw structured and unstructured enterprise data into predictive insights, statistical models, interactive executive dashboards, and business value.",
    demandLevel: "Very High",
    avgSalary: "₹7 - ₹20 LPA",
    topRecruiters: ["Mu Sigma", "Fractal Analytics", "Tiger Analytics", "Deloitte", "EY", "Amazon", "Flipkart", "Accenture"],
    primarySkills: ["Python / R", "Advanced SQL & Data Warehousing", "Exploratory Data Analysis (EDA)", "Statistical Modeling & Hypothesis Testing", "Tableau / Power BI"],
    secondarySkills: ["Machine Learning & Feature Engineering", "BigQuery / Snowflake", "Time Series Forecasting", "A/B Testing"],
    toolsAndFrameworks: ["Python", "Pandas", "SQL", "Tableau", "Power BI", "Snowflake", "dbt", "Seaborn"],
    keyCertifications: [
      { name: "Google Data Analytics Professional Certificate", issuer: "Google (Coursera)" },
      { name: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", issuer: "Microsoft" },
      { name: "IBM Data Science Professional Certificate", issuer: "IBM" },
    ],
    projectIdeas: [
      {
        title: "Customer Churn Prediction & Retention Dashboard",
        difficulty: "Intermediate",
        description: "Analyze telecom/e-commerce customer behavior, build an XGBoost predictive model, and create an interactive Power BI dashboard with actionable recommendations.",
      },
      {
        title: "Stock Market Sentiment & Algorithmic Trend Analysis",
        difficulty: "Advanced",
        description: "Scrape financial news and Twitter feeds, perform NLP sentiment analysis, and train LSTM models for price volatility forecasting.",
      },
    ],
    roadmap: {
      year1: ["Master Python and SQL querying", "Learn statistics, probability distributions, hypothesis testing", "Visualize data with Matplotlib and Seaborn"],
      year2: ["Advanced SQL (Window functions, CTEs, indexing)", "Learn Power BI and Tableau for dashboarding", "Master machine learning pipelines with Scikit-Learn"],
      year3: ["Learn Cloud Data Warehousing (Snowflake / BigQuery)", "Study Time Series Analysis (ARIMA, Prophet) and A/B Testing", "Complete a corporate Data Analytics internship"],
      year4: ["Build an end-to-end Data Science portfolio on GitHub and Medium", "Practice case studies and SQL interview tests", "Participate in data science placement drives"],
    },
    recommendedCoursesInCollege: [
      "Data Mining & Data Warehousing",
      "Applied Statistics & Probability",
      "Big Data Analytics",
      "Business Intelligence",
    ],
    freeResources: [
      { title: "Alex The Analyst Data Bootcamp", url: "https://www.youtube.com/@AlexTheAnalyst", platform: "YouTube" },
      { title: "Kaggle Learn Micro-Courses", url: "https://www.kaggle.com/learn", platform: "Kaggle" },
    ],
  },

  // 4. CSE (Cyber Security)
  {
    id: "cyber-security-analyst",
    title: "Cyber Security Analyst & Penetration Tester",
    department: "Computer Science & Engineering (Cyber Security)",
    category: "Cyber & Cloud",
    summary: "Protect networks, systems, and digital assets from unauthorized access, cyber threats, vulnerabilities, and ransomware attacks through ethical hacking and security operations.",
    demandLevel: "Very High",
    avgSalary: "₹6 - ₹20 LPA",
    topRecruiters: ["Palo Alto Networks", "CrowdStrike", "Cisco", "Deloitte", "PwC", "KPMG", "Wipro CyberSOC", "Quick Heal", "Govt Defense Agencies"],
    primarySkills: ["Network Security & Protocols (TCP/IP, Wireshark)", "Linux Administration", "Ethical Hacking & Penetration Testing", "Vulnerability Assessment (Nessus/Burp Suite)", "SOC Operations & SIEM (Splunk/Wazuh)"],
    secondarySkills: ["Cryptography & PKI", "Web Application Security (OWASP Top 10)", "Python for Security Automation", "Incident Response & Forensics"],
    toolsAndFrameworks: ["Kali Linux", "Burp Suite", "Wireshark", "Metasploit", "Splunk", "Nmap", "Ghidra", "Wazuh"],
    keyCertifications: [
      { name: "CompTIA Security+", issuer: "CompTIA" },
      { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council" },
      { name: "Certified SOC Analyst (CSA) / eJPT", issuer: "eLearnSecurity" },
    ],
    projectIdeas: [
      {
        title: "Automated Web Vulnerability Scanner for OWASP Top 10",
        difficulty: "Intermediate",
        description: "Python-based tool that scans target URLs for SQL injections, XSS, insecure headers, and generates remediation reports.",
      },
      {
        title: "Home/Campus Network Intrusion Detection System (NIDS)",
        difficulty: "Advanced",
        description: "Deploy Snort / Suricata alongside ELK stack or Splunk to detect port scans, DDoS attempts, and malware beacons in real time.",
      },
    ],
    roadmap: {
      year1: ["Master Computer Networking (OSI model, subnetting, TCP/IP, DNS)", "Become fluent in Linux command line and Bash scripting", "Understand cryptography fundamentals"],
      year2: ["Learn Python for penetration testing & automation", "Practice CTFs on TryHackMe and HackTheBox", "Master OWASP Top 10 web vulnerabilities and Burp Suite"],
      year3: ["Setup a virtual SOC lab with Splunk or Wazuh", "Learn Incident Response and Digital Forensics", "Prepare for CompTIA Security+ or eJPT certification"],
      year4: ["Participate in Bug Bounty programs (HackerOne/Bugcrowd)", "Complete Security Capstone project", "Apply for SOC Analyst & Security Consultant campus roles"],
    },
    recommendedCoursesInCollege: [
      "Cryptography & Network Security",
      "Ethical Hacking",
      "Cyber Forensics & Incident Handling",
      "Cloud Security",
      "Operating System Security",
    ],
    freeResources: [
      { title: "TryHackMe Cyber Security Training", url: "https://tryhackme.com", platform: "Interactive Labs" },
      { title: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", platform: "Free Web Security" },
      { title: "Professor Messer Security+ Training", url: "https://www.professormesser.com", platform: "Free Video Course" },
    ],
  },

  // 5. CSE (Big Data Analytics)
  {
    id: "big-data-engineer",
    title: "Big Data & Distributed Systems Engineer",
    department: "Computer Science & Engineering (Big Data Analytics)",
    category: "AI & Data",
    summary: "Architect high-throughput streaming and batch data processing pipelines handling petabytes of data using Hadoop, Apache Spark, Kafka, and cloud data platforms.",
    demandLevel: "High",
    avgSalary: "₹7 - ₹22 LPA",
    topRecruiters: ["Amazon", "Uber", "Walmart Labs", "Capgemini", "Cognizant", "Tata Consultancy Services", "Oracle", "Goldman Sachs"],
    primarySkills: ["Java / Scala / Python", "Apache Spark (PySpark)", "Apache Kafka & Streaming", "SQL & Data Modeling", "Hadoop Ecosystem (HDFS, Hive)"],
    secondarySkills: ["Data Lakehouse (Databricks / Delta Lake)", "Airflow Workflow Orchestration", "Docker & Cloud Data Engineering", "NoSQL (Cassandra / HBase)"],
    toolsAndFrameworks: ["Apache Spark", "Apache Kafka", "Apache Airflow", "Hadoop", "PostgreSQL", "Snowflake", "Databricks", "Docker"],
    keyCertifications: [
      { name: "Databricks Certified Data Engineer Associate", issuer: "Databricks" },
      { name: "Cloudera Certified Data Engineer", issuer: "Cloudera" },
      { name: "AWS Certified Data Engineer – Associate", issuer: "AWS" },
    ],
    projectIdeas: [
      {
        title: "Real-time Financial Fraud Detection Streaming Pipeline",
        difficulty: "Advanced",
        description: "Process simulated credit card transactions with Kafka, perform anomaly detection with Spark Streaming, and push alerts to an interactive dashboard.",
      },
      {
        title: "Automated Data Lake ETL Pipeline with Apache Airflow & PySpark",
        difficulty: "Intermediate",
        description: "Extract large datasets from multiple APIs, transform data with PySpark, and load into a partitioned Parquet data lake with automated scheduling.",
      },
    ],
    roadmap: {
      year1: ["Master Java and Python programming with object-oriented principles", "Learn basic Data Structures and SQL"],
      year2: ["Master relational databases and advanced SQL", "Learn Linux and distributed systems theory", "Study Hadoop, MapReduce, and HDFS"],
      year3: ["Learn Apache Spark (PySpark/Scala) and Apache Kafka", "Build batch and real-time streaming pipelines", "Orchestrate workflows with Apache Airflow"],
      year4: ["Work with Cloud Big Data tools (AWS EMR / Databricks / Snowflake)", "Build Big Data Capstone project", "Interview for Data Engineer and Big Data Analyst roles"],
    },
    recommendedCoursesInCollege: [
      "Big Data Analytics & Technologies",
      "Distributed Systems",
      "Data Mining & Warehousing",
      "Cloud Computing",
    ],
    freeResources: [
      { title: "Data Engineering Zoomcamp (Free)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", platform: "Open Source" },
      { title: "Apache Spark Official Tutorials", url: "https://spark.apache.org/docs/latest/", platform: "Apache Org" },
    ],
  },

  // 6. Electronics & Communication Engineering (ECE)
  {
    id: "ece-vlsi-engineer",
    title: "VLSI Design & Verification Engineer",
    department: "Electronics & Communication",
    category: "Hardware & Core",
    summary: "Design, simulate, and verify next-generation microchips, System-on-Chips (SoCs), and semiconductor processors using Verilog, SystemVerilog, and modern EDA tools.",
    demandLevel: "Very High",
    avgSalary: "₹7 - ₹24 LPA",
    topRecruiters: ["Qualcomm", "Texas Instruments", "Intel", "NVIDIA", "AMD", "MediaTek", "Cadence", "Synopsys", "L&T Semiconductor"],
    primarySkills: ["Digital Design Fundamentals", "Verilog HDL & SystemVerilog", "Universal Verification Methodology (UVM)", "FPGA Prototyping (Xilinx/Altera)", "Static Timing Analysis (STA)"],
    secondarySkills: ["CMOS Analog Design", "Python/Perl/Tcl Scripting for EDA", "Computer Architecture (RISC-V/ARM)", "Linux Environment"],
    toolsAndFrameworks: ["Xilinx Vivado", "ModelSim / QuestaSim", "Synopsys Design Compiler", "Cadence Virtuoso", "EDA Playground"],
    keyCertifications: [
      { name: "VLSI Design Verification with SystemVerilog (NPTEL)", issuer: "IIT Kharagpur / NPTEL", isFree: true },
      { name: "Cadence Certified Associate: Digital IC Design", issuer: "Cadence Design Systems" },
    ],
    projectIdeas: [
      {
        title: "32-bit Pipelined RISC-V Processor Core in Verilog",
        difficulty: "Advanced",
        description: "Implement a 5-stage pipelined processor supporting RV32I base integer instruction set with hazard detection and forwarding units.",
      },
      {
        title: "FPGA-Based Real-time Video/Audio Filter Processor",
        difficulty: "Advanced",
        description: "Interface an FPGA board with a camera/microphone to perform hardware-accelerated FIR filtering or edge detection.",
      },
    ],
    roadmap: {
      year1: ["Master Digital Logic Design, Number Systems, Boolean Algebra, and C programming", "Learn basic circuit simulation tools"],
      year2: ["Learn Verilog HDL and simulate circuits on ModelSim / EDA Playground", "Study Computer Architecture and 8086/8051 Microprocessors", "Write testbenches for combinational and sequential circuits"],
      year3: ["Learn SystemVerilog and basic UVM verification concepts", "Synthesize designs onto FPGA boards (Basys3/Nexys)", "Master Python/Tcl scripting for EDA automation"],
      year4: ["Design a RISC-V or ASIC module for final Capstone project", "Prepare for core VLSI technical interviews (Timing, FSMs, Setup/Hold times)", "Target campus and off-campus semiconductor hiring"],
    },
    recommendedCoursesInCollege: [
      "Digital Electronics & Logic Design",
      "VLSI Design & Technology",
      "Microprocessors & Microcontrollers",
      "Computer Architecture",
      "Linear Integrated Circuits",
    ],
    freeResources: [
      { title: "NPTEL VLSI Design by IIT Madras", url: "https://nptel.ac.in", platform: "NPTEL" },
      { title: "EDA Playground (Online Verilog IDE)", url: "https://www.edaplayground.com", platform: "EDA Playground" },
      { title: "ChipVerify SystemVerilog Tutorials", url: "https://www.chipverify.com", platform: "ChipVerify" },
    ],
  },
  {
    id: "ece-embedded-iot",
    title: "Embedded Systems & IoT Engineer",
    department: "Electronics & Communication",
    category: "Hardware & Core",
    summary: "Develop low-level firmware, device drivers, and smart connected Internet of Things (IoT) hardware for automotive, robotics, healthcare, and smart devices.",
    demandLevel: "High",
    avgSalary: "₹5 - ₹16 LPA",
    topRecruiters: ["Bosch", "Continental", "Samsung R&D", "Tata Elxsi", "KPIT Technologies", "Honeywell", "Schneider Electric"],
    primarySkills: ["Embedded C & C++", "Microcontrollers (ARM Cortex-M, STM32, ESP32)", "Communication Protocols (UART, SPI, I2C, CAN, MQTT)", "Real-Time Operating Systems (FreeRTOS)", "PCB Design (KiCad)"],
    secondarySkills: ["Device Driver Development", "Linux Kernel basics", "BLE / Wi-Fi / LoRa communication", "Edge AI basics"],
    toolsAndFrameworks: ["STM32CubeIDE", "Keil uVision", "KiCad / EasyEDA", "ESP-IDF", "FreeRTOS", "Wireshark"],
    keyCertifications: [
      { name: "Embedded Systems on ARM Cortex-M", issuer: "Coursera / EdX" },
      { name: "Certified IoT Specialist", issuer: "Cisco Networking Academy" },
    ],
    projectIdeas: [
      {
        title: "Smart Telematics & Fleet Tracking with CAN Bus & ESP32",
        difficulty: "Intermediate",
        description: "Connect to vehicle OBD-II CAN bus to read diagnostics, log GPS coordinates, and transmit data via MQTT to a cloud telemetry dashboard.",
      },
      {
        title: "Automated Medical Health Vitals Monitor with FreeRTOS",
        difficulty: "Advanced",
        description: "Multi-threaded FreeRTOS system on STM32 managing ECG, SpO2, and temperature sensors with OLED display and Bluetooth alerting.",
      },
    ],
    roadmap: {
      year1: ["Master C programming and basic electronics components", "Work on hands-on Arduino projects"],
      year2: ["Learn Embedded C, register-level microcontroller programming (8051/PIC/AVR)", "Master communication protocols (I2C, SPI, UART)"],
      year3: ["Transition to 32-bit ARM Cortex-M / STM32 and ESP32 with FreeRTOS", "Design custom 2-layer PCBs using KiCad", "Learn basic Linux and IoT cloud platforms"],
      year4: ["Build an industrial-grade IoT/Embedded hardware Capstone", "Apply for Embedded Firmware & Automotive software companies"],
    },
    recommendedCoursesInCollege: [
      "Microcontrollers & Interfacing",
      "Embedded Systems Design",
      "Wireless Communication",
      "Control Systems",
      "Sensors & Signal Conditioning",
    ],
    freeResources: [
      { title: "FastBit Embedded Brain Academy Tutorials", url: "https://www.youtube.com/@FastBitEmbeddedBrainAcademy", platform: "YouTube" },
      { title: "ESP-IDF Official IoT Documentation", url: "https://docs.espressif.com/projects/esp-idf/en/latest/", platform: "Espressif" },
    ],
  },

  // 7. Electrical & Electronics Engineering (EEE)
  {
    id: "eee-ev-power-systems",
    title: "Electric Vehicle (EV) & Power Electronics Engineer",
    department: "Electrical & Electronics",
    category: "Hardware & Core",
    summary: "Design and optimize electric vehicle powertrains, Battery Management Systems (BMS), motor drives, power converters, and smart renewable energy grids.",
    demandLevel: "High",
    avgSalary: "₹5.5 - ₹18 LPA",
    topRecruiters: ["Tata Motors EV", "Ola Electric", "Ather Energy", "L&T", "ABB", "Siemens", "Schneider Electric", "BHEL", "Adani Green Energy"],
    primarySkills: ["Power Electronics & Converters (DC-DC, Inverters)", "Battery Management Systems (BMS)", "Electric Motor Drives (BLDC / PMSM)", "MATLAB / Simulink Modeling", "Embedded C for Power Controllers"],
    secondarySkills: ["PCB Design for High Voltage", "Thermal Management of Batteries", "Smart Grid & Renewable Integration", "PLC & SCADA Basics"],
    toolsAndFrameworks: ["MATLAB / Simulink", "Ansys Maxwell", "LTSpice / PLECS", "KiCad", "LabVIEW", "Arduino / STM32"],
    keyCertifications: [
      { name: "Electric Vehicles and Mobility (NPTEL)", issuer: "IIT Madras / NPTEL", isFree: true },
      { name: "Power Electronics Specialization", issuer: "University of Colorado / Coursera" },
    ],
    projectIdeas: [
      {
        title: "Smart Battery Management System (BMS) with State-of-Charge (SoC) Estimation",
        difficulty: "Advanced",
        description: "Design a multi-cell lithium-ion BMS circuit with active balancing, temperature monitoring, and Kalman filter SoC estimation in Simulink.",
      },
      {
        title: "Bidirectional DC-DC Converter for Solar-Powered EV Charging Station",
        difficulty: "Intermediate",
        description: "Simulate and prototype a high-efficiency bidirectional buck-boost converter with MPPT control for grid-tied solar microgrids.",
      },
    ],
    roadmap: {
      year1: ["Master Circuit Theory, Electromagnetic Fields, and C / Python basics", "Learn MATLAB fundamentals"],
      year2: ["Study Electrical Machines, Analog Electronics, and Power Systems", "Learn power electronics simulation in LTspice and MATLAB Simulink"],
      year3: ["Deep dive into EV powertrains, BLDC motor control, and BMS architecture", "Design PCB circuits for motor drivers and sensors", "Complete an EV or power sector industrial internship"],
      year4: ["Build an EV prototype / Smart Grid Capstone project", "Prepare for Core EEE campus drives and GATE exam for PSUs (NTPC, PGCIL, BHEL)"],
    },
    recommendedCoursesInCollege: [
      "Power Electronics",
      "Electrical Machines I & II",
      "Power System Analysis",
      "Control Systems",
      "Renewable Energy Systems",
    ],
    freeResources: [
      { title: "NPTEL Electric Vehicles by IIT Madras", url: "https://nptel.ac.in", platform: "NPTEL" },
      { title: "MATLAB & Simulink Onramp", url: "https://matlabacademy.mathworks.com", platform: "MathWorks" },
    ],
  },
  {
    id: "eee-industrial-automation",
    title: "Industrial Automation & PLC / SCADA Engineer",
    department: "Electrical & Electronics",
    category: "Hardware & Core",
    summary: "Automate manufacturing plants, robotic assembly lines, and power utilities using programmable logic controllers (PLCs), SCADA, and industrial IoT protocols.",
    demandLevel: "Growing",
    avgSalary: "₹4.5 - ₹14 LPA",
    topRecruiters: ["Siemens", "Rockwell Automation", "Schneider Electric", "Honeywell", "Yokogawa", "L&T Electrical & Automation", "JSW Steel"],
    primarySkills: ["PLC Programming (Ladder Logic, FBD, SCL)", "SCADA & HMI Design", "Industrial Protocols (Modbus, Profibus, OPC-UA)", "Electrical Panel Design & AutoCAD Electrical", "Control Systems Tuning (PID)"],
    secondarySkills: ["Python for Industry 4.0", "Variable Frequency Drives (VFDs)", "Robotics Integration", "Instrumentation"],
    toolsAndFrameworks: ["Siemens TIA Portal", "Rockwell RSLogix 5000", "AutoCAD Electrical", "Wonderware InTouch", "MATLAB"],
    keyCertifications: [
      { name: "Certified Automation Engineer", issuer: "Siemens / Rockwell Partner" },
      { name: "Industrial Automation using PLC/SCADA (NPTEL)", issuer: "NPTEL", isFree: true },
    ],
    projectIdeas: [
      {
        title: "Automated Sorting and Bottling Plant Simulation using PLC & SCADA",
        difficulty: "Intermediate",
        description: "Program ladder logic for conveyor tracking, color sorting pneumatic pistons, and build an operator HMI in TIA Portal.",
      },
    ],
    roadmap: {
      year1: ["Master basic electrical circuits and logic gates", "Learn basics of C and Python"],
      year2: ["Study Control Systems and Industrial Instrumentation", "Learn Relay logic and basic PLC ladder programming"],
      year3: ["Master Siemens / Allen-Bradley PLC programming and HMI/SCADA design", "Learn AutoCAD Electrical for schematic schematics", "Undergo plant industrial training"],
      year4: ["Capstone on Industry 4.0 IoT connected manufacturing cell", "Target automation and core manufacturing recruitment drives"],
    },
    recommendedCoursesInCollege: ["Control Systems", "Industrial Instrumentation", "Power Systems Operation & Control", "Microcontrollers & Applications"],
    freeResources: [
      { title: "RealPars PLC & Automation Tutorials", url: "https://www.youtube.com/@RealPars", platform: "YouTube" },
    ],
  },

  // 8. Mechanical Engineering
  {
    id: "mech-cad-design-engineer",
    title: "CAD / CAM & Product Design Engineer",
    department: "Mechanical Engineering",
    category: "Hardware & Core",
    summary: "Design innovative mechanical components, consumer products, automotive sub-systems, and manufacturing tooling using high-end 3D CAD and simulation software.",
    demandLevel: "High",
    avgSalary: "₹4.5 - ₹15 LPA",
    topRecruiters: ["Tata Motors", "Mahindra & Mahindra", "L&T Heavy Engineering", "Maruti Suzuki", "Ashok Leyland", "Dassault Systèmes", "Altair Engineering", "Godrej"],
    primarySkills: ["3D CAD Modeling (SolidWorks / CATIA / Creo)", "Geometric Dimensioning & Tolerancing (GD&T)", "Finite Element Analysis (ANSYS)", "Manufacturing Processes & DFM/DFA", "Product Lifecycle Management (PLM)"],
    secondarySkills: ["Computational Fluid Dynamics (CFD)", "Reverse Engineering & 3D Printing", "Material Selection & Metallurgy", "Python for Engineering Calculations"],
    toolsAndFrameworks: ["SolidWorks", "CATIA V5", "ANSYS Mechanical / Fluent", "AutoCAD", "PTC Creo", "Fusion 360"],
    keyCertifications: [
      { name: "Certified SOLIDWORKS Associate / Professional (CSWA/CSWP)", issuer: "Dassault Systèmes" },
      { name: "Autodesk Certified Professional: Inventor", issuer: "Autodesk" },
      { name: "ANSYS Structural Simulation Specialization", issuer: "ANSYS / Coursera" },
    ],
    projectIdeas: [
      {
        title: "Design, FEA Stress Optimization & 3D Printing of an All-Terrain Vehicle Suspension Arm",
        difficulty: "Intermediate",
        description: "Model a double-wishbone suspension in SolidWorks, conduct static and dynamic fatigue analysis in ANSYS, and optimize weight using generative design.",
      },
      {
        title: "CFD Aerodynamic Drag Reduction Analysis for Electric Sports Car",
        difficulty: "Advanced",
        description: "Analyze airflow velocity and pressure coefficients across spoiler and diffuser geometries using ANSYS Fluent.",
      },
    ],
    roadmap: {
      year1: ["Master Engineering Graphics, Engineering Mechanics, and AutoCAD 2D drafting", "Learn workshop practices (lathe, milling, welding)"],
      year2: ["Master 3D parametric CAD modeling in SolidWorks / CATIA", "Study Strength of Materials, Kinematics of Machinery, and GD&T standards", "Clear CSWA certification exam"],
      year3: ["Learn Finite Element Analysis (FEA) and CFD in ANSYS", "Join college SAE BAJA / Formula Student / Robotics team", "Complete a manufacturing/design internship"],
      year4: ["Design complete Capstone mechanical machine or vehicle subassembly", "Prepare for Core Automotive & Aerospace company placement tests"],
    },
    recommendedCoursesInCollege: [
      "Design of Machine Elements",
      "Strength of Materials",
      "Kinematics & Dynamics of Machines",
      "Fluid Mechanics & Hydraulic Machines",
      "CAD/CAM",
    ],
    freeResources: [
      { title: "SolidWorks Official Tutorials", url: "https://www.solidworks.com", platform: "SolidWorks" },
      { title: "SimCafe Cornell ANSYS Tutorials", url: "https://simcafe.org", platform: "Cornell University" },
      { title: "NPTEL Design of Machine Elements", url: "https://nptel.ac.in", platform: "NPTEL" },
    ],
  },
  {
    id: "mech-robotics-automation",
    title: "Robotics, Mechatronics & Automation Specialist",
    department: "Mechanical Engineering",
    category: "Hardware & Core",
    summary: "Integrate mechanical mechanisms with sensors, microcontrollers, computer vision, and ROS (Robot Operating System) to engineer autonomous industrial robots and drones.",
    demandLevel: "Growing",
    avgSalary: "₹6 - ₹18 LPA",
    topRecruiters: ["KUKA Robotics", "Fanuc", "ABB", "Tata Elxsi", "DRDO", "ISRO", "Addverb Technologies", "GreyOrange Robotics"],
    primarySkills: ["Robot Kinematics & Dynamics", "Robot Operating System (ROS / ROS2)", "C++ & Python", "Sensor Fusion & Actuators", "Mechatronics System Design"],
    secondarySkills: ["Computer Vision (OpenCV)", "Control Systems", "SolidWorks mechanism simulation", "Embedded Linux"],
    toolsAndFrameworks: ["ROS2", "Gazebo Simulator", "SolidWorks", "MATLAB Robotics Toolbox", "OpenCV", "Raspberry Pi / Arduino"],
    keyCertifications: [
      { name: "Modern Robotics Specialization", issuer: "Northwestern University / Coursera" },
      { name: "ROS for Beginners (ROS2 Basics)", issuer: "ConstructSim / Udemy" },
    ],
    projectIdeas: [
      {
        title: "Autonomous 4-Wheeled Mobile Robot with SLAM & Lidar Navigation in ROS2",
        difficulty: "Advanced",
        description: "Simulate in Gazebo and build on physical hardware with Lidar sensor, mapping an indoor floorplan and navigating obstacles autonomously.",
      },
    ],
    roadmap: {
      year1: ["Master basic mechanics, electronics, and C/C++ programming"],
      year2: ["Learn Python, Arduino/Raspberry Pi interfacing, and Mechatronics basics", "Model mechanical robotic arms in SolidWorks"],
      year3: ["Master Robot Operating System (ROS2) and Gazebo simulation", "Study forward and inverse kinematics, path planning algorithms", "Build working robotic prototype"],
      year4: ["Capstone on Autonomous Robotics / Industrial Cobot", "Interview with Robotics and Mechatronics companies"],
    },
    recommendedCoursesInCollege: ["Mechatronics & Robotics", "Control Systems", "Microprocessors", "Design of Mechanisms"],
    freeResources: [
      { title: "The Construct ROS Tutorials", url: "https://www.theconstructsim.com", platform: "ConstructSim" },
    ],
  },

  // 9. Civil Engineering
  {
    id: "civil-structural-engineer",
    title: "Structural Design Engineer",
    department: "Civil Engineering",
    category: "Civil & Structural",
    summary: "Analyze and design safe, resilient, and earthquake-resistant reinforced concrete and steel structures, high-rise towers, bridges, and infrastructure projects.",
    demandLevel: "High",
    avgSalary: "₹4.5 - ₹14 LPA",
    topRecruiters: ["Larsen & Toubro (L&T)", "Tata Projects", "Afcons Infrastructure", "Shapoorji Pallonji", "WSP", "Arup", "AECOM", "Gammon India"],
    primarySkills: ["Structural Analysis & Design", "STAAD.Pro / ETABS / SAFE", "Reinforced Concrete & Steel Design (IS 456, IS 800 codes)", "AutoCAD 2D/3D", "Seismic & Wind Load Calculation"],
    secondarySkills: ["Building Information Modeling (Revit Structure)", "Geotechnical foundation design", "Quantity Surveying & Estimation", "Project Management"],
    toolsAndFrameworks: ["ETABS", "STAAD.Pro", "AutoCAD", "Revit Structure", "SAFE", "MS Excel Structural Spreadsheets"],
    keyCertifications: [
      { name: "Autodesk Certified Professional: Revit Structure", issuer: "Autodesk" },
      { name: "STAAD.Pro Certified Structural Designer", issuer: "Bentley Institute" },
      { name: "Design of Reinforced Concrete Structures (NPTEL)", issuer: "IIT Kharagpur / NPTEL", isFree: true },
    ],
    projectIdeas: [
      {
        title: "Complete Structural Analysis & Earthquake-Resistant Design of G+10 Commercial Building",
        difficulty: "Advanced",
        description: "Model in ETABS with dynamic response spectrum analysis per IS 1893, design shear walls, beams, columns, and raft foundation with detailed AutoCAD detailing.",
      },
      {
        title: "Design of Continuous Steel Truss Bridge over 60m Span",
        difficulty: "Intermediate",
        description: "Perform dead, live, and wind load distribution analysis using STAAD.Pro and optimize steel section weights in compliance with IRC codes.",
      },
    ],
    roadmap: {
      year1: ["Master Engineering Graphics, Surveying basics, and AutoCAD 2D drafting", "Learn building materials and construction fundamentals"],
      year2: ["Study Strength of Materials, Structural Analysis I, Fluid Mechanics, and Soil Mechanics", "Learn manual structural calculations per IS Codes"],
      year3: ["Master ETABS, STAAD.Pro, and Revit Structural software", "Perform design of RC beams, slabs, columns, and footings per IS 456", "Summer site internship with L&T or general contractor"],
      year4: ["Complete comprehensive G+N high-rise design Capstone project", "Prepare for L&T ECC, Tata Projects, and GATE for PSU jobs (NHAI, CPWD, NBCC)"],
    },
    recommendedCoursesInCollege: [
      "Design of Reinforced Concrete Structures",
      "Design of Steel Structures",
      "Structural Analysis I & II",
      "Geotechnical Engineering",
      "Estimation, Costing & Valuation",
    ],
    freeResources: [
      { title: "NPTEL Structural Analysis by IIT Kharagpur", url: "https://nptel.ac.in", platform: "NPTEL" },
      { title: "Bentley Structural Analysis Tutorials", url: "https://www.bentley.com", platform: "Bentley" },
    ],
  },
  {
    id: "civil-bim-project-manager",
    title: "BIM Specialist & Construction Project Manager",
    department: "Civil Engineering",
    category: "Civil & Structural",
    summary: "Coordinate 3D/4D/5D Building Information Modeling (BIM) architectures, clash detection, budget scheduling, and digitized construction workflows on mega infrastructure projects.",
    demandLevel: "Growing",
    avgSalary: "₹5 - ₹16 LPA",
    topRecruiters: ["L&T Construction", "AECOM", "Jacobs", "Turner Construction", "Atkins", "Mott MacDonald", "Sobha Developers"],
    primarySkills: ["BIM Modeling (Revit Architecture, MEP, Structure)", "Clash Detection & Coordination (Navisworks)", "Project Scheduling (Primavera P6, MS Project)", "Quantity Takeoff & 5D Cost Estimation", "Lean Construction Principles"],
    secondarySkills: ["Drone Photogrammetry & GIS", "Green Building & LEED standards", "Site Safety & Contract Administration (FIDIC)"],
    toolsAndFrameworks: ["Autodesk Revit", "Navisworks Manage", "Primavera P6", "AutoCAD Civil 3D", "MS Project", "BIM 360 / Autodesk Construction Cloud"],
    keyCertifications: [
      { name: "Autodesk Certified Professional: Revit / BIM Coordinator", issuer: "Autodesk" },
      { name: "Primavera P6 Professional Project Management", issuer: "Oracle" },
      { name: "LEED Green Associate", issuer: "USGBC" },
    ],
    projectIdeas: [
      {
        title: "Multi-Disciplinary 4D BIM Model & Clash Detection for Hospital Facility",
        difficulty: "Advanced",
        description: "Integrate Architectural, Structural, and MEP models in Navisworks, resolve 50+ spatial clashes, and simulate construction schedule timeline.",
      },
    ],
    roadmap: {
      year1: ["Master basic AutoCAD drafting and building construction basics"],
      year2: ["Learn Autodesk Revit Architecture and Structural modeling", "Study building planning, bylaws, and surveying"],
      year3: ["Learn Navisworks for clash detection and Primavera P6 for scheduling", "Complete a site or digital engineering internship"],
      year4: ["Build an integrated BIM capstone portfolio", "Apply for BIM Modeler / Coordinator and Project Engineering roles"],
    },
    recommendedCoursesInCollege: [
      "Building Planning & Drawing",
      "Construction Management & Equipment",
      "Transportation Engineering",
      "GIS & Remote Sensing",
    ],
    freeResources: [
      { title: "BIM Pure Free Revit Tutorials", url: "https://bimpure.com", platform: "BIM Pure" },
      { title: "Autodesk Design Academy", url: "https://www.autodesk.com/education", platform: "Autodesk" },
    ],
  },

  // 10. Higher Studies & Government Jobs (All Departments)
  {
    id: "all-gate-psu-higher-studies",
    title: "GATE, PSU & Higher Studies (M.Tech / MS Abroad / IES)",
    department: "All Departments",
    category: "Government & Higher Studies",
    summary: "Clear national competitive examinations like GATE for admissions into IITs/IISc for M.Tech or top engineering PSU recruitment (ONGC, IOCL, NTPC, BHEL, ISRO, DRDO) or pursue MS/MBA.",
    demandLevel: "Very High",
    avgSalary: "₹10 - ₹25 LPA (PSU / Post-M.Tech)",
    topRecruiters: ["ISRO", "DRDO", "BARC", "ONGC", "IOCL", "NTPC", "BHEL", "Power Grid (PGCIL)", "IITs / IISc Bangalore", "Top US/European Universities"],
    primarySkills: ["Comprehensive Core Engineering Fundamentals", "Engineering Mathematics", "General Aptitude & Reasoning", "Technical Problem Solving", "Analytical Writing"],
    secondarySkills: ["Research Paper Writing & Literature Review", "GRE / TOEFL / IELTS (for MS Abroad)", "CAT (for IIMs / Tech-MBA)"],
    toolsAndFrameworks: ["Virtual GATE Calculator", "LaTeX for Technical Writing", "Overleaf", "NPTEL Video Lectures"],
    keyCertifications: [
      { name: "GATE Qualified Scorecard (Top Percentile)", issuer: "IITs / IISc" },
      { name: "NPTEL Elite + Gold Certifications in Core Subjects", issuer: "MHRD / IITs", isFree: true },
    ],
    projectIdeas: [
      {
        title: "Academic Research Thesis with IEEE / UGC-CARE Publication",
        difficulty: "Advanced",
        description: "Formulate a novel methodology or comparative benchmark in your domain, validate with simulations, and publish a peer-reviewed research paper.",
      },
    ],
    roadmap: {
      year1: ["Master Engineering Mathematics I & II and Basic Sciences", "Understand GATE syllabus for your branch and start early conceptual clarity"],
      year2: ["Master 4 core departmental subjects (e.g. DSA/DBMS for CS, DLD/Signals for EC, SOM/Thermodynamics for Mech, Structures for Civil)", "Start solving previous 10 years GATE questions (PYQs) topic-wise"],
      year3: ["Complete 80% of GATE syllabus by end of 6th semester", "Attempt subject-wise mock test series (Made Easy / Ace Academy)", "Write research papers if aspiring for MS in Germany/US"],
      year4: ["Attempt full-length GATE mock tests in Dec-Jan, analyze weak areas", "Appear for GATE in February", "Apply for PSU recruitments and COAP counselling for IIT M.Tech seats"],
    },
    recommendedCoursesInCollege: [
      "Engineering Mathematics I, II & III",
      "All Core Branch Foundations",
      "Probability & Statistics",
    ],
    freeResources: [
      { title: "NPTEL Video Lectures by IIT Faculty", url: "https://nptel.ac.in", platform: "Govt of India" },
      { title: "GATE Overflow Previous Year Explanations", url: "https://gateoverflow.in", platform: "GATE Community" },
    ],
  },
];

export const CAREER_QUIZ_QUESTIONS: CareerQuizQuestion[] = [
  {
    id: 1,
    question: "What kind of engineering problems excite you the most?",
    options: [
      {
        label: "Building web apps, mobile apps, and interactive cloud systems",
        description: "Writing code, crafting UIs, and architecting scalable backend systems.",
        suggestedCategory: "Software & IT",
        suggestedDepartments: ["Computer Science & Engineering"],
      },
      {
        label: "Training AI models, uncovering patterns in data, and generative intelligence",
        description: "Working with Python, machine learning algorithms, LLMs, and big data pipelines.",
        suggestedCategory: "AI & Data",
        suggestedDepartments: [
          "Computer Science & Engineering (AI & ML)",
          "Computer Science & Engineering (Data Science)",
          "Computer Science & Engineering (Big Data Analytics)",
        ],
      },
      {
        label: "Hardware chips, microcontrollers, IoT, or electronic circuits",
        description: "Designing VLSI chips, programming embedded firmware, or electric vehicle drives.",
        suggestedCategory: "Hardware & Core",
        suggestedDepartments: ["Electronics & Communication", "Electrical & Electronics"],
      },
      {
        label: "3D CAD modeling, mechanics, robotics, or structural building design",
        description: "Simulating physical stress, drafting architectural blueprints, and robotics.",
        suggestedCategory: "Civil & Structural",
        suggestedDepartments: ["Mechanical Engineering", "Civil Engineering"],
      },
      {
        label: "Hacking defenses, network security, and hunting system vulnerabilities",
        description: "Ethical hacking, penetration testing, and securing digital infrastructure.",
        suggestedCategory: "Cyber & Cloud",
        suggestedDepartments: ["Computer Science & Engineering (Cyber Security)"],
      },
      {
        label: "Targeting top PSUs (ISRO, ONGC, BHEL), IIT M.Tech, or Master's abroad",
        description: "Deep research, cracking GATE with top percentile, or pursuing MS/MBA.",
        suggestedCategory: "Government & Higher Studies",
        suggestedDepartments: ["All Departments"],
      },
    ],
  },
  {
    id: 2,
    question: "Which work environment and day-to-day tools appeal to you?",
    options: [
      {
        label: "VS Code, Git, React, Node.js, and Cloud Infrastructure",
        description: "Building production software with agile teams.",
        suggestedCategory: "Software & IT",
        suggestedDepartments: ["Computer Science & Engineering"],
      },
      {
        label: "Jupyter Notebooks, PyTorch, SQL, and Power BI dashboards",
        description: "Crunching large datasets and training neural networks.",
        suggestedCategory: "AI & Data",
        suggestedDepartments: ["Computer Science & Engineering (AI & ML)", "Computer Science & Engineering (Data Science)"],
      },
      {
        label: "Oscilloscopes, FPGA boards, Vivado, and KiCad PCB software",
        description: "Tinkering with hardware labs and silicon chip synthesis.",
        suggestedCategory: "Hardware & Core",
        suggestedDepartments: ["Electronics & Communication", "Electrical & Electronics"],
      },
      {
        label: "SolidWorks, ANSYS, ETABS, Revit, or Construction Sites",
        description: "Physical engineering, simulations, and tangible infrastructure.",
        suggestedCategory: "Civil & Structural",
        suggestedDepartments: ["Mechanical Engineering", "Civil Engineering"],
      },
    ],
  },
  {
    id: 3,
    question: "What is your primary career aspiration after engineering?",
    options: [
      {
        label: "High-paying Software / Product Company Job (₹8 - ₹25+ LPA)",
        description: "Focus on DSA, system design, development, and tech campus placements.",
        suggestedCategory: "Software & IT",
        suggestedDepartments: ["Computer Science & Engineering"],
      },
      {
        label: "AI Researcher / Data Scientist / Machine Learning Engineer",
        description: "Specializing in the booming AI ecosystem.",
        suggestedCategory: "AI & Data",
        suggestedDepartments: ["Computer Science & Engineering (AI & ML)", "Computer Science & Engineering (Data Science)"],
      },
      {
        label: "Core Engineering Giant (Qualcomm, Texas Instruments, L&T, Tata Motors)",
        description: "Building semiconductor, automotive, aerospace, or industrial systems.",
        suggestedCategory: "Hardware & Core",
        suggestedDepartments: ["Electronics & Communication", "Electrical & Electronics", "Mechanical Engineering"],
      },
      {
        label: "Govt / PSU Job (ISRO, DRDO, IOCL) or M.Tech from IITs / MS Abroad",
        description: "High job security or prestigious research credentials.",
        suggestedCategory: "Government & Higher Studies",
        suggestedDepartments: ["All Departments"],
      },
    ],
  },
];

export const INTERVIEW_PREP_CHECKLIST = [
  {
    category: "Coding & DSA",
    items: [
      "Arrays, Strings & HashMaps (Two Pointers, Sliding Window)",
      "Linked Lists, Stacks & Queues",
      "Trees & Binary Search Trees (BFS, DFS, Traversals)",
      "Graphs & Dynamic Programming (Shortest Path, Memoization, Tabulation)",
      "Time & Space Complexity analysis (Big-O notation)",
    ],
  },
  {
    category: "Core CS & Engineering Fundamentals",
    items: [
      "Operating Systems (Process Scheduling, Deadlocks, Memory Management, Paging)",
      "Database Management Systems (SQL Joins, Normalization, ACID Properties, Indexing)",
      "Computer Networks (OSI 7 Layers, TCP vs UDP, HTTP/HTTPS, DNS)",
      "Object-Oriented Programming (Encapsulation, Polymorphism, Abstraction, Inheritance)",
    ],
  },
  {
    category: "Resume & Portfolio Best Practices",
    items: [
      "Use clean single-page ATS-compliant format (e.g. Jake's Resume or Overleaf template)",
      "Include GitHub links with active commits and live project URLs",
      "Quantify achievements (e.g. 'Improved query latency by 45%', 'Handled 500+ daily requests')",
      "Highlight competitive ratings (LeetCode, CodeChef, Hackathons, Paper Publications)",
    ],
  },
  {
    category: "HR & Behavioral Rounds",
    items: [
      "Prepare your 90-second 'Tell me about yourself' elevator pitch",
      "Structure scenario answers with the STAR method (Situation, Task, Action, Result)",
      "Research company mission, products, recent news, and core values",
      "Prepare 3 thoughtful questions to ask the interviewer at the end",
    ],
  },
];
