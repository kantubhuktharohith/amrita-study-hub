import React, { useState, useMemo } from "react";
import { CAREER_PATHS,CareerPath } from "@/data/careerData";
import { CareerPathCard } from "@/components/career/CareerPathCard";
import { CareerDetailModal } from "@/components/career/CareerDetailModal";
import { CareerQuizModal } from "@/components/career/CareerQuizModal";
import { BranchInterviewPrepView } from "@/components/career/BranchInterviewPrepView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles,Compass,HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const ALL_DEPARTMENTS_FILTER = "All Branches";

const CareerGuidancePage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>(
    ALL_DEPARTMENTS_FILTER,
  );
  const [activeTab, setActiveTab] = useState<"roles" | "interview">(
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
              <Sparkles className="h-3.5 w-3.5" /> CampusOrbit Course Roadmaps & Career Prep
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Step-by-Step <span className="text-gradient">Course Roadmaps</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Master the exact technologies, practical frameworks, and projects for your desired engineering field.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={() => setIsQuizModalOpen(true)}
                className="bg-hero-gradient text-white text-xs sm:text-sm font-semibold shadow-md hover:opacity-90 transition-opacity gap-2"
              >
                <Compass className="h-4 w-4" /> Take Career Quiz
              </Button>
            </div>

            {/* Key stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t">
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  9+
                </div>
                <div className="text-xs text-muted-foreground">
                  Branches Covered
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  12+
                </div>
                <div className="text-xs text-muted-foreground">
                  Course Roadmaps
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  Step-by-Step
                </div>
                <div className="text-xs text-muted-foreground">
                  Phased Curriculum
                </div>
              </div>
              <div className="p-2">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  100% Free
                </div>
                <div className="text-xs text-muted-foreground">
                  Learning Resources
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
            <TabsList className="grid w-full max-w-sm grid-cols-2">
              <TabsTrigger value="roles" className="text-xs sm:text-sm font-medium">
                Course Roadmaps
              </TabsTrigger>
              <TabsTrigger value="interview" className="text-xs sm:text-sm font-medium">
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

          {/* Interview & Placement Prep Hub */}
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
