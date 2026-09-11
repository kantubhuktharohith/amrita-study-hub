import React, { useState, useMemo } from "react";
import {
  CAREER_PATHS,
  CareerPath,
  INTERVIEW_PREP_CHECKLIST,
} from "@/data/careerData";
import { DEPARTMENTS } from "@/data/academicConstants";
import { CareerPathCard } from "@/components/career/CareerPathCard";
import { CareerDetailModal } from "@/components/career/CareerDetailModal";
import { CareerQuizModal } from "@/components/career/CareerQuizModal";
import { YearlyRoadmapView } from "@/components/career/YearlyRoadmapView";
import { BranchInterviewPrepView } from "@/components/career/BranchInterviewPrepView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Compass,
  GraduationCap,
  Briefcase,
  CheckCircle,
  FileCheck,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ALL_DEPARTMENTS_FILTER = "All Branches";

const BRANCH_BUTTONS = [
  { label: "All Branches", value: ALL_DEPARTMENTS_FILTER },
  { label: "CSE (Core)", value: "Computer Science & Engineering" },
  { label: "CSE (AI & ML)", value: "Computer Science & Engineering (AI & ML)" },
  { label: "CSE (AIDS)", value: "Computer Science & Engineering (AIDS)" },
  {
    label: "CSE (Data Science)",
    value: "Computer Science & Engineering (Data Science)",
  },
  {
    label: "CSE (Cyber Security)",
    value: "Computer Science & Engineering (Cyber Security)",
  },
  {
    label: "CSE (Big Data)",
    value: "Computer Science & Engineering (Big Data Analytics)",
  },
  { label: "ECE", value: "Electronics & Communication" },
  { label: "EEE", value: "Electrical & Electronics" },
  { label: "Mechanical", value: "Mechanical Engineering" },
  { label: "Civil", value: "Civil Engineering" },
];

const CareerGuidancePage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>(
    ALL_DEPARTMENTS_FILTER,
  );
  const [activeTab, setActiveTab] = useState<"roles" | "yearly" | "interview">(
    "roles",
  );

  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const handleOpenDetail = (career: CareerPath) => {
    setSelectedCareer(career);
    setIsDetailModalOpen(true);
  };

  // Filter career paths based on selected branch
  const filteredCareers = useMemo(() => {
    return CAREER_PATHS.filter((path) => {
      const matchesBranch =
        selectedDept === ALL_DEPARTMENTS_FILTER ||
        path.department === selectedDept ||
        path.department === "All Departments";

      return matchesBranch;
    });
  }, [selectedDept]);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-16 bg-card border-b">
        <div className="absolute inset-0 bg-hero-gradient opacity-5 pointer-events-none" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Amrita Career Guidance &
              Roadmaps
            </div>
            <h1 className="mb-3 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Career Guidance for{" "}
              <span className="text-gradient">All Engineering Courses</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
              Clear, step-by-step career pathways, year-by-year college
              milestones, high-value certifications, project ideas, and
              interview strategies tailored for every engineering branch.
            </p>

            {/* Quick Action CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => setIsQuizModalOpen(true)}
                size="lg"
                className="bg-hero-gradient text-primary-foreground hover:opacity-90 shadow-sm text-xs sm:text-sm"
              >
                <Compass className="mr-2 h-4 w-4" /> Find My Ideal Career Path
                Quiz
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveTab("yearly")}
                className="text-xs sm:text-sm"
              >
                <GraduationCap className="mr-2 h-4 w-4" /> View 4-Year
                Milestones
              </Button>
            </div>

            {/* Key stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t">
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  9+
                </div>
                <div className="text-xs text-muted-foreground">
                  Departments Covered
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  12+
                </div>
                <div className="text-xs text-muted-foreground">
                  In-Demand Roles
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  1st - 4th
                </div>
                <div className="text-xs text-muted-foreground">
                  Year-by-Year Roadmaps
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  100% Free
                </div>
                <div className="text-xs text-muted-foreground">
                  Curated Resources
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mt-8">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="w-full"
        >
          {/* Main Top Navigation Switcher */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="roles" className="text-xs sm:text-sm">
                Role Explorer
              </TabsTrigger>
              <TabsTrigger value="yearly" className="text-xs sm:text-sm">
                4-Year Roadmap
              </TabsTrigger>
              <TabsTrigger value="interview" className="text-xs sm:text-sm">
                Interview Prep
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Role Explorer & Pathways */}
          <TabsContent value="roles" className="space-y-6">
            {/* Branch Selector (Clean layout matching 4-Year Roadmap and Interview Prep) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-foreground">
                  Career Pathways by Branch
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Select your branch to view relevant career pathways and course
                  names
                </p>
              </div>

              {/* Branch Buttons */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {BRANCH_BUTTONS.map((b) => (
                  <Button
                    key={b.value}
                    size="sm"
                    variant={selectedDept === b.value ? "default" : "outline"}
                    onClick={() => setSelectedDept(b.value)}
                    className={`text-xs ${
                      selectedDept === b.value
                        ? "bg-hero-gradient text-white border-transparent shadow-sm"
                        : ""
                    }`}
                  >
                    {b.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filteredCareers.length}
                </strong>{" "}
                career pathways
                {selectedDept !== ALL_DEPARTMENTS_FILTER &&
                  ` for ${selectedDept}`}
              </span>
              {selectedDept !== ALL_DEPARTMENTS_FILTER && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDept(ALL_DEPARTMENTS_FILTER)}
                  className="h-7 text-xs text-primary hover:bg-primary/10"
                >
                  Show all branches
                </Button>
              )}
            </div>

            {/* Career Cards Grid */}
            {filteredCareers.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredCareers.map((career) => (
                    <CareerPathCard
                      key={career.id}
                      career={career}
                      onSelect={handleOpenDetail}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-12 text-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                <h3 className="font-semibold text-base mb-1">
                  No career pathways found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                  No career pathways found for this branch. Try selecting
                  another branch.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDept(ALL_DEPARTMENTS_FILTER)}
                  className="text-xs"
                >
                  Show all branches
                </Button>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: 4-Year Milestones Timeline */}
          <TabsContent value="yearly">
            <YearlyRoadmapView />
          </TabsContent>

          {/* TAB 3: Interview & Placement Prep Hub */}
          <TabsContent value="interview" className="space-y-6">
            <BranchInterviewPrepView />
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      <CareerDetailModal
        career={selectedCareer}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Quiz Modal */}
      <CareerQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelectCareer={handleOpenDetail}
      />
    </div>
  );
};

export default CareerGuidancePage;
