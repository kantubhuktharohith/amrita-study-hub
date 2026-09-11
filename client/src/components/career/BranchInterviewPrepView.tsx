import React, { useState } from "react";
import {
  BRANCH_INTERVIEW_PREP,
  BranchInterviewPrep,
} from "@/data/careerData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  FileCheck,
  Building2,
  HelpCircle,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

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

export const BranchInterviewPrepView: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].value);
  const prep: BranchInterviewPrep =
    BRANCH_INTERVIEW_PREP[selectedBranch] ||
    BRANCH_INTERVIEW_PREP["Computer Science & Engineering"];

  return (
    <div className="space-y-8">
      {/* Header with Branch Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Engineering Campus Placement & Interview Prep
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Technical assessment topics, interview rounds, and frequent questions tailored for each branch
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

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBranch}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          {/* Top Info Banner: Branch Name & Top Recruiters */}
          <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs font-medium border-primary/30 bg-primary/10 text-primary py-1 px-3"
                >
                  <GraduationCap className="h-4 w-4 mr-1.5 text-primary" />
                  {prep.branch}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Official Placement Preparation Blueprint
                </span>
              </div>
            </div>

            {/* Top Recruiters */}
            <div>
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" />
                Top Campus Recruiters for {prep.shortName}:
              </div>
              <div className="flex flex-wrap gap-2">
                {prep.topRecruiters.map((company, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs py-1 px-3 bg-muted/60 hover:bg-muted font-medium"
                  >
                    {company}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Recruitment Process & Selection Rounds */}
          <div>
            <h4 className="text-base font-bold font-display text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Standard Recruitment Process Stages
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {prep.selectionRounds.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border bg-card p-4 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <Badge className="mb-2 bg-primary/15 text-primary border-primary/20 text-[11px] font-semibold">
                      Stage {idx + 1}
                    </Badge>
                    <h5 className="font-semibold text-sm text-foreground mb-1.5">
                      {r.round}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {r.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Core Topics Checklist */}
          <div>
            <h4 className="text-base font-bold font-display text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Technical Assessment & Core Topics to Revise
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {prep.technicalTopics.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border bg-card p-5 shadow-card space-y-3"
                >
                  <h5 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    {sec.title}
                  </h5>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {sec.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Frequently Asked Technical Interview Questions */}
          <div>
            <h4 className="text-base font-bold font-display text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              Frequently Asked Technical Interview Questions
            </h4>
            <div className="space-y-3">
              {prep.frequentQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border bg-card p-4 sm:p-5 shadow-card hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5">
                      Q{idx + 1}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <h5 className="font-semibold text-sm text-foreground">
                        {q.question}
                      </h5>
                      <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground flex items-start gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Key Answer Focus: </strong>
                          {q.keyFocus}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio & Project Advice */}
          <div className="rounded-xl border bg-primary/5 border-primary/20 p-5 shadow-card">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Resume & Portfolio Advice for {prep.shortName}
            </h4>
            <ul className="grid gap-2 sm:grid-cols-3 text-xs text-muted-foreground">
              {prep.portfolioAdvice.map((advice, idx) => (
                <li
                  key={idx}
                  className="rounded-lg bg-card border p-3 flex items-start gap-2"
                >
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Study Hub Subject Notes & Exam Papers CTA */}
          <div className="rounded-xl bg-hero-gradient p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-1">
                Need Semester Notes & Previous Year Question Papers?
              </h4>
              <p className="text-xs sm:text-sm text-white/90">
                Revise semester-end subjects and mid-exams with verified peer notes and question papers.
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
