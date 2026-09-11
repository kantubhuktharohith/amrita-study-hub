import React from "react";
import { CareerPath } from "@/data/careerData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
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
      onClick={() => onSelect(career)}
      className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:border-primary/50 relative overflow-hidden cursor-pointer"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Branch / Department */}
        <div className="mb-3">
          <Badge
            variant="outline"
            className="text-xs font-medium border-primary/20 bg-primary/5 text-primary py-1 px-2.5"
          >
            <GraduationCap className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            {career.department}
          </Badge>
        </div>

        {/* Course / Role Name */}
        <div className="mb-5">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {career.title}
          </h3>
        </div>
      </div>

      {/* Action CTA */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(career);
        }}
        variant="outline"
        size="sm"
        className="w-full text-xs font-medium group-hover:bg-hero-gradient group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-200"
      >
        View Roadmap & Details
        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

