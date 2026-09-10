import React from "react";
import { CareerPath } from "@/data/careerData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  TrendingUp,
  Sparkles,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

interface CareerPathCardProps {
  career: CareerPath;
  onSelect: (career: CareerPath) => void;
}

export const CareerPathCard: React.FC<CareerPathCardProps> = ({
  career,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:border-primary/50 relative overflow-hidden"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-primary/20 bg-primary/5 text-primary"
          >
            {career.department}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className={`text-[10px] font-semibold flex items-center gap-1 ${
                career.demandLevel === "Very High"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              }`}
            >
              <TrendingUp className="h-3 w-3" /> {career.demandLevel}
            </Badge>
          </div>
        </div>

        {/* Title & Category */}
        <div className="mb-2">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {career.title}
          </h3>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {career.category}
          </span>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {career.summary}
        </p>

        {/* Salary & Hiring Info */}
        <div className="mb-4 rounded-lg bg-muted/40 p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            <span>Avg Package:</span>
          </div>
          <span className="font-semibold text-foreground">
            {career.avgSalary}
          </span>
        </div>

        {/* Primary Skills */}
        <div className="mb-4">
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Key Skills:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {career.primarySkills.slice(0, 3).map((skill, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-[10px] px-2 py-0.5"
              >
                {skill}
              </Badge>
            ))}
            {career.primarySkills.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{career.primarySkills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Top Recruiters snippet */}
        <div className="mb-4 text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
          <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="truncate">
            Hiring: {career.topRecruiters.slice(0, 3).join(", ")}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <Button
        onClick={() => onSelect(career)}
        variant="outline"
        size="sm"
        className="w-full text-xs font-medium group-hover:bg-hero-gradient group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-200"
      >
        View 4-Year Roadmap & Projects
        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};
