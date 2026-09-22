import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { SEMESTERS } from "@/data/academicConstants";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ExamPaperWithProfile } from "@/lib/noteQueries";

interface EditExamPaperModalProps {
  paper: ExamPaperWithProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditExamPaperModal = ({ paper, open, onOpenChange }: EditExamPaperModalProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState<string>("1");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (paper) {
      setTitle(paper.title || "");
      setSubject(paper.subject || "");
      setSemester(paper.semester ? String(paper.semester) : "1");
      setDescription(paper.description || "");
    }
  }, [paper, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paper) return;

    if (!title.trim()) {
      toast.error("Please enter a title for the exam paper.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter the subject name.");
      return;
    }

    setSaving(true);
    try {
      const semNum = Number(semester) || 1;
      const academicYear = Math.ceil(semNum / 2) || 1;

      const { data, error } = await supabase
        .from("exam_papers")
        .update({
          title: title.trim(),
          subject: subject.trim(),
          semester: semNum,
          year: academicYear,
          description: description.trim() || null,
        })
        .eq("id", paper.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Could not update exam paper. You may need permission to update this exam paper.");
      }

      // Invalidate queries so changes reflect everywhere immediately
      queryClient.invalidateQueries({ queryKey: ["my-exam-papers"] });
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] });
      queryClient.invalidateQueries({ queryKey: ["exam-paper", paper.id] });

      toast.success("Exam paper updated successfully!");
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to update exam paper.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exam Paper Details</DialogTitle>
          <DialogDescription>
            Update title, subject, exam category, semester, or year for this paper.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-paper-title">Title / Name *</Label>
            <Input
              id="edit-paper-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., CSE Sem 4 OS Mid-2 Question Paper"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-paper-subject">Subject *</Label>
            <Input
              id="edit-paper-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Operating Systems"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-paper-semester">Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger id="edit-paper-semester">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Sem {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-paper-description">Description (Optional)</Label>
            <Textarea
              id="edit-paper-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional notes about marks pattern, solutions included, etc..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExamPaperModal;
