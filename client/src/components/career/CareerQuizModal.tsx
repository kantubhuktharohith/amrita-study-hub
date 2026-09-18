import React, { useState } from "react";
import { CAREER_QUIZ_QUESTIONS,CAREER_PATHS,CareerPath } from "@/data/careerData";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle, Compass } from "lucide-react";
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

  // Calculate matched career paths with precision scoring and match percentages
  const getMatchedCareers = (): { career: CareerPath; matchPercentage: number }[] => {
    if (selectedAnswers.length === 0) {
      return CAREER_PATHS.slice(0, 4).map((c) => ({ career: c, matchPercentage: 85 }));
    }

    const scored = CAREER_PATHS.map((career) => {
      let score = 0;
      let maxPossible = 0;

      selectedAnswers.forEach((ansIndex, qIndex) => {
        const q = CAREER_QUIZ_QUESTIONS[qIndex];
        const selectedOpt = q?.options[ansIndex];
        if (!selectedOpt) return;

        maxPossible += 50; // 30 for category + 20 for department

        // Category match (+30 points)
        if (career.category === selectedOpt.suggestedCategory) {
          score += 30;
        }

        // Department match (+20 points)
        if (selectedOpt.suggestedDepartments.includes(career.department)) {
          score += 20;
        } else if (
          career.department === "All Departments" &&
          selectedOpt.suggestedCategory === "Government & Higher Studies"
        ) {
          score += 20;
        }
      });

      // Normalize match percentage between 65% and 98%
      const percentage =
        maxPossible > 0
          ? Math.min(98, Math.max(65, Math.round((score / maxPossible) * 100)))
          : 70;

      return {
        career,
        score,
        matchPercentage: score > 0 ? percentage : 50,
      };
    });

    // Sort by highest match score and select top 4 matches
    const filtered = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const finalResults =
      filtered.length > 0
        ? filtered
        : scored.sort((a, b) => b.score - a.score);

    return finalResults.slice(0, 4);
  };

  const matchedCareers = getMatchedCareers();
  const answeredCount = selectedAnswers.filter((a) => a !== undefined).length;
  const progressPercent = (answeredCount / CAREER_QUIZ_QUESTIONS.length) * 100;

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
              ? "Based on your technical interests, favorite toolkits, and post-grad aspirations, here are your top matches:"
              : `Question ${currentStep + 1} of ${CAREER_QUIZ_QUESTIONS.length}: Answer 3 quick questions to discover tailored roadmaps.`}
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <div>
            {/* Progress bar and counter */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Question {currentStep + 1} of {CAREER_QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[11px] font-medium">
                  {answeredCount === 0
                    ? "0% completed"
                    : `${Math.round(progressPercent)}% completed`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-hero-gradient h-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
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
                {answeredCount} of {CAREER_QUIZ_QUESTIONS.length} answered
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border bg-primary/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  We found <span className="font-bold text-primary">{matchedCareers.length} top career pathways</span> matching your profile!
                </span>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {matchedCareers.map(({ career, matchPercentage }, idx) => (
                <div key={career.id} className="relative group">
                  {/* Match percentage badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        idx === 0
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {idx === 0 ? "🏆 Top Match" : "⭐ Great Fit"} · {matchPercentage}%
                    </span>
                  </div>

                  <CareerPathCard
                    career={career}
                    onSelect={(item) => {
                      onClose();
                      onSelectCareer(item);
                    }}
                  />
                </div>
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
