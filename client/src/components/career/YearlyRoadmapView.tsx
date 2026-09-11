import React, { useState } from "react";
import { YEARLY_ROADMAPS_BY_BRANCH, YearlyMilestone } from "@/data/careerData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Code,
  Award,
  FolderGit2,
  Briefcase,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const BRANCHES = [
  { label: "CSE (Core)", value: "Computer Science & Engineering" },
  { label: "CSE (AI & ML)", value: "Computer Science & Engineering (AI & ML)" },
  { label: "CSE (AIDS)", value: "Computer Science & Engineering (AIDS)" },
  { label: "CSE (Data Science)", value: "Computer Science & Engineering (Data Science)" },
  { label: "CSE (Cyber Security)", value: "Computer Science & Engineering (Cyber Security)" },
  { label: "CSE (Big Data)", value: "Computer Science & Engineering (Big Data Analytics)" },
  { label: "ECE", value: "Electronics & Communication" },
  { label: "EEE", value: "Electrical & Electronics" },
  { label: "Mechanical", value: "Mechanical Engineering" },
  { label: "Civil", value: "Civil Engineering" },
];

export const YearlyRoadmapView: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].value);
  const milestones: YearlyMilestone[] =
    YEARLY_ROADMAPS_BY_BRANCH[selectedBranch] || [];

  return (
    <div className="space-y-8">
      {/* Stream Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold font-display text-foreground">
            4-Year Engineering College Roadmap
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Year-by-year actionable milestones from Semester 1 to Semester 8 for every branch
          </p>
        </div>

        {/* Branch Buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {BRANCHES.map((b) => (
            <Button
              key={b.value}
              size="sm"
              variant={selectedBranch === b.value ? "default" : "outline"}
              onClick={() => setSelectedBranch(b.value)}
              className={`text-xs ${
                selectedBranch === b.value
                  ? "bg-hero-gradient text-white border-transparent shadow-sm"
                  : ""
              }`}
            >
              {b.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 4 Years Timeline Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {milestones.map((m, idx) => (
          <motion.div
            key={m.year}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="rounded-xl border bg-card p-6 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Branch and Year Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="text-xs font-medium border-primary/20 bg-primary/5 text-primary py-0.5 px-2.5"
                >
                  <GraduationCap className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  {selectedBranch}
                </Badge>
                <Badge className="bg-primary/15 text-primary border-primary/20 text-xs px-2.5 py-0.5">
                  Year {m.year} • Sem {m.year * 2 - 1} & {m.year * 2}
                </Badge>
              </div>

              <h4 className="font-display text-lg font-bold text-foreground mb-1">
                {m.title}
              </h4>
              <p className="text-xs font-medium text-primary mb-4">
                Target: {m.focusArea}
              </p>

              {/* Sections inside each year */}
              <div className="space-y-4 text-xs">
                {/* Academic Goals */}
                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <div className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5 text-xs">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />{" "}
                    Academic Goals
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {m.academicGoals.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Skills */}
                <div>
                  <div className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5 text-xs">
                    <Code className="h-3.5 w-3.5 text-amber-500" /> Key Skills
                    to Learn
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.technicalSkills.map((sk, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-[11px]"
                      >
                        {sk}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5 text-xs">
                    <Award className="h-3.5 w-3.5 text-blue-500" /> Recommended
                    Certifications
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {m.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold">•</span>
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Projects & Activities */}
                <div>
                  <div className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5 text-xs">
                    <FolderGit2 className="h-3.5 w-3.5 text-purple-500" />{" "}
                    Hands-on Projects
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {m.projectsAndActivities.map((proj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Placement Prep */}
                <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
                  <div className="font-semibold text-primary mb-1.5 flex items-center gap-1.5 text-xs">
                    <Briefcase className="h-3.5 w-3.5" /> Placement & Career
                    Readiness
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    {m.placementPrep.map((prep, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span>{prep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
