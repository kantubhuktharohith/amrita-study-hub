import React, { useState, useMemo } from "react";
import {
  CAREER_PATHS,
  CAREER_CATEGORIES,
  CareerPath,
  INTERVIEW_PREP_CHECKLIST,
} from "@/data/careerData";
import { DEPARTMENTS } from "@/data/mockData";
import { CareerPathCard } from "@/components/career/CareerPathCard";
import { CareerDetailModal } from "@/components/career/CareerDetailModal";
import { CareerQuizModal } from "@/components/career/CareerQuizModal";
import { YearlyRoadmapView } from "@/components/career/YearlyRoadmapView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
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

const ALL_DEPARTMENTS_FILTER = "All Courses";

const CareerGuidancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>(
    ALL_DEPARTMENTS_FILTER,
  );
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
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

  // Filter career paths based on search, department, and category
  const filteredCareers = useMemo(() => {
    return CAREER_PATHS.filter((path) => {
      const matchesSearch =
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.primarySkills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        path.topRecruiters.some((r) =>
          r.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesDept =
        selectedDept === ALL_DEPARTMENTS_FILTER ||
        path.department === selectedDept ||
        path.department === "All Departments";

      const matchesCategory =
        selectedCategory === "All Categories" ||
        path.category === selectedCategory;

      return matchesSearch && matchesDept && matchesCategory;
    });
  }, [searchQuery, selectedDept, selectedCategory]);

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
            {/* Search and Filters Bar */}
            <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-card space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by role name, skills (Python, VLSI, React, CAD), or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>

              {/* Department Selector Filter (Scrollable on mobile) */}
              

              {/* Category Filter Pills */}
              <div className="pt-2 border-t flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground mr-1">
                  Domain:
                </span>
                {CAREER_CATEGORIES.map((cat) => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer text-xs py-1 transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </Badge>
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
              {(searchQuery ||
                selectedDept !== ALL_DEPARTMENTS_FILTER ||
                selectedCategory !== "All Categories") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDept(ALL_DEPARTMENTS_FILTER);
                    setSelectedCategory("All Categories");
                  }}
                  className="h-7 text-xs text-primary hover:bg-primary/10"
                >
                  Reset filters
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
                  Try adjusting your search query or removing some
                  category/course filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDept(ALL_DEPARTMENTS_FILTER);
                    setSelectedCategory("All Categories");
                  }}
                  className="text-xs"
                >
                  Clear all filters
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
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold font-display text-foreground">
                  Engineering Campus Placement Master Checklist
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                A structured preparation framework for cracking Technical
                Rounds, Coding Assessments, HR Interviews, and System Design
                tests.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {INTERVIEW_PREP_CHECKLIST.map((sec, idx) => (
                  <div key={idx} className="rounded-lg border bg-muted/20 p-4">
                    <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {sec.category}
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {sec.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2">
                          <span className="text-primary font-bold mt-0.5">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Connection to Study Hub */}
              <div className="mt-8 rounded-xl bg-hero-gradient p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1">
                    Need Subject Notes & Previous Year Exam Papers?
                  </h4>
                  <p className="text-xs sm:text-sm text-white/90">
                    Prepare your semester subjects, mid-exams, and semester-end
                    exams with verified peer notes.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link to="/browse">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs bg-white text-primary hover:bg-white/90"
                    >
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Notes Hub
                    </Button>
                  </Link>
                  <Link to="/exam-papers">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-white/40 text-white hover:bg-white/20"
                    >
                      Exam Papers
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
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
