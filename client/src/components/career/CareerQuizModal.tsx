import React, { useState } from "react";
import {
  CAREER_QUIZ_QUESTIONS,
  CAREER_PATHS,
  CareerPath,
} from "@/data/careerData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, RotateCcw, CheckCircle, Compass } from "lucide-react";
import { CareerPathCard } from "./CareerPathCard";

interface CareerQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCareer: (career: CareerPath) => void;
}

export const CareerQuizModal: React.FC<CareerQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectCareer,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = CAREER_QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);

    if (currentStep < CAREER_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  // Calculate matched career paths based on user answers
  const getMatchedCareers = (): CareerPath[] => {
    if (selectedAnswers.length === 0) return CAREER_PATHS.slice(0, 3);

    const chosenCategories: string[] = [];
    const chosenDepts: string[] = [];

    selectedAnswers.forEach((ansIndex, qIndex) => {
      const q = CAREER_QUIZ_QUESTIONS[qIndex];
      if (q && q.options[ansIndex]) {
        chosenCategories.push(q.options[ansIndex].suggestedCategory);
        chosenDepts.push(...q.options[ansIndex].suggestedDepartments);
      }
    });

    const matches = CAREER_PATHS.filter((path) => {
      const catMatch = chosenCategories.includes(path.category);
      const deptMatch =
        path.department === "All Departments" ||
        chosenDepts.includes(path.department);
      return catMatch || deptMatch;
    });

    return matches.length > 0 ? matches : CAREER_PATHS.slice(0, 3);
  };

  const matchedCareers = getMatchedCareers();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs text-primary w-fit mb-2">
            <Compass className="h-3.5 w-3.5" /> Career Discovery Wizard
          </div>
          <DialogTitle className="text-2xl font-bold">
            {showResults ? "Your Recommended Career Pathways" : "Find Your Ideal Engineering Path"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {showResults
              ? "Based on your interests, tools preference, and goals, here are the top matching career pathways:"
              : `Question ${currentStep + 1} of ${CAREER_QUIZ_QUESTIONS.length}: Answer 3 quick questions to discover tailored roadmaps.`}
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div>
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-1.5 mb-6 overflow-hidden">
              <div
                className="bg-hero-gradient h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / CAREER_QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <h3 className="font-medium text-base sm:text-lg mb-4 text-foreground">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">{opt.label}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              >
                Back
              </Button>
              <div className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {CAREER_QUIZ_QUESTIONS.length}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border bg-primary/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  We found <span className="font-bold text-primary">{matchedCareers.length} career options</span> tailored to your strengths!
                </span>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {matchedCareers.map((career) => (
                <CareerPathCard
                  key={career.id}
                  career={career}
                  onSelect={(item) => {
                    onClose();
                    onSelectCareer(item);
                  }}
                />
              ))}
            </div>

            <div className="border-t pt-4 flex justify-end">
              <Button onClick={onClose} size="sm" className="bg-hero-gradient text-white text-xs">
                Explore All Pathways
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
