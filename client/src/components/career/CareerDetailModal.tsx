import React, { useState } from "react";
import { CareerPath } from "@/data/careerData";
import { Dialog,DialogContent,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase,TrendingUp,Award,Lightbulb,Building2,BookOpen,ExternalLink,CheckCircle2,Layers,GraduationCap,Calendar,Sparkles,ListTree } from "lucide-react";
import { Link } from "react-router-dom";
import { CourseMindMapRoadmap } from "./CourseMindMapRoadmap";

interface CareerDetailModalProps {
  career: CareerPath | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("roadmap");

  if (!career) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl lg:max-w-5xl w-full h-[92vh] max-h-[92vh] p-0 overflow-hidden flex flex-col gap-0 border rounded-xl shadow-2xl">
        {/* Header with gradient accent (Fixed at top) */}
        <div className="bg-hero-gradient p-5 sm:p-6 text-primary-foreground shrink-0 relative">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs backdrop-blur-sm">
              {career.department}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs backdrop-blur-sm">
              {career.category}
            </Badge>
            <Badge className="bg-emerald-500/90 text-white border-0 text-xs flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Demand: {career.demandLevel}
            </Badge>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
            {career.title}
          </DialogTitle>
          <DialogDescription className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2">
            {career.summary}
          </DialogDescription>

          <div className="mt-3 flex flex-wrap items-center gap-4 pt-2.5 border-t border-white/20 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <Briefcase className="h-3.5 w-3.5" /> Average Package: <span className="font-bold text-white text-xs sm:text-sm">{career.avgSalary}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate max-w-md">
              <Building2 className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Recruiters: {career.topRecruiters.slice(0, 4).join(", ")} + more</span>
            </div>
          </div>
        </div>

        {/* Tabs and Scrollable Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
          {/* Fixed Tab Navigation Header */}
          <div className="bg-muted/40 border-b p-2 sm:p-3 shrink-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="roadmap" className="text-xs sm:text-sm flex items-center gap-1">
                <ListTree className="h-3.5 w-3.5 hidden sm:inline" /> Course Roadmap
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs sm:text-sm flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 hidden sm:inline" /> Skills & Tools
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm flex items-center gap-1">
                <Lightbulb className="h-3.5 w-3.5 hidden sm:inline" /> Projects & Certs
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-sm flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5 hidden sm:inline" /> Free Resources
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Course Learning Roadmap (Visual Tree Mind Map) */}
          <TabsContent value="roadmap" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0 focus-visible:outline-none">
            <div className="space-y-4">
              <CourseMindMapRoadmap career={career} />

              {/* Key College Subjects to Master */}
              <div className="rounded-lg border p-4 bg-card/60">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> Key College Subjects Connected to this Roadmap
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {career.recommendedCoursesInCollege.map((subject, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs py-1">
                      {subject}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2.5">
                  <Link to="/browse" onClick={onClose}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-1 hover:bg-primary/10">
                      Find study notes for these subjects →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="h-6" />
          </TabsContent>

          {/* Tab 2: Skills & Tools */}
          <TabsContent value="skills" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0 focus-visible:outline-none">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Primary Technical Skills (Must-Have)
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.primarySkills.map((skill, idx) => (
                  <Badge key={idx} className="bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 px-2.5 py-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Secondary & Good-to-Have Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.secondarySkills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="px-2.5 py-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Industry Tools & Frameworks
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.toolsAndFrameworks.map((tool, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 text-xs font-medium">
                    <Layers className="h-3 w-3 text-primary" /> {tool}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Top Hiring Companies for this Profile
              </h4>
              <div className="flex flex-wrap gap-2">
                {career.topRecruiters.map((company, idx) => (
                  <Badge key={idx} variant="outline" className="px-2.5 py-1 text-xs bg-muted/40">
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="h-6" />
          </TabsContent>

          {/* Tab 3: Projects & Certifications */}
          <TabsContent value="projects" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0 focus-visible:outline-none">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Resume-Worthy Project Ideas
              </h4>
              <div className="space-y-3">
                {career.projectIdeas.map((project, idx) => (
                  <div key={idx} className="rounded-lg border bg-card p-4 hover:border-primary/40 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h5 className="font-semibold text-sm text-foreground">{project.title}</h5>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] uppercase shrink-0 ${
                          project.difficulty === "Advanced"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : project.difficulty === "Intermediate"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {project.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-primary" /> Recognized Industry Certifications
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {career.keyCertifications.map((cert, idx) => (
                  <div key={idx} className="rounded-lg border bg-muted/20 p-3 flex flex-col justify-between">
                    <div>
                      <div className="font-medium text-xs text-foreground mb-0.5">{cert.name}</div>
                      <div className="text-[11px] text-muted-foreground">Issued by: {cert.issuer}</div>
                    </div>
                    {cert.isFree && (
                      <span className="mt-2 inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ Free / NPTEL Supported
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-6" />
          </TabsContent>

          {/* Tab 4: Free Learning Resources */}
          <TabsContent value="resources" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0 focus-visible:outline-none">
            <div className="rounded-lg border bg-primary/5 p-3 text-xs text-muted-foreground">
              Curated high-quality free roadmaps, video tutorials, and interactive repositories to learn without paywalls.
            </div>

            <div className="space-y-2.5">
              {career.freeResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border bg-card p-3.5 hover:bg-muted/50 hover:border-primary/50 transition-all group"
                >
                  <div>
                    <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {res.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Platform: {res.platform}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 group-hover:text-primary shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ))}
            </div>
            <div className="h-6" />
          </TabsContent>
        </Tabs>

        {/* Modal Footer (Fixed at bottom) */}
        <div className="border-t p-3 sm:p-4 flex items-center justify-between bg-card shrink-0">
          <Link to="/browse" onClick={onClose}>
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Explore Study Materials
            </Button>
          </Link>
          <Button onClick={onClose} size="sm" className="bg-hero-gradient text-white text-xs">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
